import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const authTimeout = (expiresIn) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expiresIn * 1000)
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch (authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        // get the endpoint url and data to pass from Firebase Auth REST API | Firebase 
        // key is under Authentication > web setup apikey
        let url ='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDqyIIYGWurktFyN1D7QZuLe0ImYEYzxKk';
        if (!isSignup) {
           url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDqyIIYGWurktFyN1D7QZuLe0ImYEYzxKk'
        };

        axios.post(url, authData)
            .then(response => {
                const expiryDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expiryDate', expiryDate)
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(authTimeout(response.data.expiresIn));
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error));
            });
    };
}

export const setAuthRedirectPath = ( path ) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expiryDate = new Date(localStorage.getItem('expiryDate'));
            if (expiryDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId));
                dispatch(authTimeout((expiryDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}