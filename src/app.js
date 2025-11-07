const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const requestRouter = require('./routes/request');
const paymentRouter = require('./routes/payment');
const cors = require('cors'); 

require('./utils/cronjob'); // Import and run the cron job

// --- CORS Configuration ---
// Define the allowed origin (your frontend)
const corsOptions = {
    origin: 'http://localhost:5173', // Allow your frontend to make requests
    credentials: true, // Allow cookies to be sent with requests
};

// --- Middleware ---
app.use(cors(corsOptions)); // Enable CORS with your specific options
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', requestRouter);
app.use('/', paymentRouter);

// --- Database and Server Start ---
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port ' + process.env.PORT);
    })
}).catch((err) => {
    console.log("Error connecting to database", err);
});