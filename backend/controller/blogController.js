const mongoose = require("mongoose");
const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");
const Like = require("../models/likeSchema");
const { uploadImage, deleteImageFromCloudinary } = require("../utils/uploadImage");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });

// Create a new blog post
async function createBlog(req, res) {
    try {
        const creator = req.user;

        const { title, description } = req.body;
        const draft = req.body.draft == "true" ? true : false;
        // Extract the main cover image and content images from multipart files
        const { image, images } = req.files;

        const content = JSON.parse(req.body.content);
        const tags = JSON.parse(req.body.tags);

        // Validations for required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Please fill title field",
            });
        }

        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Please fill description field",
            });
        }

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Please add some content",
            });
        }

        // Upload content images to Cloudinary
        let imageIndex = 0;

        for (let i = 0; i < content.blocks.length; i++) {
            const block = content.blocks[i];
            if (block.type == "image") {
                const { secure_url, public_id } = await uploadImage(
                    `data:image/jpeg;base64,${images[imageIndex].buffer.toString("base64")}`
                );
                block.data.file = {
                    url: secure_url,
                    imageId: public_id,
                };
                imageIndex++;
            }
        }

        // Upload cover image to Cloudinary
        const { secure_url, public_id } = await uploadImage(
            `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`
        );

        const blogId = title.toLowerCase().split(" ").join("-") + "-" + randomUUID();

        const blog = await Blog.create({
            description,
            title,
            draft,
            creator,
            image: secure_url,
            imageId: public_id,
            blogId,
            content,
            tags,
        });

        // Add blog reference to user's created blogs
        await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

        if (draft) {
            return res.status(200).json({
                message: "Blog saved as draft. You can public it from your profile page",
                blog,
            });
        }

        return res.status(200).json({
            message: "Blog created successfully",
            success: true,
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

// Fetch published blogs with pagination
async function getBlogs(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({ draft: false })
            .populate({
                path: "creator",
                select: "-password",
            })
            .populate({
                path: "likes",
                select: "email name",
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments({ draft: false });

        return res.status(200).json({
            success: true,
            message: "Blog is Fetch successfully",
            blogs,
            hasMore: skip + limit < totalBlogs,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

// Fetch a blog by custom blogId
async function getBlog(req, res) {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findOne({ blogId })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name email",
                },
            })
            .populate({
                path: "creator",
                select: "name email followers username profilePic",
            })
            .lean();

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        async function populateReplies(comments) {
            for (const comment of comments) {
                let populatedComment = await Comment.findById(comment._id)
                    .populate({
                        path: "replies",
                        populate: {
                            path: "user",
                            select: "name email",
                        },
                    })
                    .lean();

                if (populatedComment) {
                    comment.replies = populatedComment.replies || [];

                    if (comment.replies.length > 0) {
                        await populateReplies(comment.replies);
                    }
                }
            }
            return comments;
        }

        blog.comments = await populateReplies(blog.comments || []);

        return res.status(200).json({
            success: true,
            message: "Blog is Fetch successfully",
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Update an existing blog
async function updateBlog(req, res) {
    try {
        const creator = req.user;
        const { id } = req.params;
        const { title, description } = req.body;
        const draft = req.body.draft == "true" ? true : false;

        const content = JSON.parse(req.body.content);
        const tags = JSON.parse(req.body.tags);

        // Find blog by either custom blogId or ObjectId
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const blog = isObjectId
            ? await Blog.findOne({ $or: [{ blogId: id }, { _id: id }] })
            : await Blog.findOne({ blogId: id });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "This blog does not exist",
            });
        }

        // Verify creator authorization
        if (creator.toString() !== blog.creator.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorised for this action",
            });
        }

        if (req.files.images) {
            let imageIndex = 0;

            for (let i = 0; i < content.blocks.length; i++) {
                const block = content.blocks[i];
                if (block.type == "image" && block.data.file.image) {
                    const { secure_url, public_id } = await uploadImage(
                        `data:image/jpeg;base64,${req.files.images[imageIndex].buffer.toString("base64")}`
                    );
                    block.data.file = {
                        url: secure_url,
                        imageId: public_id,
                    };
                    imageIndex++;
                }
            }
        }

        // If cover image is updated, delete previous image from Cloudinary and upload new image
        if (req?.files?.image) {
            await deleteImageFromCloudinary(blog.imageId);
            const { secure_url, public_id } = await uploadImage(
                `data:image/jpeg;base64,${req?.files?.image[0]?.buffer?.toString("base64")}`
            );

            blog.image = secure_url;
            blog.imageId = public_id;
        }

        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.draft = draft;
        blog.content = content || blog.content;
        blog.tags = tags || blog.tags;

        await blog.save();

        if (draft) {
            return res.status(200).json({
                message: "Blog saved as draft. You can again public it from your profile page",
                blog,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

// Delete a blog
async function deleteBlog(req, res) {
    try {
        const creator = req.user;
        const { id } = req.params;

        // Find blog by either _id or blogId
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const blog = isObjectId ? await Blog.findById(id) : await Blog.findOne({ blogId: id });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "This blog does not exist"
            });
        }

        // Check authorization
        if (creator.toString() !== blog.creator.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorised for this action"
            });
        }

        const blogObjectId = blog._id;

        // ----------------------------------------
        // 1. Delete main blog image from Cloudinary
        // ----------------------------------------
        if (blog.imageId) {
            try {
                await deleteImageFromCloudinary(blog.imageId);
            } catch (imgErr) {
                console.warn("Could not delete cover image from Cloudinary:", imgErr.message);
            }
        }

        // ----------------------------------------
        // 2. Delete EditorJS content images
        // ----------------------------------------
        const contentImages = blog.content?.blocks
            ?.filter((block) => block.type === "image")
            ?.map((block) => block.data?.file?.imageId)
            ?.filter(Boolean) || [];

        if (contentImages.length > 0) {
            await Promise.allSettled(
                contentImages.map((imageId) =>
                    deleteImageFromCloudinary(imageId)
                )
            );
        }

        // ----------------------------------------
        // 3. Delete Like documents
        // ----------------------------------------
        await Like.deleteMany({
            blog: blogObjectId
        });

        // ----------------------------------------
        // 4. Remove blog from users' liked blogs
        // ----------------------------------------
        await User.updateMany(
            {
                likeBlogs: blogObjectId
            },
            {
                $pull: {
                    likeBlogs: blogObjectId
                }
            }
        );

        // ----------------------------------------
        // 5. Remove blog from users' saved blogs
        // ----------------------------------------
        await User.updateMany(
            {
                saveBlogs: blogObjectId
            },
            {
                $pull: {
                    saveBlogs: blogObjectId
                }
            }
        );

        // ----------------------------------------
        // 6. Delete all comments/replies
        // ----------------------------------------
        await Comment.deleteMany({
            blog: blogObjectId
        });

        // ----------------------------------------
        // 7. Remove blog from creator's blogs
        // ----------------------------------------
        await User.findByIdAndUpdate(
            creator,
            {
                $pull: {
                    blogs: blogObjectId
                }
            }
        );

        // ----------------------------------------
        // 8. Finally delete blog
        // ----------------------------------------
        await Blog.findByIdAndDelete(blogObjectId);

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Like or unlike a blog
async function likeBlog(req, res) {
    try {
        const user = req.user;
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "This blog does not exist",
            });
        }

        const isLiked = blog.likes.some((likeUser) => likeUser.toString() === user.toString());

        if (!isLiked) {
            await Blog.findByIdAndUpdate(id, { $addToSet: { likes: user } });
            await User.findByIdAndUpdate(user, { $addToSet: { likeBlogs: id } });

            return res.status(200).json({
                success: true,
                message: "Blog liked successfully",
                isLiked: true,
            });
        } else {
            await Blog.findByIdAndUpdate(id, { $pull: { likes: user } });
            await User.findByIdAndUpdate(user, { $pull: { likeBlogs: id } });

            return res.status(200).json({
                success: true,
                message: "Blog unliked successfully",
                isLiked: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Save or unsave a blog for a user
async function saveBlog(req, res) {
    try {
        const user = req.user;
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "This blog does not exist",
            });
        }

        const isSaved = blog.totalSaves.some((saveUser) => saveUser.toString() === user.toString());

        if (!isSaved) {
            await Blog.findByIdAndUpdate(id, { $addToSet: { totalSaves: user } });
            await User.findByIdAndUpdate(user, { $addToSet: { saveBlogs: id } });

            return res.status(200).json({
                success: true,
                message: "Blog saved successfully",
                isSaved: true,
            });
        } else {
            await Blog.findByIdAndUpdate(id, { $pull: { totalSaves: user } });
            await User.findByIdAndUpdate(user, { $pull: { saveBlogs: id } });

            return res.status(200).json({
                success: true,
                message: "Blog unsaved successfully",
                isSaved: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Search blogs by query string or tag
async function searchBlogs(req, res) {
    try {
        const { search, tag } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query;
        if (tag) {
            query = { tags: tag, draft: false };
        } else {
            query = {
                draft: false,
                $or: [
                    { title: { $regex: search || "", $options: "i" } },
                    { description: { $regex: search || "", $options: "i" } },
                ],
            };
        }

        const blogs = await Blog.find(query)
            .populate({
                path: "creator",
                select: "name email followers username profilePic",
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(query);

        return res.status(200).json({
            success: true,
            blogs,
            hasMore: skip + limit < totalBlogs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    saveBlog,
    searchBlogs,
};