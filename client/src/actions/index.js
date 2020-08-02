import axios from 'axios';
import * as types from '../constants/ActionTypes'
import store from "../store";

import { Config } from '../config/config';
const configFormData = {     
    headers: { 'content-type': 'multipart/form-data' }
}

// axios.defaults.baseURL = Config.api_url;

// Shopper
export const signup = (userData) => dispatch => {
    axios
        .post("/user/signup", userData)
        .then(res => {
            if(res.data.success === true) {
                window.location = "/"
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })                
            }
        })
        .catch(err => console.log(err));
}

export const login = (userData) => dispatch => {
    
    axios
        .post("/user/login", userData)
        .then(res => {
            if(res.data.success === true) {

                if(res.data.user.role === 0) {   //Admin

                    dispatch({
                        type: types.ADMIN_LOGIN,
                        user: res.data.user,
                        token: res.data.token
                    })

                    localStorage.setItem("isLogin", true);
                    localStorage.setItem("role", 0);
                    window.location = "/brands";

                } else if(res.data.user.role === 1){      //Shopper

                    dispatch({
                        type: types.USER_LOGIN,
                        user: res.data.user,
                        token: res.data.token
                    })
    
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    localStorage.setItem("isLogin", true);
                    localStorage.setItem("role", 1);
                    localStorage.setItem("token", res.data.token);
    
                    window.location = "/brands";
                }

            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })                
            }
        })
        .catch(err => console.log(err));
}

export const logout = () => dispatch => {
    dispatch({
        type: types.LOGOUT,
    })

    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("isLogin");

    window.location = "/";
}

export const initializeAll = () => dispatch => {
    dispatch({
        type: types.INITIALIZE_ALL_VALUE,
    })
}

export const allBrands = () => dispatch => {
    
    axios
        .post("/brand/allBrands")
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_BRANDS,
                    payload: res.data.brands
                })
            } else {
                alert(res.data.errMessage)
            }
        })
        .catch( err => console.log(err));
}

export const addBrand = (brandObj) => dispatch => {

    axios
        .post("/brand/addBrand", brandObj, configFormData)
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_BRANDS,
                    payload: res.data.brands
                })

                window.location = "/addRemoveBrand";
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch( err => console.log(err));
}

export const updateBrand = (brandObj) => dispatch => {

    axios
        .post("/brand/updateBrand", brandObj, configFormData)
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_BRANDS,
                    payload: res.data.brands
                })

                window.location = "/addRemoveBrand";
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch( err => console.log(err));
}

export const deleteBrand = (id) => dispatch => {

    // axios.defaults.headers.get['x-access-token'] = localStorage.getItem('token');
    axios
        .post(`/brand/deleteBrand/${id}`)
        .then( res => {
            if (res.data.success === true) {
                dispatch({
                    type: types.ALL_BRANDS,
                    payload: res.data.brands
                })

                window.location = "/addRemoveBrand";
            } else {    
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch(error => {
            console.log(error);
            // dispatch({ type: types.USER_ERROR, payload: 'Server Connection Error, Try Later.' })
        });
}

export const activateBrand = (id) => dispatch => {

    axios
        .post(`/brand/activateBrand/${id}`)
        .then( res => {
            if (res.data.success === true) {
                dispatch({
                    type: types.ALL_BRANDS,
                    payload: res.data.brands
                })

                window.location = "/addRemoveBrand";
            } else {    
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const allItems = () => dispatch => {
    
    axios
        .post("/item/allItems")
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_ITEMS,
                    payload: res.data.items
                })
            } else {
                alert(res.data.errMessage)
            }
        })
        .catch( err => console.log(err));
}

export const addItem = (itemObj) => dispatch => {
    axios
        .post("/item/addItem", itemObj, configFormData)
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_ITEMS,
                    payload: res.data.items
                })

                window.location = `/brands/${store.getState().currentStatus.currentBrandId}`;
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch( err => console.log(err));
}

