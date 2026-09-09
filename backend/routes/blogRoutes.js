const express = require("express");
const {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    saveBlog,
    searchBlogs,
} = require("../controller/blogController");

const {
    addComment,
    deleteComment,
    editComment,
    likeComment,
    addNestedComment,
} = require("../controller/commentController");

const verifyUser = require("../middleware/auth");
const upload = require("../utils/multer");

const router = express.Router();

// Create a blog post
router.post(
    "/blogs",
    verifyUser,
    upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
    createBlog
);

// Fetch all published blogs
router.get("/blogs", getBlogs);

// Fetch blog by blogId
router.get("/blog/:blogId", getBlog);

// Update a blog
router.post(
    "/blog/:id",
    verifyUser,
    upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
    updateBlog
);

// Delete a blog
router.delete("/blog/:id", verifyUser, deleteBlog);

// Like or unlike a blog
router.post("/blog/like/:id", verifyUser, likeBlog);

// Add comment to a blog
router.post("/blog/comment/:id", verifyUser, addComment);

// Delete comment from blog
router.delete("/blog/comment/:id", verifyUser, deleteComment);

// Edit comment on a blog
router.post("/blog/edit-comment/:id", verifyUser, editComment);

// Like or unlike a comment
router.post("/blog/like-comment/:id", verifyUser, likeComment);

// Add nested reply to a comment
router.post("/comment/:parentCommentId/:id", verifyUser, addNestedComment);

// Save or unsave a blog
router.post("/save-blog/:id", verifyUser, saveBlog);

// Search blogs by text query or tag
router.get("/search-blogs", searchBlogs);

module.exports = router;