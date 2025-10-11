const adminAuth = (req,res, next) =>{
    req.token = "xyz"
    console.log("Admin auth called");
    if(req.token === "xyz"){
        next()
    }else{
        res.status(401).send("Unauthorized Access");
    }

}

const userAuth = (req,res, next) =>{
    req.token = "xyz"
    console.log("User auth called");
    if(req.token === "xyz"){
        next()
    }else{
        res.status(401).send("Unauthorized Access");
    }

}

module.exports = { adminAuth, userAuth }