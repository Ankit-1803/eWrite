const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary credentials
async function cloudinaryConfig() {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log("Cloudinary configuration successful");
    } catch (error) {
        console.error("Error configuring Cloudinary:", error.message);
    }
}

module.exports = cloudinaryConfig;