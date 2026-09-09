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

const allowedOrigins = [
    "http://localhost:5173",
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.replace(/\/$/, "")] : []),
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
}));

app.use("/api/v1", userRoutes);
app.use("/api/v1", blogRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    dbConnect();
    cloudinaryConfig();
});