import React, { useState, useEffect } from 'react';

import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

export const BurgerBuilder = props => {

    const [orderNow, setOrderNow] = useState(false);

    const { onInitIngredients } = props;

    useEffect(() => {
        onInitIngredients()
    }, [onInitIngredients]);

    const updatePurchaseableState = () => {
        const sum = Object.keys(props.ingredients)
            .map((igkey) => {
                return props.ingredients[igkey];
            })
            .reduce((sum, ele) => {
                return sum + ele;
            }, 0);
        return (sum > 0);
    }

    const orderNowHandler = () => {
        if (props.isAuthenticated) {
           setOrderNow(true)
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const orderCancelHandler = () => {
        setOrderNow(false);
    }

    const orderContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('/checkout');
    }

    const disabledInfo = { ...props.ingredients };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = props.error
        ? <p>ingredients could not be loaded</p>
        : <Spinner />

    if (props.ingredients) {
        burger = (
            <Aux>
                <Burger ingredients={props.ingredients} />
                <BuildControls
                    addIngredient={props.onAddIngredient}
                    removeIngredient={props.onRemoveIngredient}
                    disabledInfo={disabledInfo}
                    price={props.totalPrice}
                    isPurchaseable={updatePurchaseableState()}
                    orderNow={orderNowHandler}
                    isAuthenticated={props.isAuthenticated}
                />
            </Aux>
        );
        orderSummary = <OrderSummary
            orderContinue={orderContinueHandler}
            orderCancel={orderCancelHandler}
            ingredients={props.ingredients}
            totalPrice={props.totalPrice}
        />
    }

    return (
        <Aux>
            <Modal
                show={orderNow}
                modalClosed={orderCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    )
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps =  dispatch => {
    return {
        onAddIngredient: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onRemoveIngredient: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorhandler(BurgerBuilder, axios));