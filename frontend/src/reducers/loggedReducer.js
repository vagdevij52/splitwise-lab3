import {
    LOG_IN
  } from '../actions/loginActions';

const initialState = {
username: '',
email: ''
};

const loggedReducer = ( state = initialState, action)=>{
console.log("Logged Reducer action type: "+action.type);
switch(action.type){
    case 'LOG_IN':
        return{
        ...state,
        username : action.payload.username,
        email: action.payload.email
        }
    default:
        console.log('here');
        return state;
}
};

export default loggedReducer;