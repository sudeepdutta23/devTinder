const express = require('express');
const app = express();
const PORT = process.env.PORT || 7777;
const { userAuth, adminAuth } = require("./middlewares/authHandler")

// app.use("/user", RH1, RH2, RH3, RH4);
app.use("/user",userAuth);
app.use("/admin", adminAuth);

function RH1 (req, res, next) {
console.log("Inside RH1");
next();
}

function RH2 (req, res, next) {
console.log("Inside RH2");
next(); 
}
function RH3 (req, res, next) {
console.log("Inside RH3");
next(); 
}
function RH4 (req, res, next) {
console.log("Inside RH4");
next(); 
}

app.get("/user", (req, res, next) => {
    res.send({
        firstName: "Sudeep",
        lastName: "Dutta",
        age: 25
    });
})

app.post("/user", (req, res, next) => {
    console.log(req.body);
    res.send('Data successfuly saved to database!');
})

app.delete("/user", (req, res, next) => {
    console.log(req.body);
    res.send('Deleted Successfully!');
})

app.use("/test", (req, res, next) => {
    res.send('hello from the server');
})


app.use("/admin/getAllData", (req, res, next) => {
    console.log("Get all data");
    res.send('Get all data');
});

app.use("/user/getUserData", (req, res, next) => {
    console.log("Get user data");
    res.send('Get user data');
});

app.use("/user/deleteUserData", (req, res, next) => {
    console.log("delete user data");
    res.send('delete user data');
});

app.use("/getUserData", (req, res, next) => {
    throw new Error("Some error occured while fetching user data");
    res.send('Get user data');
});

// app.use("/", (req, res, next) => {
//     res.send('Namaste Sudeep');
// })

// app.use("/ab?c", (req, res, next) => {
//     res.send('Test b is optional in abc');
// })

app.use("/testParams/:id", (req, res, next) => {
    res.send(`Test params in id: ${req.params.id}`);
})

app.use("/ab*cd", (req, res, next) => {
    res.send(`Test for ab*cd ${req.baseUrl}`);
})

// app.use("/ab+cd", (req, res, next) => {
//     res.send(`Test for ab+d ${req.baseUrl}`);
// })

app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("Something went wrong");
    }
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
})