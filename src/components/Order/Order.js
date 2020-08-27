import React, { Component } from 'react';

import classes from './Order.module.css';

const order = (props) => {
    const ingredients = [];

    for (let ingredientName in props.ingredients) {
        ingredients.push({
            name: ingredientName,
            qty: props.ingredients[ingredientName]})            
    }

    const ingredientOutput = ingredients.map(ingredient=>{
        return <span 
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
            }}
            key={ingredient.name}>{ingredient.name} ({ingredient.qty})</span>
    });

    return (
    
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
    <p>Price: <strong>£ {props.price.toFixed(2)}</strong></p>
        </div>
    );
    
} 
export default order;