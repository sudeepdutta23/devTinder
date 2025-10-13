const mongoose = require('mongoose');

const connectDB = async () => {
 await mongoose.connect('mongodb+srv://Sudeep:wVYWmMOuc1ZEZuDD@namastenode.2dyyjo5.mongodb.net/devTinder');
}

module.exports = connectDB;