import { useDispatch, useSelector } from "react-redux"
import { setIsOpen } from "../utils/commentSlice"
import { useState } from "react"
import axios from "axios"
import { deleteCommentAndReply, setCommentLikes, setComments, setReplies, setUpdatedComments } from "../utils/selectedBlogSlice"
import { formatDate } from "../utils/formatDate"
import toast from "react-hot-toast"

function Comment() {

    const dispatch = useDispatch()

    const [comment, setComment] = useState("")

    const [activeReply, setActiveReply] = useState(null)

    const [currentPopup, setCurrentPopup] = useState(null)

    const [currentEditComment, setCurrentEditComment] = useState(null)

    // Extract Data from redux slices (selectedBlog Slice and user slice)
    const selectedBlog = useSelector((state) => state.selectedBlog) || {}
    const blogId = selectedBlog._id
    const comments = selectedBlog.comments || []
    const creatorId = selectedBlog.creator?._id

    const {token, id: userId} = useSelector((state) => state.user)

    

    async function handleComment() {
        try {
            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/comment/${blogId}`,
                {
                    comment
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setComment("");
            dispatch(setComments(res.data.newComment));
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }


    return (
    <div 
        className=" bg-white h-screen fixed top-0 right-0 w-full sm:w-[380px] md:w-[420px] border-l border-gray-200 shadow-[-10px_0_35px_rgba(0,0,0,0.10)] z-50 flex flex-col"
    >

        {/* ================================================= */}
        {/*                     HEADER                        */}
        {/* ================================================= */}

        <div className="
            px-5
            sm:px-6
            py-4
            border-b
            border-gray-100
            bg-white
            flex
            items-center
            justify-between
            flex-shrink-0
        ">

            <div className="flex items-center gap-3">

                <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-50
                    flex
                    items-center
                    justify-center
                ">
                    <i className="
                        fi
                        fi-rr-comment-alt
                        text-green-600
                        text-lg
                    "></i>
                </div>

                <div>
                    <h1 className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-gray-900
                    ">
                        Comments
                    </h1>

                    <p className="
                        text-xs
                        text-gray-400
                        mt-0.5
                    ">
                        Join the conversation
                    </p>
                </div>

            </div>


            {/* Comment count */}

            <div className="
                bg-gray-100
                text-gray-600
                text-xs
                font-semibold
                px-3
                py-1.5
                rounded-full
                mr-2
            ">
                {comments.length}
            </div>


            {/* Close */}

            <button
                onClick={() => dispatch(setIsOpen(false))}
                className="
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    hover:bg-gray-100
                    active:bg-gray-200
                    transition
                    cursor-pointer
                "
            >
                <i className="
                    fi
                    fi-br-cross
                    text-base
                    text-gray-600
                "></i>
            </button>

        </div>


        {/* ================================================= */}
        {/*                 ADD COMMENT                       */}
        {/* ================================================= */}

        <div className="
            px-5
            sm:px-6
            pt-5
            pb-4
            border-b
            border-gray-100
            flex-shrink-0
        ">

            <div className="
                bg-gray-50
                border
                border-gray-200
                rounded-2xl
                p-3
                focus-within:bg-white
                focus-within:border-green-400
                focus-within:ring-4
                focus-within:ring-green-50
                transition-all
            ">

                <textarea
                    value={comment}
                    type="text"
                    placeholder="Share your thoughts..."
                    className="
                        resize-none
                        h-[95px]
                        sm:h-[105px]
                        w-full
                        bg-transparent
                        text-sm
                        sm:text-base
                        text-gray-700
                        placeholder:text-gray-400
                        focus:outline-none
                    "
                    onChange={(e) => setComment(e.target.value)}
                />


                <div className="
                    flex
                    justify-end
                    items-center
                    mt-2
                ">

                    <button
                        onClick={handleComment}
                        className="
                            bg-gradient-to-r
                            from-green-500
                            to-emerald-500
                            hover:from-green-600
                            hover:to-emerald-600
                            text-white
                            text-sm
                            font-semibold
                            px-5
                            py-2.5
                            rounded-full
                            shadow-sm
                            hover:shadow-md
                            transition-all
                            duration-200
                            cursor-pointer
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <i className="fi fi-rr-paper-plane"></i>
                        Add Comment
                    </button>

                </div>

            </div>

        </div>


        {/* ================================================= */}
        {/*                  COMMENTS LIST                    */}
        {/* ================================================= */}

        <div className="
            flex-1
            overflow-y-auto
            px-5
            sm:px-6
            py-4
        ">

            {
                comments.length === 0 ? (

                    <div className="
                        h-full
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                        pb-20
                    ">

                        <div className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-green-50
                            flex
                            items-center
                            justify-center
                            mb-4
                        ">
                            <i className="
                                fi
                                fi-rr-comment-alt
                                text-2xl
                                text-green-500
                            "></i>
                        </div>

                        <h2 className="
                            text-base
                            font-bold
                            text-gray-800
                        ">
                            No comments yet
                        </h2>

                        <p className="
                            text-xs
                            text-gray-400
                            mt-1
                            max-w-[220px]
                            leading-5
                        ">
                            Be the first person to share your thoughts on this blog.
                        </p>

                    </div>

                ) : (

                    <DisplayComments
                        comments={comments}
                        userId={userId}
                        blogId={blogId}
                        token={token}
                        activeReply={activeReply}
                        setActiveReply={setActiveReply}
                        currentPopup={currentPopup}
                        setCurrentPopup={setCurrentPopup}
                        currentEditComment={currentEditComment}
                        setCurrentEditComment={setCurrentEditComment}
                        creatorId={creatorId}
                    />

                )
            }

        </div>

    </div>
)
}

function DisplayComments({
        comments, 
        userId, 
        blogId, 
        token, 
        activeReply, 
        setActiveReply, 
        currentPopup,
        setCurrentPopup,
        currentEditComment,
        setCurrentEditComment,
        creatorId
}) {

    const dispatch = useDispatch()
    const [reply, setReply] = useState("")
    const [updatedCommentContent, setUpdatedCommentContent] = useState("")
   

    async function handleReply(parentCommentId) {
        try {
            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/comment/${parentCommentId}/${blogId}`,
                {
                    reply,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setReply("");
            setActiveReply(null)
            dispatch(setReplies(res.data.newReply));

        } catch (error) {
            console.log(error)
        }
    }

    async function handleCommentLike(commentId) {
        try {
            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/like-comment/${commentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(res.data.message)
            dispatch(setCommentLikes({commentId, userId}))
        } catch (error) {
            console.log(error)
        }
    }

    async function handleActiveReply(id) {
        setActiveReply((prev) => (prev == id ? null : id))
    }

    async function handleCommentUpdate(id) {
        
        try {
            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/edit-comment/${id}`,
                {
                    updatedCommentContent,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            toast.success(res.data.message)
            dispatch(setUpdatedComments(res.data.updatedComment));

        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
        finally {
            setUpdatedCommentContent("");
            setCurrentEditComment(null)
        }
    }

    async function handleCommentDelete(id) {
        
        try {
            let res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/blog/comment/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            toast.success(res.data.message)
            dispatch(deleteCommentAndReply(id));

        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
        finally {
            setUpdatedCommentContent("");
            setCurrentEditComment(null)
        }
    }

    return (
    <>
        {
            comments.map(comment => (

                <div key={comment._id} className="mb-5">

                    {/* ========================================= */}
                    {/*                  COMMENT CARD              */}
                    {/* ========================================= */}

                    <div className="
                        bg-white
                        border
                        border-gray-100
                        rounded-2xl
                        p-4
                        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                        hover:shadow-[0_4px_18px_rgba(0,0,0,0.07)]
                        transition-all
                    ">


                        {/* ================================= */}
                        {/*             USER HEADER            */}
                        {/* ================================= */}

                        {
                            currentEditComment == comment._id ? (

                                /* ================= EDIT COMMENT ================= */

                                <div>

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-3
                                    ">

                                        <div className="
                                            w-9
                                            h-9
                                            rounded-full
                                            bg-green-50
                                            flex
                                            items-center
                                            justify-center
                                        ">
                                            <i className="
                                                fi
                                                fi-rr-edit
                                                text-green-600
                                            "></i>
                                        </div>

                                        <div>
                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-800
                                            ">
                                                Edit comment
                                            </p>

                                            <p className="
                                                text-[11px]
                                                text-gray-400
                                            ">
                                                Update your comment
                                            </p>
                                        </div>

                                    </div>


                                    <textarea
                                        value={updatedCommentContent}
                                        placeholder="Edit your comment..."
                                        className="
                                            resize-none
                                            h-[110px]
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            p-3
                                            text-sm
                                            text-gray-700
                                            focus:outline-none
                                            focus:bg-white
                                            focus:border-green-400
                                            focus:ring-4
                                            focus:ring-green-50
                                            transition-all
                                        "
                                        onChange={(e) =>
                                            setUpdatedCommentContent(e.target.value)
                                        }
                                    />


                                    <div className="
                                        flex
                                        justify-end
                                        gap-2
                                        mt-3
                                    ">

                                        <button
                                            onClick={() =>
                                                setCurrentEditComment(null)
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-full
                                                text-sm
                                                font-semibold
                                                text-gray-600
                                                bg-gray-100
                                                hover:bg-gray-200
                                                cursor-pointer
                                                transition
                                            "
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            onClick={() => {
                                                handleCommentUpdate(comment._id)
                                            }}
                                            className="
                                                px-4
                                                py-2
                                                rounded-full
                                                text-sm
                                                font-semibold
                                                text-white
                                                bg-green-500
                                                hover:bg-green-600
                                                cursor-pointer
                                                transition
                                            "
                                        >
                                            Save
                                        </button>

                                    </div>

                                </div>

                            ) : (

                                <>

                                    {/* ================= USER ================= */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                        ">

                                            <div className="
                                                w-9
                                                h-9
                                                rounded-full
                                                overflow-hidden
                                                bg-green-50
                                                border
                                                border-green-100
                                                flex-shrink-0
                                            ">

                                                <img
                                                    src={`https://api.dicebear.com/10.x/initials/svg?seed=${comment?.user?.name}`}
                                                    alt="User"
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                    "
                                                />

                                            </div>


                                            <div>

                                                <p className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                ">
                                                    {comment.user?.name}
                                                </p>

                                                <p className="
                                                    text-[11px]
                                                    text-gray-400
                                                    mt-0.5
                                                ">
                                                    {formatDate(comment.createdAt)}
                                                </p>

                                            </div>

                                        </div>


                                        {/* ================= THREE DOTS ================= */}

                                        {
                                            (comment.user._id == userId ||
                                                userId == creatorId) ?

                                                currentPopup == comment._id ? (

                                                    <div className="
                                                        relative
                                                        bg-white
                                                        border
                                                        border-gray-200
                                                        rounded-xl
                                                        shadow-lg
                                                        overflow-hidden
                                                        min-w-[100px]
                                                        z-20
                                                    ">

                                                        <button
                                                            onClick={() =>
                                                                setCurrentPopup(null)
                                                            }
                                                            className="
                                                                absolute
                                                                top-1
                                                                right-1
                                                                w-6
                                                                h-6
                                                                rounded-full
                                                                flex
                                                                items-center
                                                                justify-center
                                                                hover:bg-gray-100
                                                                cursor-pointer
                                                            "
                                                        >
                                                            <i className="
                                                                fi
                                                                fi-br-cross
                                                                text-[9px]
                                                            "></i>
                                                        </button>


                                                        {
                                                            comment.user._id == userId && (

                                                                <p
                                                                    className="
                                                                        px-3
                                                                        py-2
                                                                        mt-5
                                                                        text-sm
                                                                        font-medium
                                                                        text-gray-700
                                                                        hover:bg-green-50
                                                                        hover:text-green-600
                                                                        cursor-pointer
                                                                    "
                                                                    onClick={() => {
                                                                        setCurrentEditComment(comment._id)
                                                                        setUpdatedCommentContent(comment.comment)
                                                                        setCurrentPopup(null)
                                                                    }}
                                                                >
                                                                    Edit
                                                                </p>

                                                            )
                                                        }


                                                        <p
                                                            className="
                                                                px-3
                                                                py-2
                                                                text-sm
                                                                font-medium
                                                                text-red-500
                                                                hover:bg-red-50
                                                                cursor-pointer
                                                            "
                                                            onClick={() => {
                                                                handleCommentDelete(comment._id)
                                                                setCurrentPopup(null)
                                                            }}
                                                        >
                                                            Delete
                                                        </p>

                                                    </div>

                                                ) : (

                                                    <button
                                                        onClick={() =>
                                                            setCurrentPopup(comment._id)
                                                        }
                                                        className="
                                                            w-8
                                                            h-8
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-gray-100
                                                            cursor-pointer
                                                            transition
                                                        "
                                                    >
                                                        <i className="
                                                            fi
                                                            fi-bs-menu-dots
                                                            text-gray-500
                                                        "></i>
                                                    </button>

                                                )

                                                : ""
                                        }

                                    </div>


                                    {/* ================= COMMENT TEXT ================= */}

                                    <p className="
                                        text-sm
                                        sm:text-[15px]
                                        text-gray-700
                                        leading-6
                                        mt-4
                                        break-words
                                    ">
                                        {comment.comment}
                                    </p>


                                    {/* ================================= */}
                                    {/*             ACTIONS               */}
                                    {/* ================================= */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        mt-4
                                        pt-3
                                        border-t
                                        border-gray-100
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-4
                                        ">

                                            {/* Like */}

                                            <button
                                                onClick={() =>
                                                    handleCommentLike(comment._id)
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    text-xs
                                                    text-gray-500
                                                    hover:text-red-500
                                                    cursor-pointer
                                                    transition
                                                "
                                            >

                                                {
                                                    comment.likes.includes(userId) ? (

                                                        <i className="
                                                            fi
                                                            fi-sr-heart
                                                            text-red-500
                                                        "></i>

                                                    ) : (

                                                        <i className="
                                                            fi
                                                            fi-rr-heart
                                                        "></i>

                                                    )
                                                }

                                                <span>
                                                    {comment.likes.length}
                                                </span>

                                            </button>


                                            {/* Replies */}

                                            <div className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                text-gray-500
                                            ">

                                                <i className="
                                                    fi
                                                    fi-rr-comment-alt
                                                "></i>

                                                <span>
                                                    {comment.replies.length}
                                                </span>

                                            </div>

                                        </div>


                                        {/* Reply */}

                                        <button
                                            onClick={() =>
                                                handleActiveReply(comment._id)
                                            }
                                            className="
                                                text-xs
                                                font-semibold
                                                text-green-600
                                                hover:text-green-700
                                                hover:underline
                                                cursor-pointer
                                            "
                                        >
                                            {
                                                activeReply == comment._id
                                                    ? "Cancel"
                                                    : "Reply"
                                            }
                                        </button>

                                    </div>

                                </>

                            )
                        }


                        {/* ========================================= */}
                        {/*                  REPLY BOX                  */}
                        {/* ========================================= */}

                        {
                            activeReply == comment._id && (

                                <div className="
                                    mt-4
                                    pt-4
                                    border-t
                                    border-gray-100
                                ">

                                    <textarea
                                        type="text"
                                        placeholder="Write a reply..."
                                        className="
                                            resize-none
                                            h-[90px]
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            p-3
                                            text-sm
                                            focus:outline-none
                                            focus:bg-white
                                            focus:border-green-400
                                            focus:ring-4
                                            focus:ring-green-50
                                            transition-all
                                        "
                                        onChange={(e) =>
                                            setReply(e.target.value)
                                        }
                                    />


                                    <div className="
                                        flex
                                        justify-end
                                        mt-2
                                    ">

                                        <button
                                            onClick={() =>
                                                handleReply(comment._id)
                                            }
                                            className="
                                                bg-green-500
                                                hover:bg-green-600
                                                text-white
                                                text-sm
                                                font-semibold
                                                px-4
                                                py-2
                                                rounded-full
                                                cursor-pointer
                                                transition
                                            "
                                        >
                                            Reply
                                        </button>

                                    </div>

                                </div>

                            )
                        }


                    </div>


                    {/* ========================================= */}
                    {/*                    REPLIES                 */}
                    {/* ========================================= */}

                    {
                        comment.replies.length > 0 && (

                            <div className="
                                ml-4
                                sm:ml-5
                                mt-3
                                pl-3
                                sm:pl-4
                                border-l-2
                                border-green-100
                            ">

                                <DisplayComments
                                    comments={comment.replies}
                                    userId={userId}
                                    blogId={blogId}
                                    token={token}
                                    activeReply={activeReply}
                                    setActiveReply={setActiveReply}
                                    currentPopup={currentPopup}
                                    setCurrentPopup={setCurrentPopup}
                                    currentEditComment={currentEditComment}
                                    setCurrentEditComment={setCurrentEditComment}
                                    creatorId={creatorId}
                                />

                            </div>

                        )
                    }

                </div>

            ))
        }
    </>
)
}
export default Comment