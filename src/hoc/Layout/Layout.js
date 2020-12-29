import React, { useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../Auxillary/Auxillary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

const Layout = props => {
   const [showSideDrawer, setSideDrawer] = useState(false)

   const sideDrawerClosedHandler = () => {
       setSideDrawer(false);
   }

   const sideDrawerToggleHandler = () => {
       setSideDrawer(!showSideDrawer);
   }

    return (
        <Aux>
            <Toolbar
                isAuthenticated={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler}
            />
            <SideDrawer
                isAuthenticated={props.isAuthenticated}
                open={showSideDrawer}
                closed={sideDrawerClosedHandler} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}
export default connect(mapStateToProps)(Layout);
