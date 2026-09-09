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
    FIREBASE_PROJECT_ID : process.env.FIREBASE_PROJECT_ID || "ewrite-fe5d3",
    RESEND_API_KEY : process.env.RESEND_API_KEY,
    AUTO_VERIFY_EMAIL : process.env.AUTO_VERIFY_EMAIL === "true",
};
