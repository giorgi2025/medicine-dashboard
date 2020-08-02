import * as types from '../constants/ActionTypes'

export const itemState = {
    items: [],
};

export default function(state = itemState, action) {
    switch(action.type) {

        case types.ALL_ITEMS: {
            return {
                ...state,
                items: action.payload,
            }
        }

        default:
            return state;
    }
}
