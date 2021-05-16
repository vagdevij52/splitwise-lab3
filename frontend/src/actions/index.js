console.log("dispatching the action creator:: ");
const logged = (username,email) => ({
    type: 'LOG_IN',
    payload: {username: username, email: email}
});

const setProfile = (username,email,avatar,phone,defaultCurrency,timezone,language) => ({
    type: 'SET_PROFILE',
    payload: {username: username, email: email, avatar: avatar, phone: phone, defaultCurrency: defaultCurrency, timezone: timezone, language: language}
});

const signed= (username) => ({
    type: 'SIGN_IN',
    payload: username
});

export {  logged  , setProfile as default};