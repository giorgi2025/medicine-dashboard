import * as types from '../constants/ActionTypes'

export const currentStatus = {
    unknown_error: "",
    currentBrandId: "",
    currentTabIndex: 0,
};

export default function(state = currentStatus, action) {
    switch(action.type) {

        case types.INITIALIZE_ALL_VALUE:
            return {
                ...state,
                unknown_error: "",
            }

        case types.UNKNOWN_ERROR: {
            return {
                ...state,
                unknown_error: action.payload
            }
        }

        case types.SET_SIDEBAR_MENUITEM: {
            return {
                ...state,
                currentBrandId: action.payload,
                currentTabIndex: action.payload2,
            }
        }
        
        default:
            return state;
    }
}
