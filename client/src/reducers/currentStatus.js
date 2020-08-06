import * as types from '../constants/ActionTypes'

export const currentStatus = {
    unknown_error: "",
    currentBrandId: "",
    currentTabIndex: 0,
    uploadedFile: null,
};

export default function(state = currentStatus, action) {
    switch(action.type) {

        case types.INITIALIZE_ALL_VALUE:
            return {
                ...state,
                unknown_error: "",
                uploadedFile: null,
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

        case types.SET_UPLOADED_FILE: {
            return {
                ...state,
                uploadedFile: action.payload
            }
        }

        case types.CANCEL_UPLOADED_FILE: {
            return {
                ...state,
                uploadedFile: null
            }
        }
        
        default:
            return state;
    }
}
