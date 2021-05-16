import {combineReducers} from 'redux';
import loggedReducer from './loggedReducer';
import profileReducer from './profileReducer';


const allReducers = combineReducers({loggedReducer: loggedReducer, profileReducer: profileReducer});

export default allReducers;