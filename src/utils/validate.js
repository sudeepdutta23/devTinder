const validator = require('validator');
validateSignUp = (req) =>{
    const { firstName, lastName, email, password } = req.body;
    if(validator.isEmpty(firstName) || validator.isEmpty(lastName)){
        throw new Error('First name and last name cannot be empty');
    }else if(!email){
        throw new Error('Email cannot be empty');
    }else if(!password){
        throw new Error('Password cannot be empty');
    }else if(!validator.isEmail(email)){
        throw new Error('Invalid email format');
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong enough');
    }
}

module.exports = {
    validateSignUp
}