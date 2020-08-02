import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {removeFromCart} from '../actions'
import {getCartTotal} from '../services'

const CartContainer = ({isLogin,cartList, total, symbol, removeFromCart}) => (
     <li  className="onhover-div mobile-cart"><div className="cart-qty-cls">{cartList.length}</div>
        <Link to={`${process.env.PUBLIC_URL}/cart`}><img src={`${process.env.PUBLIC_URL}/assets/images/icon/shopping-cart.png`} className="img-fluid" alt=""/>
            <i className="fa fa-shopping-cart"></i></Link>


    </li>
)


function mapStateToProps(state) {
    return {
        cartList: state.cartList.cart,
        total: getCartTotal(state.cartList.cart),
        symbol: state.data.symbol,
        isLogin:state.auth.isLogin
    }
}

export default connect(mapStateToProps, {removeFromCart})(CartContainer);
