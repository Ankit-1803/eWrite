const express = require("express");
const {
    createUser,
    login,
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    verifyEmail,
    googleAuth,
    followUser,
    changeSavedLikedBlog,
} = require("../controller/userController");
const verifyUser = require("../middleware/auth");
const upload = require("../utils/multer");

const router = express.Router();

// User registration
router.post("/signup", createUser);

// User login
router.post("/signin", login);

// Fetch all users
router.get("/users", getUser);

// Fetch user by username
router.get("/user/:username", getUserById);

// Update user profile
router.post("/user/:id", verifyUser, upload.single("profilePic"), updateUser);

// Delete user account
router.delete("/user/:id", verifyUser, deleteUser);

// Verify email with token
router.get("/verify-email/:verificationToken", verifyEmail);

// Google OAuth authentication
router.post("/google-auth", googleAuth);

// Follow / unfollow user
router.post("/follow/:id", verifyUser, followUser);

// Update user blog visibility settings
router.post("/change-blogs-visibility", verifyUser, changeSavedLikedBlog);

module.exports = router;