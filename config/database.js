const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        if (conn.connection.readyState === 1)
            console.log('MongoDB connected successfully');
        else console.log('MongoDB connection failed');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;