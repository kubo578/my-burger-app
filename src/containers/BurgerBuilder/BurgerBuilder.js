import React, { Component } from 'react';

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

export class BurgerBuilder extends Component {

    state = {
        orderNow: false,
    }

    componentDidMount () {
        this.props.onInitIngredients();
    }

    updatePurchaseableState () {
        const sum = Object.keys(this.props.ingredients)
            .map((igkey) => {
                return this.props.ingredients[igkey];
            })
            .reduce((sum, ele)=>{
                return sum + ele;
            }, 0);
        return (sum > 0); 
    }

    orderNowHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({orderNow: true})
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    orderCancelHandler = () => {
        this.setState({orderNow: false})
    }
    
    orderContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {...this.props.ingredients};

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.props.error 
            ? <p>ingredients could not be loaded</p> 
            : <Spinner />

        if (this.props.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ingredients}/>
                    <BuildControls 
                        addIngredient={this.props.onAddIngredient}
                        removeIngredient={this.props.onRemoveIngredient}
                        disabledInfo={disabledInfo}
                        price={this.props.totalPrice}
                        isPurchaseable={this.updatePurchaseableState()}
                        orderNow={this.orderNowHandler}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary
                orderContinue={this.orderContinueHandler}
                orderCancel={this.orderCancelHandler}
                ingredients={this.props.ingredients}
                totalPrice={this.props.totalPrice}
            />
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