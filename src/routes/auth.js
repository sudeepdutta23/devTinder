const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const { validateSignUp } = require('../utils/validate');

router.post('/signup', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

module.exports = router;