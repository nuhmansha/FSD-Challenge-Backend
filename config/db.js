const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting DB:", error);
  }
};

connectDB();

module.exports = connectDB;

