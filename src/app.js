const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require("./config/database");
const User = require('./model/user');


app.use(express.json());

// Signup to user route
app.post('/signup', async(req, res) => {
try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
} catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
}
});

// get single user by emailId
app.get('/singleuser', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({ message: "No user found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error fetching users" });
    }
});


// Get all users route
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length > 0){
            res.status(200).json(users);
        }else{
            res.status(404).json({ message: "No user found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error fetching users" });
    }
})

// Get users by email route
app.get('/user', async (req, res) => {
    try {
        const users = await User.find({ email: req.body.email })
        if(users.length > 0){
            res.status(200).json(users);
        }else{
            res.status(404).json({ message: "No user found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error fetching users" });
    }
});

// Delete user by id route
app.delete('/user', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.body._id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting user" });
    }
})

// Update user by id route
app.patch('/user', async (req, res) => {
    try {
        console.log(req.body);
        
        const result = await User.findByIdAndUpdate(req.body.userId, req.body);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error updating user" });
    }
})


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port ' + process.env.PORT);
    })
}).catch((err) => {
    console.log("Error connecting to database");
});