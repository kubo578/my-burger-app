import React from 'react';

import classes from './Logo.module.css';
import burgerLogo from '../../assets/images/burger-logo.png';

const logo = (props) => (
    <div className={classes.Logo}>
        <img alt="MyBurger" src={burgerLogo} />
    </div>
);

export default logo;
