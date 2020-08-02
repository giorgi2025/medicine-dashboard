import { combineReducers } from 'redux';

// Import custom components
import userReducer from './user';
import currentStatusReducer from './currentStatus';
import brandReducer from './brand';
import itemReducer from './item';

const appReducer = combineReducers({
    user: userReducer,
    currentStatus: currentStatusReducer,
    brand: brandReducer,
    item: itemReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined
  }  
  return appReducer(state, action)
}

export default rootReducer;