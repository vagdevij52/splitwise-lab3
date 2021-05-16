import axios from 'axios';

import {SET_PROFILE, GET_PROFILE} from './types';

console.log("In Profile Actions");
export const setProfile = (username,email,avatar,phone,defaultCurrency,timezone,language) => ({
    type: 'SET_PROFILE',
    payload: {username: username, email: email, avatar: avatar, phone: phone, defaultCurrency: defaultCurrency, timezone: timezone, language: language}
});

// Get Current Profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get("http://54.227.195.128:4000/api/profile")
    .then(res=>
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    )
    .catch(err=>
        dispatch({
            type: GET_PROFILE,
            payload: {}
        })
        );
}

export const setProfileLoading = () => {

}
export {  setProfile  as default};