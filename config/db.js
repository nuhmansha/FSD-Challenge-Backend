const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI); // Log the MongoDB URI
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting DB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;