export const updateItem = (itemObj, currentTabStatus) => dispatch => {

    let tabIndex = 0;
    if(currentTabStatus !== undefined) {
        switch(currentTabStatus) {
            case "Submitted":
                tabIndex = 0;
                break;
            case "Approved":
                tabIndex = 1;
                break;
            case "Arabic":
                tabIndex = 2;
                break;
            case "Completed":
                tabIndex = 3;
                break;
            case "Confirmed":
                tabIndex = 4;
                break;
            case "Done":
                tabIndex = 5;
                break;
            default:
                tabIndex = 0;
                break;
        }

    }

    axios
        .post("/item/updateItem", itemObj, configFormData)
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_ITEMS,
                    payload: res.data.items
                })

                dispatch({
                    type: types.SET_SIDEBAR_MENUITEM,
                    payload: store.getState().currentStatus.currentBrandId,
                    payload2: tabIndex
                })

                window.location = `/brands/${store.getState().currentStatus.currentBrandId}`;
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch( err => console.log(err));
}

export const updateItemStatus = (itemObj, currentTabStatus) => dispatch => {

    let tabIndex = 0;
    if(currentTabStatus !== undefined) {
        switch(currentTabStatus) {
            case "Submitted":
                tabIndex = 0;
                break;
            case "Approved":
                tabIndex = 1;
                break;
            case "Arabic":
                tabIndex = 2;
                break;
            case "Completed":
                tabIndex = 3;
                break;
            case "Confirmed":
                tabIndex = 4;
                break;
            case "Done":
                tabIndex = 5;
                break;
            default:
                tabIndex = 0;
                break;
        }

    }

    axios
        .post("/item/updateItemStatus", itemObj)
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_ITEMS,
                    payload: res.data.items
                })

                dispatch({
                    type: types.SET_SIDEBAR_MENUITEM,
                    payload: store.getState().currentStatus.currentBrandId,
                    payload2: tabIndex
                })

                window.location = `/brands/${store.getState().currentStatus.currentBrandId}`;
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch( err => console.log(err));
}

export const deleteItem = (id) => dispatch => {

    // axios.defaults.headers.get['x-access-token'] = localStorage.getItem('token');
    axios
        .delete(`/item/deleteItem/${id}`)
        .then( res => {
            if (res.data.success === true) {
                dispatch({
                    type: types.ALL_ITEMS,
                    payload: res.data.items
                })

                window.location = `/brands/${store.getState().currentStatus.currentBrandId}`;
            } else {    
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch(error => {
            console.log(error);
            // dispatch({ type: types.USER_ERROR, payload: 'Server Connection Error, Try Later.' })
        });
}


export const allUsers = () => dispatch => {
    
    axios
        .post("/user/allUsers")
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_USERS,
                    payload: res.data.users
                })
                console.log(res.data)
            } else {
                alert(res.data.errMessage)
            }
        })
        .catch( err => console.log(err));
}

export const addUser = (userObj) => dispatch => {

    axios
        .post("/user/addUser", userObj)
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_USERS,
                    payload: res.data.users
                })

                window.location = `/users`;
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch( err => console.log(err));
}

export const updateUser = (userObj) => dispatch => {

    axios
        .post("/user/updateUser", userObj)
        .then(res => {
            if(res.data.success === true) {
                dispatch({
                    type: types.ALL_USERS,
                    payload: res.data.users
                })

                window.location = `/users`;
            } else {
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch( err => console.log(err));
}

export const deleteUser = (id) => dispatch => {

    axios
        .delete(`/user/deleteUser/${id}`)
        .then( res => {
            if (res.data.success === true) {
                dispatch({
                    type: types.ALL_USERS,
                    payload: res.data.users
                })

                window.location = `/users`;
            } else {    
                dispatch({
                    type: types.UNKNOWN_ERROR,
                    payload: res.data.errMessage
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const setSidebarMenuItem = (menu) => dispatch => {

    dispatch({
        type: types.SET_SIDEBAR_MENUITEM,
        payload: menu,
        payload2: 0
    })
}