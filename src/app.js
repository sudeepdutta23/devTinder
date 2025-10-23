const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/authHandler');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const requestRouter = require('./routes/request');

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', requestRouter);

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