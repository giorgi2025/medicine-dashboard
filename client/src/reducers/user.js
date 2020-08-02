import * as types from '../constants/ActionTypes'


export const userState = {
    user: {},
    token: "",
    isLogin: false,
    users: [],
};

export default function(state = userState, action) {
    switch(action.type) {

        case types.USER_LOGIN: {
            return {
                ...state,
                user: action.user,
                token: action.token,
                isLogin: true
            }
        }

        case types.ADMIN_LOGIN: {
            return {
                ...state,
                user: action.user,
                token: action.token,
                isLogin: true
            }
        }

        case types.ALL_USERS: {
            return {
                ...state,
                users: action.payload
            }
        }

        case types.ADD_NEW_USER: {
            return {
                ...state,
                users: [...state.users, action.payload]
            }
        }

        case types.UPDATE_USER: {

            const  newData=[]
            state.users.map((user)=>{                
                if(user._id === action.payload._id){
                    user = action.payload
                }
                newData.push(user)
                
            })
            return {...state,users:newData}
        }

        case types.DELETE_USER: {
            return {
                ...state,
                users: state.users.filter(item => item._id !== action.id)
            }
        }

        default:
            return state;
    }
}
