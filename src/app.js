const express = require('express');
const app = express();
const PORT = process.env.PORT || 7777;
const connectDB = require("./config/database");
const User = require('./model/user');



app.post('/signup', async(req, res) => {
const payload = {
    firstName: "Sachin",
    lastName: "Tendulkar",
    email: "sachin@gmail.com",
    password: "sachin@123",
}
try {
    const newUser = new User(payload);
    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
} catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
}
});


connectDB().then(() => {
    console.log("Connected to database successfully");
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    })
}).catch((err) => {
    console.log("Error connecting to database");
});