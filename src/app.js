const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require("./config/database");
const User = require('./model/user');
const { validateSignUp } = require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());

// Signup to user route
app.post('/signup', async (req, res) => {
    try {
        validateSignUp(req);
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({ message: "Invalid credentials" });
        }else{
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
            res.cookie('token', token);
            res.status(200).json({ message: "Login successful" });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

app.get('/profile', async(req, res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        const user = await User.findById(req.userId);
        console.log(user);
        
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile fetched successfully", data: user });

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

// get single user by emailId
app.get('/singleuser', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(200).json(user);
        } else {
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
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
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
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
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
app.patch('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = req.body;
        console.log(data);

        const allowedUpdates = ['firstName', 'lastName', 'gender', "skills"];
        const isValidPayload = Object.keys(data).every((key) => allowedUpdates.includes(key));
        if (!isValidPayload) {
            throw new Error("Invalid payload!");
        }
        if (data?.skills?.length > 4) {
            throw new Error("A user can have maximum 4 skills");
        }

        const result = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
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