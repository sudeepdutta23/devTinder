const express = require('express');
const { userAuth } = require('../middlewares/authHandler');

const router = express.Router();

router.get('/profile', userAuth ,async(req, res) => {
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


module.exports = router;
