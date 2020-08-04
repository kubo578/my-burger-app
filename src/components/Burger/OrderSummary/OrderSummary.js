import React, { Component } from 'react';

import Aux from '../../../hoc/Auxillary/Auxillary'
import Button from '../../UI/Button/Button'

class OrderSummary extends Component{
    componentWillUpdate = () => {
        console.log('[orderSummary] component will update');
    }

    render() {
        const ingredients = Object.keys(this.props.ingredients)
        .map(igkey => {
            return <li key={igkey}>
                <span style={{textTransform: 'capitalize'}}>
                    {igkey}
                </span>:
                {this.props.ingredients[igkey]}
            </li>
        });
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A burger with the following ingredients:</p>  
                <ul>
                    {ingredients}
                </ul>
                <p>Total Price: £<strong>{this.props.totalPrice.toFixed(2)}</strong></p>
                <Button 
                    clicked={this.props.orderCancel}
                    btnType="Danger" >Cancel</Button>
                <Button
                    clicked={this.props.orderContinue} 
                    btnType="Success">Continue</Button>
            </Aux>
        )
    }
}

export default OrderSummary