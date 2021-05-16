const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports =  function validateRegisterInput(data){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = 'Name must be 2 and 30 characters';
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Name field is empty';
    }

    if(Validator.isEmpty(data.email)){
        errors.email = 'Email field is empty';
    }

    if(!Validator.isEmail(data.email)){
        errors.email = 'Email field is invalid';
    }

    if(!Validator.isLength(data.password, {min: 8, max: 30})){
        errors.password = 'Passowrd must be 8 and 30 characters';
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'Password field is empty';
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = 'Confirm password field is empty';
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.password = 'password and confirm password are not matching';
    }




    return {
        errors,
        isValid: isEmpty(errors)
    }
}