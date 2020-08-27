import React, { Component } from 'react';

import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        isPurchaseable: false,
        orderNow: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        console.log('[BurgerBuilder-> componentDidMount]', this.props)
        axios.get('https://react-my-burger-b1e92.firebaseio.com/ingredients.json')
            .then( response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true})
            });
    }

    updatePurchaseableState (ingredients) {
        const sum = Object.keys(ingredients)
            .map((igkey) => {
                return ingredients[igkey];
            })
            .reduce((sum, ele)=>{
                return sum + ele;
            }, 0);
            console.log('sum', sum)
        this.setState({isPurchaseable: sum > 0}) 
    }

    addIngredientHandler = (type) => {
        const newCount = this.state.ingredients[type] + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        console.log('updatedIngrdients', updatedIngredients);
        updatedIngredients[type] = newCount;
        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseableState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] > 0){
            const newCount = this.state.ingredients[type] - 1;
            const updatedIngredients = {
                ...this.state.ingredients
            };
            updatedIngredients[type] = newCount;
            const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
            this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
            this.updatePurchaseableState(updatedIngredients);
        }  
    }

    orderNowHandler = () => {
        this.setState({orderNow: true})
    }

    orderCancelHandler = () => {
        this.setState({orderNow: false})
    }
    
    orderContinueHandler = () => {
        // // alert('You Coninued!');
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice)
        // console.log ('queryParams', queryParams)
        const queryString = queryParams.join('&');
        // console.log ('queryString', queryString);

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render () {
        const disabledInfo = {...this.state.ingredients};

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.state.error 
            ? <p>ingrediens can't be loaded</p> 
            : <Spinner />

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        addIngredient={this.addIngredientHandler}
                        removeIngredient={this.removeIngredientHandler}
                        disabledInfo={disabledInfo}
                        price={this.state.totalPrice}
                        isPurchaseable={this.state.isPurchaseable}
                        orderNow={this.orderNowHandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary
                orderContinue={this.orderContinueHandler}
                orderCancel={this.orderCancelHandler}
                ingredients={this.state.ingredients}
                totalPrice={this.state.totalPrice}
            />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal 
                    show={this.state.orderNow}
                    modalClosed={this.orderCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        ) 
    }
}
export default withErrorhandler(BurgerBilder, axios);