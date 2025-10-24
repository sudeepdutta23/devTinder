const express = require('express');
const { userAuth } = require('../middlewares/authHandler');
const { validateProfileUpdate, validatePasswordUpdate } = require('../utils/validate');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/profile/view', userAuth ,async(req, res) => {
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

router.patch('/profile/edit', userAuth, async(req, res) =>{
    try {
    validateProfileUpdate(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) =>{
        loggedInUser[key] = req.body[key];
    })
    await loggedInUser.save();
    return  res.status(200).json({ message: `${loggedInUser.firstName}, your profile updated successfully`, data: loggedInUser });
    }catch(error){
        return res.status(400).json({ message: error.message });
    }
})

router.patch('/profile/password', userAuth, async(req, res) =>{
    try {   
        validatePasswordUpdate(req);
        const loggedInUser = req.user;
        const { oldPassword, newPassword } = req.body;
        const isValidPassword = await loggedInUser.comparePassword(oldPassword);
        if(!isValidPassword){
            return res.status(400).json({ message: "Invalid old password" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();
        return res.status(200).json({ message: "Password updated successfully" });
    }catch(error){
        return res.status(400).json({ message: error.message });
    }   
})


module.exports = router;
