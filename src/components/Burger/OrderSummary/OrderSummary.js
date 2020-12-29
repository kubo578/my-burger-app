import React from 'react';

import Aux from '../../../hoc/Auxillary/Auxillary'
import Button from '../../UI/Button/Button'

const OrderSummary = (props) => {
        const ingredients = Object.keys(props.ingredients)
        .map(igkey => {
            return <li key={igkey}>
                <span style={{textTransform: 'capitalize'}}>
                    {igkey}
                </span>:
                {props.ingredients[igkey]}
            </li>
        });
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A burger with the following ingredients:</p>  
                <ul>
                    {ingredients}
                </ul>
                <p>Total Price: £<strong>{props.totalPrice.toFixed(2)}</strong></p>
                <Button 
                    clicked={props.orderCancel}
                    btnType="Danger" >Cancel</Button>
                <Button
                    clicked={props.orderContinue} 
                    btnType="Success">Continue</Button>
            </Aux>
        )
}

export default OrderSummary