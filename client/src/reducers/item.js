import * as types from '../constants/ActionTypes'

export const itemState = {
    items: [],
    tabData: [],
};

export default function(state = itemState, action) {
    switch(action.type) {

        case types.ALL_ITEMS: {
            return {
                ...state,
                items: action.payload,
            }
        }

        case types.TAB_DATA: {
            return {
                ...state,
                tabData: action.payload,
            }
        }

        default:
            return state;
    }
}
