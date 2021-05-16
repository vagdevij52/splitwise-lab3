
console.log("In User Actions");
const logged = (username,email) => ({
    type: 'LOG_IN',
    payload: {username: username, email:email}
});

export {  logged  as default};