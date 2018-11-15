import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import pins from './pinReducer';

import resetReducer from './resetReducer';
import locale from './locale';
import { RESET_APP } from '../actions/types';




const appReducer =  combineReducers({
    errors:errorReducer,
    auth:  authReducer,
     pins,
    message: resetReducer,
    locale

});

export default (state, action) => {
    const stateCopy = action.type === RESET_APP ? undefined : { ...state }
    return appReducer(stateCopy, action)
}
