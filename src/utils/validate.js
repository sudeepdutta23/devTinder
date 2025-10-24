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

validateProfileUpdate = (req) => {
    const allowedUpdates = ['firstName', 'lastName', 'gender', 'age', 'photoUrl', 'about', 'skills'];
    const isUpdateValid = Object.keys(req.body).every((key)=> allowedUpdates.includes(key));
     if(!isUpdateValid){
        throw new Error("Invalid updates! Please check the fields to be updated.");
    }
    const { firstName, lastName, gender, age, photoUrl, about, skills } = req.body;

    if(skills && skills.length > 5){
        throw new Error('You can add maximum 5 skills');
    }
    else if(validator.isEmpty(firstName) || validator.isEmpty(lastName)){
        throw new Error('First name and last name cannot be empty');
    }else if(photoUrl && !validator.isURL(photoUrl)){
        throw new Error('Invalid photo URL');
    }

}

const validatePasswordUpdate = (req) => {
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
        throw new Error('Old password and new password cannot be empty');
    }else if(!validator.isStrongPassword(newPassword)){
        throw new Error('New password is not strong enough');
    }
}   

module.exports = {
    validateSignUp,
    validateProfileUpdate,
    validatePasswordUpdate}