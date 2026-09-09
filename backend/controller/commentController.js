const mongoose = require("mongoose");
const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");

// Add a comment to a blog
async function addComment(req, res) {
    try {
        const creator = req.user;
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter the comment",
            });
        }

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const blog = isObjectId ? await Blog.findById(id) : await Blog.findOne({ blogId: id });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "This blog does not exist",
            });
        }

        const newComment = await Comment.create({ comment, blog: blog._id, user: creator }).then((c) => {
            return c.populate({
                path: "user",
                select: "name email",
            });
        });

        await Blog.findByIdAndUpdate(blog._id, { $push: { comments: newComment._id } });

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            newComment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Delete a comment and all its nested replies
async function deleteComment(req, res) {
    try {
        const userId = req.user;
        const { id } = req.params;

        const comment = await Comment.findById(id).populate({
            path: "blog",
            select: "creator",
        });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment does not exist",
            });
        }

        const isCommentAuthor = comment.user && comment.user.toString() === userId.toString();
        const isBlogCreator = comment.blog && comment.blog.creator && comment.blog.creator.toString() === userId.toString();

        if (!isCommentAuthor && !isBlogCreator) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized",
            });
        }

        // Delete all nested comments and their replies recursively
        async function deleteCommentAndReplies(commentId) {
            let curComment = await Comment.findById(commentId);
            if (!curComment) return;

            for (let replyId of curComment.replies) {
                await deleteCommentAndReplies(replyId);
            }

            if (curComment.parentComment) {
                await Comment.findByIdAndUpdate(curComment.parentComment, {
                    $pull: { replies: commentId },
                });
            }

            await Comment.findByIdAndDelete(commentId);
        }

        await deleteCommentAndReplies(id);

        if (comment.blog && comment.blog._id) {
            await Blog.findByIdAndUpdate(comment.blog._id, { $pull: { comments: id } });
        }

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Edit a comment on a blog
async function editComment(req, res) {
    try {
        const userId = req.user;
        const { id } = req.params;
        const { updatedCommentContent } = req.body;

        if (!updatedCommentContent || !updatedCommentContent.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content cannot be empty",
            });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this comment",
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { comment: updatedCommentContent },
            { new: true }
        ).then((c) => {
            return c.populate({
                path: "user",
                select: "name email",
            });
        });

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            updatedComment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Like or unlike a comment
async function likeComment(req, res) {
    try {
        const userId = req.user;
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "This comment does not exist",
            });
        }

        const isLiked = comment.likes.some((likeUser) => likeUser.toString() === userId.toString());

        if (!isLiked) {
            await Comment.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

            return res.status(200).json({
                success: true,
                message: "Comment liked successfully",
                isLiked: true,
            });
        } else {
            await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });

            return res.status(200).json({
                success: true,
                message: "Comment unliked successfully",
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

// Add a nested reply to a comment
async function addNestedComment(req, res) {
    try {
        const userId = req.user;
        const { id: blogId, parentCommentId } = req.params;
        const { reply } = req.body;

        if (!reply || !reply.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply content cannot be empty",
            });
        }

        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            return res.status(404).json({
                success: false,
                message: "Parent comment does not exist",
            });
        }

        const isObjectId = mongoose.Types.ObjectId.isValid(blogId);
        const blog = isObjectId ? await Blog.findById(blogId) : await Blog.findOne({ blogId });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog does not exist",
            });
        }

        const newReply = await Comment.create({
            blog: blog._id,
            comment: reply,
            parentComment: parentCommentId,
            user: userId,
        }).then((r) => {
            return r.populate({
                path: "user",
                select: "name email",
            });
        });

        await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: newReply._id } });

        return res.status(200).json({
            success: true,
            message: "Reply added successfully",
            newReply,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    addComment,
    deleteComment,
    editComment,
    likeComment,
    addNestedComment,
};