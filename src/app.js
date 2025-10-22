const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require("./config/database");
const User = require('./model/user');
const { validateSignUp } = require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/authHandler');

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
        const hashPassword = password;
        const user = await User.findOne({ email});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        isValidPassword = await user.comparePassword(hashPassword);
        if(!isValidPassword){
            return res.status(400).json({ message: "Invalid credentials" });
        }else{
            const token = user.getJWT();
            res.cookie('token', token, { expires: new Date(Date.now() + 3600000 * 24 * 7), });
            res.status(200).json({ message: "Login successful" });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

app.get('/profile', userAuth ,async(req, res) => {
    try {
        const user = req.user;
        
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile fetched successfully", data: user });

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

app.post('/sendConnectionRequest', userAuth, async(req, res) => {
    console.log("Send connection request called");
    res.status(200).json({ message: "Connection request sent from " + req.user.firstName + '.' });
})


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port ' + process.env.PORT);
    })
}).catch((err) => {
    console.log("Error connecting to database");
});