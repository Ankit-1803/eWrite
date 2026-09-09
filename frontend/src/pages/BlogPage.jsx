import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { addSelectedBlog, changeLikes, removeSelectedBlog } from "../utils/selectedBlogSlice"
import Comment from "../components/Comment"
import { setIsOpen } from "../utils/commentSlice"
import { formatDate } from "../utils/formatDate"
import { handleSaveBlog, handleFollowCreator } from "../utils/blogActions"


function BlogPage() {
    const {id} = useParams()
    const dispatch = useDispatch()

    const {token, email, id:userId} = useSelector((state) =>state.user)

    const {likes, comments, content} = useSelector((state) =>state.selectedBlog)
    const {isOpen} = useSelector((state) =>state.comment)

    const [blogData, setBlogData] = useState(null)

    // Handle Like Unlike functionality
    const [isLike, setIsLike] = useState(false)


    // Handle Like and Unlike Functionality
    async function handleLike() {
        if(!token) {
            return toast.error("Please sign in to like this blog")
        }
        try {
            setIsLike((prev) => !prev)

            let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/like/${blogData._id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            dispatch(changeLikes(userId))

            toast.success(res.data.message);
        } catch (error) {
            setIsLike((prev) => !prev)
            toast.error(error?.response?.data?.message || "Failed to like blog")
        }
    }


    useEffect(()=>{
        let isMounted = true
        async function fetchBlogById() {
            try {
                let {data: {blog}} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/${id}`)
                if(!isMounted) return
                setBlogData(blog)
                dispatch(addSelectedBlog(blog))

                const isLiked = Boolean(userId && blog?.likes?.some(u => (u._id || u).toString() === userId.toString()))
                setIsLike(isLiked)
            }
            catch (error) {
                toast.error(error?.response?.data?.message || "Failed to fetch blog")
            }
        }

        fetchBlogById()

        return () => {
            isMounted = false
            dispatch(setIsOpen(false))
            if(window.location.pathname !== `/edit/${id}`) {
                dispatch(removeSelectedBlog())
            }

        }
    },[id, dispatch, userId])


    return (

        <div className="
            min-h-screen
            w-full
            bg-gradient-to-br
            from-white
            via-white
            to-emerald-50/40
            py-8
            px-4
            sm:px-6
        ">

            {
                blogData ? (

                    <div className="
                        max-w-[760px]
                        mx-auto
                        relative
                    ">


                        {/* =====================================================
                            ARTICLE CARD
                        ====================================================== */}

                        <div className="
                            bg-white/95
                            backdrop-blur-sm
                            rounded-3xl
                            border
                            border-gray-100
                            shadow-[0_15px_60px_rgba(15,23,42,0.08)]
                            overflow-hidden
                        ">


                            {/* =================================================
                                ARTICLE HEADER
                            ================================================= */}

                            <div className="
                                px-6
                                sm:px-9
                                pt-7
                                sm:pt-9
                            ">




                                {/* Title */}

                                <h1 className="
                                    font-extrabold
                                    text-4xl
                                    sm:text-5xl
                                    lg:text-6xl
                                    capitalize
                                    text-gray-900
                                    leading-[1.08]
                                    tracking-tight
                                ">
                                    {blogData.title}
                                </h1>

                                <h2 className="
                                    mt-3
                                    font-md
                                    sm: text-sm
                                    md:text-xl
                                    font-medium
                                    capitalize
                                    text-gray-900
                                    leading-[1.08]
                                    tracking-tight
                                ">
                                    {blogData.description}
                                </h2>



                                {/* =================================================
                                    CREATOR INFORMATION
                                ================================================= */}

                                <div className="
                                    flex
                                    items-center
                                    my-6
                                    gap-3
                                ">

                                    <Link to={`/@${blogData?.creator?.username}`}>

                                        <div className="
                                            w-10
                                            h-10
                                            rounded-full
                                            overflow-hidden
                                            border-2
                                            border-green-100
                                            bg-green-50
                                            cursor-pointer
                                        ">

                                            <img 
                                                src={
                                                    blogData?.creator?.profilePic ?
                                                    blogData.creator.profilePic :
                                                    `https://api.dicebear.com/10.x/initials/svg?seed=${blogData?.creator?.name || "Author"} `
                                                }
                                                alt={blogData?.creator?.name || "Author"}
                                                className="
                                                    rounded-full
                                                    w-full
                                                    object-cover
                                                    h-full
                                                "
                                            />

                                        </div>

                                    </Link>



                                    <div className="
                                        flex
                                        flex-col
                                    ">

                                        {/* Name and follow part */}

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            flex-wrap
                                        ">

                                            <Link to={`/@${blogData?.creator?.username}`}>

                                                <h2
                                                    className="
                                                        text-base
                                                        sm:text-lg
                                                        font-bold
                                                        text-gray-900
                                                        hover:text-green-600
                                                        cursor-pointer
                                                        transition-colors
                                                    "
                                                >
                                                    {blogData?.creator?.name}
                                                </h2>

                                            </Link>


                                            <span className="text-gray-300">
                                                •
                                            </span>


                                            <p
                                                onClick={async () => {
                                                    await handleFollowCreator(blogData?.creator?._id, token, () => {
                                                        setBlogData(prev => {
                                                            if (!prev?.creator) return prev;
                                                            const followers = prev.creator.followers || [];
                                                            const isFollowing = followers.some(f => (f._id || f).toString() === userId?.toString());
                                                            const updatedFollowers = isFollowing
                                                                ? followers.filter(f => (f._id || f).toString() !== userId?.toString())
                                                                : [...followers, userId];
                                                            return {
                                                                ...prev,
                                                                creator: {
                                                                    ...prev.creator,
                                                                    followers: updatedFollowers
                                                                }
                                                            };
                                                        });
                                                    });
                                                }}
                                                className="
                                                    text-sm
                                                    sm:text-base
                                                    text-green-600
                                                    font-bold
                                                    hover:text-green-700
                                                    hover:underline
                                                    cursor-pointer
                                                "
                                            >
                                                {blogData?.creator?.followers?.some(f => (f._id || f).toString() === userId?.toString()) ? "Unfollow" : "Follow"}
                                            </p>

                                        </div>



                                        {/* Time of read and date part */}

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-500
                                        ">

                                            <span>
                                                6 min read
                                            </span>

                                            <span>
                                                •
                                            </span>

                                            <span>
                                                {formatDate(blogData.createdAt)}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                


                            </div>



                            {/* =====================================================
                                FEATURE IMAGE
                            ====================================================== */}

                            <div className="
                                px-4
                                sm:px-9
                            ">

                                <div className="
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    bg-emerald-50
                                    border
                                    border-green-100
                                ">

                                    {/* Decorative background */}

                                    <div className="
                                        absolute
                                        -left-10
                                        -top-10
                                        w-32
                                        h-32
                                        bg-green-200/30
                                        rounded-full
                                    "></div>

                                    <div className="
                                        absolute
                                        -right-10
                                        -bottom-10
                                        w-36
                                        h-36
                                        bg-emerald-200/30
                                        rounded-full
                                    "></div>


                                    <img
                                        src={blogData?.image}
                                        alt=""
                                        className="
                                            relative
                                            z-10
                                            block
                                            w-full
                                            max-h-[650px]
                                            object-contain
                                            mx-auto
                                        "
                                    />

                                </div>

                            </div>



                            {/* =====================================================
                                EDIT + SOCIAL ACTIONS
                            ====================================================== */}

                            <div className="
                                px-6
                                sm:px-9
                                py-5
                            ">

                                {
                                    token && email === blogData?.creator?.email &&
                                    <Link to={"/edit/" + blogData.blogId}>

                                        <button
                                            className="
                                                bg-gradient-to-r
                                                from-green-500
                                                to-emerald-600
                                                text-white
                                                mt-1
                                                px-6
                                                py-2.5
                                                text-base
                                                font-bold
                                                rounded-xl
                                                shadow-md
                                                shadow-green-100
                                                hover:shadow-lg
                                                hover:-translate-y-0.5
                                                transition-all
                                                cursor-pointer
                                            "
                                        >
                                            <i className="fi fi-rr-edit mr-2"></i>
                                            Edit
                                        </button>

                                    </Link>
                                }



                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    mt-4
                                ">


                                    {/* LIKE */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            rounded-full
                                            px-4
                                            py-2
                                            hover:bg-red-50
                                            transition-colors
                                        "
                                    >

                                        {
                                            isLike ?
                                            <i
                                                onClick={handleLike}
                                                className="
                                                    fi
                                                    fi-sr-heart
                                                    text-red-500
                                                    text-xl
                                                    cursor-pointer
                                                "
                                            ></i> :
                                            <i
                                                onClick={handleLike}
                                                className="
                                                    fi
                                                    fi-rr-heart
                                                    text-xl
                                                    cursor-pointer
                                                "
                                            ></i>
                                        }

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">
                                            {likes?.length}
                                        </p>

                                    </div>



                                    {/* COMMENT */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            rounded-full
                                            px-4
                                            py-2
                                            hover:bg-blue-50
                                            transition-colors
                                        "
                                    >

                                        <i
                                            onClick={() => dispatch(setIsOpen())}
                                            className="
                                                fi
                                                fi-rr-comment-alt
                                                text-xl
                                                cursor-pointer
                                            "
                                        ></i>

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-gray-600
                                        ">
                                            {comments?.length}
                                        </p>

                                    </div>



                                    {/* SAVE */}

                                    <div
                                        onClick={async () => {
                                            await handleSaveBlog(blogData._id, token, () => {
                                                setBlogData(prev => {
                                                    if (!prev) return prev;
                                                    const saves = prev.totalSaves || [];
                                                    const isSaved = saves.some(s => (s._id || s).toString() === userId?.toString());
                                                    const updatedSaves = isSaved
                                                        ? saves.filter(s => (s._id || s).toString() !== userId?.toString())
                                                        : [...saves, userId];
                                                    return {
                                                        ...prev,
                                                        totalSaves: updatedSaves
                                                    };
                                                });
                                            });
                                        }}
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            rounded-full
                                            px-4
                                            py-2
                                            hover:bg-green-50
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >

                                        {
                                            blogData?.totalSaves?.some(s => (s._id || s).toString() === userId?.toString()) ?
                                            <i className="
                                                fi
                                                fi-sr-bookmark
                                                text-xl
                                                text-green-600
                                            "></i> :
                                            <i className="
                                                fi
                                                fi-rr-bookmark
                                                text-xl
                                            "></i>
                                        }

                                    </div>

                                </div>

                            </div>



                            {/* =====================================================
                                ARTICLE CONTENT
                            ====================================================== */}

                            <div className="
                                px-6
                                sm:px-9
                                pb-10
                            ">

                                <div className="
                                    my-5
                                    text-[17px]
                                    leading-8
                                    text-gray-700
                                    break-words
                                ">

                                    {
                                        content?.blocks?.map((block, index) => {

                                            if(block.type == "header") {

                                                if(block.data.level == 2) {

                                                    return (
                                                        <h2
                                                            key={index}
                                                            className="
                                                                font-extrabold
                                                                text-3xl
                                                                sm:text-4xl
                                                                text-gray-900
                                                                mt-10
                                                                mb-5
                                                                leading-tight
                                                            "
                                                            dangerouslySetInnerHTML={{
                                                                __html: block.data.text
                                                            }}
                                                        ></h2>
                                                    )

                                                }

                                                else if(block.data.level == 3) {

                                                    return (
                                                        <h3
                                                            key={index}
                                                            className="
                                                                font-extrabold
                                                                text-2xl
                                                                sm:text-3xl
                                                                text-gray-900
                                                                mt-8
                                                                mb-4
                                                            "
                                                            dangerouslySetInnerHTML={{
                                                                __html: block.data.text
                                                            }}
                                                        ></h3>
                                                    )

                                                }

                                                else if(block.data.level == 4) {

                                                    return (
                                                        <h4
                                                            key={index}
                                                            className="
                                                                font-bold
                                                                text-xl
                                                                sm:text-2xl
                                                                text-gray-900
                                                                mt-7
                                                                mb-3
                                                            "
                                                            dangerouslySetInnerHTML={{
                                                                __html: block.data.text
                                                            }}
                                                        ></h4>
                                                    )

                                                }

                                            }


                                            else if(block.type == "paragraph") {

                                                return (
                                                    <p
                                                        key={index}
                                                        className="
                                                            my-5
                                                            leading-8
                                                            text-gray-700
                                                        "
                                                        dangerouslySetInnerHTML={{
                                                            __html: block.data.text
                                                        }}
                                                    ></p>
                                                )

                                            }

                                            else if(block.type == "code") {

                                                return (
                                                    <div className="my-7">

                                                        <div className="
                                                            bg-[#111827]
                                                            rounded-2xl
                                                            overflow-hidden
                                                            border
                                                            border-gray-800
                                                            shadow-lg
                                                        ">

                                                            {/* Code Header */}

                                                            <div className="
                                                                flex
                                                                items-center
                                                                justify-between
                                                                px-4
                                                                py-3
                                                                bg-[#1f2937]
                                                                border-b
                                                                border-gray-700
                                                            ">

                                                                <div className="
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                ">

                                                                    <span className="
                                                                        w-3
                                                                        h-3
                                                                        rounded-full
                                                                        bg-red-400
                                                                    ></span>

                                                                    <span className="
                                                                        w-3
                                                                        h-3
                                                                        rounded-full
                                                                        bg-yellow-400
                                                                    ></span>

                                                                    <span className="
                                                                        w-3
                                                                        h-3
                                                                        rounded-full
                                                                        bg-green-400"
                                                                    ></span>

                                                                </div>


                                                                <span className="
                                                                    text-xs
                                                                    text-gray-400
                                                                    font-mono
                                                                ">
                                                                    code
                                                                </span>

                                                            </div>


                                                            {/* Code Content */}

                                                            <pre className="
                                                                p-5
                                                                overflow-x-auto
                                                                text-sm
                                                                sm:text-base
                                                                leading-7
                                                                text-gray-100
                                                                font-mono
                                                                whitespace-pre
                                                            ">
                                                                <code>
                                                                    {block.data.code}
                                                                </code>
                                                            </pre>

                                                        </div>

                                                    </div>
                                                )
                                            }



                                            else if(block.type == "image") {

                                                return (
                                                    <div
                                                        key={index}
                                                        className="
                                                            my-8
                                                        "
                                                    >

                                                        <div className="
                                                            overflow-hidden
                                                            rounded-2xl
                                                            border
                                                            border-gray-100
                                                            bg-gray-50
                                                            shadow-sm
                                                        ">

                                                            <img
                                                                src={block.data.file.url}
                                                                alt=""
                                                                className="
                                                                    w-full
                                                                    h-auto
                                                                    object-contain
                                                                "
                                                            />

                                                        </div>


                                                        <p className="
                                                            text-center
                                                            mt-3
                                                            text-sm
                                                            italic
                                                            text-gray-400
                                                        ">
                                                            {block.data.caption}
                                                        </p>

                                                    </div>
                                                )

                                            }


                                             else if (block?.type?.toLowerCase() === "list") {

                                                if (block?.data?.style === "ordered") {

                                                    return (
                                                        <ol
                                                            key={index}
                                                            className="
                                                                list-decimal
                                                                list-inside
                                                                my-6
                                                                space-y-2
                                                                pl-2
                                                            "
                                                        >

                                                            {block?.data?.items?.map((item, itemIdx) => (

                                                                <li
                                                                    key={itemIdx}
                                                                    className="
                                                                        pl-2
                                                                        leading-7
                                                                    "
                                                                >
                                                                    {typeof item === "string" ? item : item?.content}
                                                                </li>

                                                            ))}

                                                        </ol>
                                                    )

                                                }


                                                else if (block?.data?.style === "unordered") {

                                                    return (
                                                        <ul
                                                            key={index}
                                                            className="
                                                                list-disc
                                                                list-inside
                                                                my-6
                                                                space-y-2
                                                                pl-2
                                                            "
                                                        >

                                                            {block?.data?.items?.map((item, itemIdx) => (

                                                                <li
                                                                    key={itemIdx}
                                                                    className="
                                                                        pl-2
                                                                        leading-7
                                                                    "
                                                                >
                                                                    {typeof item === "string" ? item : item?.content}
                                                                </li>

                                                            ))}

                                                        </ul>
                                                    )

                                                }

                                            }

                                        })
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="
                        min-h-[70vh]
                        flex
                        items-center
                        justify-center
                    ">

                        <div className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-100
                            shadow-sm
                            px-8
                            py-6
                            text-gray-500
                        ">
                            Loading...
                        </div>

                    </div>

                )
            }


            {
                isOpen &&
                <Comment/>
            }

        </div>
    )
}

export default BlogPage