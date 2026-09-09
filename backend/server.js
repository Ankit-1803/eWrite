const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = require("./config/dbConnect");
const cloudinaryConfig = require("./config/cloudinary");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// CORS Configuration
const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://e-write.vercel.app",
];

const envOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Match exact allowed origins or any Vercel deployment domain
        if (allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/api/v1", userRoutes);
app.use("/api/v1", blogRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    dbConnect();
    cloudinaryConfig();
});