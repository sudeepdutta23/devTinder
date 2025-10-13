const mongoose = require('mongoose');

const connectDB = async () => {
    console.log(process.env.MONGO_DB_URI);
    
 await mongoose.connect(process.env.MONGO_DB_URI);
}

module.exports = connectDB;