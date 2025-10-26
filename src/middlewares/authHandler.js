const jwt = require('jsonwebtoken');
const User = require('../model/user');

const adminAuth = (req,res, next) =>{
    req.token = "xyz"
    if(req.token === "xyz"){
        next()
    }else{
        res.status(401).send("Unauthorized Access");
    }

}

const userAuth = async(req,res, next) =>{
    try {
         const token = req.cookies.token;
            if(!token){
                return res.status(401).json({ message: "Invalid Token!!!" });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { _id }= decoded;
            
            const user = await User.findById(_id);

    if(user){
        req.user = user;
        next()
    }else{
        res.status(401).send("User not found");
    }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }

}

module.exports = { adminAuth, userAuth }