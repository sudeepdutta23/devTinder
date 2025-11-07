const mongoose = require('mongoose');
const { Schema, Model } = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const e = require('express');

const userSchema = new Schema({
    firstName: { 
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: { type: String },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(v) {
            if(!validator.isEmail(v)){
                throw new Error("Email is invalid");
            }
        }
    },
    password: { 
        type: String,
        required: true,
        validate(v) {
            if(!validator.isStrongPassword(v)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    gender: { 
        type: String, 
        lowercase: true,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender type'
        },
        // validate(v) {
        //     if(!['male', 'female', 'other'].includes(v)){
        //         throw new Error("Gender data is invalid");
        //     }
        // },
    },
    isPremium: { type: Boolean, default: false },
    membershipType: { type: String },
    age: { 
        type: Number,
        min: 18
     },
    photoUrl: { 
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmMDGg7R6MmM2jaF1p9m-xg8Qw7-KxQHVlQQ&s",
         validate(v) {
            if(!validator.isURL(v)){
                throw new Error("URL is invalid");
            }
        }
     },
    about: { 
        type: String,
        default: "This user prefers to keep an air of mystery about them."
    },
    skills: { type: [String] },
},
{
    timestamps: true
})

userSchema.methods.getJWT = function() {
    const user = this;
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
};

userSchema.methods.comparePassword = async function(password) {
    const user = this;
    const hashPassword = user.password;
    return await bcrypt.compare(password, hashPassword);
}

module.exports = mongoose.model('User', userSchema);