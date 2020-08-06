import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.scss';
import App from './components/app';
import { ScrollContext } from 'react-router-scroll-4';

import Brands from './components/brands/brands';
import AddRemoveBrand from './components/addRemoveBrand/addRemoveBrand';
import Users from './components/users/users';
import Login from './components/auth/login';
import Signup from './components/auth/signup';

import store from './store';
import { allBrands, allItems, allUsers } from './actions';

class Root extends Component {
    render() {

        store.dispatch(allBrands());
        store.dispatch(allItems());
        if( localStorage.getItem("role") === "0" ) {
            store.dispatch(allUsers());
        }

        return (
        	<Provider store={store}>
                <BrowserRouter basename={'/'}>
                <ScrollContext>
                    <Switch>
                        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login} />
                        <Route exact path={`${process.env.PUBLIC_URL}/auth/login`} component={Login} />
                        <Route exact path={`${process.env.PUBLIC_URL}/auth/signup`} component={Signup} />

                        <App>
                            <Route path={`${process.env.PUBLIC_URL}/brands`} component={Brands} />
                            <Route path={`${process.env.PUBLIC_URL}/addRemoveBrand`} component={AddRemoveBrand} />                            
                            <Route path={`${process.env.PUBLIC_URL}/users`} component={Users} />
                        </App>
                    </Switch>
                </ScrollContext>
            </BrowserRouter>
            </Provider>
        )
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));


