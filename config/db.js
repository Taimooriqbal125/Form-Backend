require("dotenv").config();
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
