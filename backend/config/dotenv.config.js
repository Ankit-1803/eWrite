require("dotenv").config();

module. exports = {
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
    JWT_SECRET : process.env.JWT_SECRET,
    EMAIL_HOST : process.env.EMAIL_HOST,
    EMAIL_PORT : process.env.EMAIL_PORT,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASS : process.env.EMAIL_PASS,
    EMAIL_FROM : process.env.EMAIL_FROM || process.env.EMAIL_USER,
    CLIENT_URL : process.env.CLIENT_URL || "http://localhost:5173",
};
