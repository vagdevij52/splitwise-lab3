import {
    SET_PROFILE
  } from '../actions/profileActions';

const initialState = {
    username: '',
    email: '',
    avatar: '',
    phone:'',
    defaultCurrency:'',
    timezone:'',
    language:''
    };
    
    const profileReducer = ( state = initialState, action)=>{
    console.log("Profile Reducer action type: "+action.type);
    switch(action.type){
        case 'SET_PROFILE':
            return{
            ...state,
            username : action.payload.username,
            email : action.payload.email,
            avatar : action.payload.avatar,
            phone : action.payload.phone,
            defaultCurrency : action.payload.defaultCurrency,
            timezone : action.payload.timezone,
            language : action.payload.language
            }
        case 'GET_PROFILE':
            return{
                ...state,
                profile: action.payload,
                loading:false
            }
        default:
            console.log('profile reducer default case');
            return state;
    }
    };
    
    export default profileReducer;