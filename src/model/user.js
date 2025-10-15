const mongoose = require('mongoose');
const { Schema, Model } = mongoose;

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
    },
    password: { 
        type: String,
        required: true,
    },
    gender: { 
        type: String, 
        lowercase: true,
        validate(v) {
            if(!['male', 'female', 'other'].includes(v)){
                throw new Error("Gender data is invalid");
            }
        },
    },
    age: { 
        type: Number,
        min: 18
     },
    photoUrl: { 
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmMDGg7R6MmM2jaF1p9m-xg8Qw7-KxQHVlQQ&s"
     },
    about: { 
        type: String,
        default: "This user prefers to keep an air of mystery about them."
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);