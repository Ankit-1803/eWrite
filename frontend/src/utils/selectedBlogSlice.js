import { createSlice } from "@reduxjs/toolkit";


const selectedBlogSlice = createSlice({
    name: "selectedBlogSlice",
    initialState: JSON.parse(localStorage.getItem("selectedBlog")) || {},
    reducers: {
        addSelectedBlog(_state, action) {
            localStorage.setItem("selectedBlog", JSON.stringify(action.payload))
            return action.payload
        },

        removeSelectedBlog() {
            localStorage.removeItem("selectedBlog")
            return {}
        },
        
        changeLikes(state, action) {
            if(!state.likes) state.likes = []
            const userId = action.payload
            const hasLiked = state.likes.some((like) => (like._id || like).toString() === userId.toString())
            if(hasLiked) {
                state.likes = state.likes.filter((like) => (like._id || like).toString() !== userId.toString())
            }
            else {
                state.likes = [...state.likes, userId]
            }
            return state
        },

        setComments(state, action) {
            state.comments = [...(state.comments || []), action.payload]
        },

        setCommentLikes(state, action) {
            let {commentId, userId} = action.payload

            function toogleLike(comments) {
                return (comments || []).map((comment) => {
                    if(comment._id == commentId) {
                        const likes = comment.likes || []
                        const hasLiked = likes.some(id => (id._id || id).toString() === userId.toString())
                        if(hasLiked) {
                            return {
                                ...comment,
                                likes: likes.filter(id => (id._id || id).toString() !== userId.toString())
                            }
                        }
                        else {
                            return {
                                ...comment,
                                likes: [...likes, userId]
                            }
                        }
                    }

                    if(comment.replies && comment.replies.length>0) {
                        return {...comment, replies: toogleLike(comment.replies)}
                    }
                    return comment
                })
            }
            state.comments = toogleLike(state.comments)
        },

        setReplies(state, action) {
            const newReply = action.payload

            function addReplyRecursively(comments) {
                return (comments || []).map((comment) => {
                    if(comment._id === newReply.parentComment) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newReply]
                        }
                    }
                    if(comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: addReplyRecursively(comment.replies)
                        }
                    }
                    return comment
                })
            }

            state.comments = addReplyRecursively(state.comments)
        },

        setUpdatedComments(state, action) {
            function updateComment(comments) {
                return (comments || []).map((comment) => 
                    comment._id == action.payload._id ? 
                    {...comment, comment: action.payload.comment} :
                    comment.replies && comment.replies.length>0 ?
                    {...comment, replies: updateComment(comment.replies)} :
                    comment
                )
            }
            state.comments = updateComment(state.comments)
        },

        deleteCommentAndReply(state, action) {
            function deleteComment(comments) {
                return (comments || []).filter((comment) => comment._id != action.payload).map((comment) =>
                    comment.replies && comment.replies.length>0 ?
                    {...comment, replies: deleteComment(comment.replies)} :
                    comment
                )
            }
            state.comments = deleteComment(state.comments)
        },
    }
})

export const {
    addSelectedBlog, 
    removeSelectedBlog, 
    changeLikes, 
    setComments, 
    setCommentLikes, 
    setReplies,
    setUpdatedComments,
    deleteCommentAndReply
} = selectedBlogSlice.actions
export default selectedBlogSlice.reducer