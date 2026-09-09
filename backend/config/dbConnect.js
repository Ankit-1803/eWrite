const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Establish connection with MongoDB
async function dbConnect() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}

module.exports = dbConnect;