import axios from "axios";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useParams, Link, useLocation, Navigate } from "react-router-dom"
import { handleFollowCreator, handleDeleteBlog } from "../utils/blogActions";
import { useDispatch, useSelector } from "react-redux";
import { removeSelectedBlog } from "../utils/selectedBlogSlice";
import DisplayBlogs from "../components/DisplayBlogs";


function ProfilePage() {

    const {username} = useParams()
    const cleanUsername = username?.startsWith("@") ? username.slice(1) : username;
    const [userData, setUserData] = useState(null)
    const {token, id:userId} = useSelector((state) =>state.user)
    const location = useLocation()
    const dispatch = useDispatch()

    const [blogToDelete, setBlogToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const isOwner = Boolean(userId && (userData?._id || "").toString() === userId.toString());

    async function handleConfirmDelete() {
        if (!blogToDelete || isDeleting) return;
        setIsDeleting(true);
        await handleDeleteBlog(blogToDelete._id, token, () => {
            setUserData((prev) => {
                if (!prev) return prev;
                const targetId = blogToDelete._id?.toString();
                const targetSlug = blogToDelete.blogId;
                return {
                    ...prev,
                    blogs: (prev.blogs || []).filter(
                        (b) => b._id?.toString() !== targetId && b.blogId !== targetSlug
                    ),
                    saveBlogs: (prev.saveBlogs || []).filter(
                        (b) => b._id?.toString() !== targetId && b.blogId !== targetSlug
                    ),
                    likeBlogs: (prev.likeBlogs || []).filter(
                        (b) => b._id?.toString() !== targetId && b.blogId !== targetSlug
                    ),
                };
            });
            dispatch(removeSelectedBlog());
            setBlogToDelete(null);
        });
        setIsDeleting(false);
    }

    function renderComponent() {
        if(location.pathname === `/${username}`) {
            return (
                <DisplayBlogs 
                    blogs={userData?.blogs?.filter((blog) => !blog?.draft) || []}
                    onDeleteBlog={isOwner ? setBlogToDelete : null}
                />
            )
        }
        else if (location.pathname === `/${username}/saved-blogs`) {
            if (userData?.showSavedBlogs || isOwner) {
                return <DisplayBlogs blogs={userData?.saveBlogs || []}/>
            }
            return <Navigate to={`/${username}`} replace />
        }
        else if (location.pathname === `/${username}/draft-blogs`) {
            if (isOwner) {
                return (
                    <DisplayBlogs 
                        blogs={userData?.blogs?.filter((blog) => blog?.draft) || []}
                        onDeleteBlog={setBlogToDelete}
                    />
                )
            }
            return <Navigate to={`/${username}`} replace />
        }
        else if(location.pathname === `/${username}/liked-blogs`){
            if (userData?.showLikedBlogs || isOwner) {
                return <DisplayBlogs blogs={userData?.likeBlogs || []}/>
            }
            return <Navigate to={`/${username}`} replace />
        }
        return null
    }

    useEffect(() => {
        let isMounted = true;
        async function fetchUserDetails() {
            if (!cleanUsername) return;
            try {
                let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${cleanUsername}`);
                if (!isMounted) return;
                setUserData(res?.data?.user)
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load user profile")
            }
        }
        fetchUserDetails()
        return () => {
            isMounted = false;
        }
    },[cleanUsername])
    
    return (
    <div className="w-full min-h-[calc(100vh-55px)] bg-gradient-to-br from-green-50/40 via-white to-gray-50">

        {
            userData ? (

                <div className="w-full max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ================= PROFILE HEADER ================= */}
                    <div className="pt-6 sm:pt-8">

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_35px_rgba(0,0,0,0.06)] overflow-hidden">

                            {/* Green Cover */}
                            <div className="h-28 sm:h-36 bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 relative overflow-hidden">

                                {/* Decorative circles */}
                                <div className="absolute w-44 h-44 bg-white/10 rounded-full -top-24 -right-8"></div>

                                <div className="absolute w-32 h-32 bg-white/10 rounded-full -bottom-20 left-20"></div>

                                <div className="absolute right-12 bottom-5 text-white/20 text-5xl">
                                    ❋
                                </div>

                            </div>


                            {/* ================= PROFILE INFORMATION ================= */}
                            <div className="px-5 sm:px-8 pb-7">

                                {/* Avatar + Name + Button */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-4 -mt-0 pt-5">

                                        {/* Profile Image */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-lg ring-4 ring-green-50 flex-shrink-0">

                                            <img
                                                src={
                                                    userData?.profilePic
                                                        ? userData?.profilePic
                                                        : `https://api.dicebear.com/10.x/initials/svg?seed=${userData?.name}`
                                                }
                                                alt="User"
                                                className="rounded-full w-full h-full object-cover"
                                            />

                                        </div>


                                        {/* Name */}
                                        <div>

                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                {userData?.name}
                                            </h1>

                                            <p className="text-sm text-gray-500 mt-1">
                                                @{userData?.username}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Edit / Follow Button */}
                                    <div>

                                        {
                                            isOwner ? (

                                                <button
                                                    className="bg-green-500 hover:bg-green-600 px-5 py-2.5 text-white font-semibold rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
                                                >
                                                    <Link to={"/edit-profile"}>
                                                        Edit Profile
                                                    </Link>
                                                </button>

                                            ) : (

                                                <button
                                                    onClick={async () => {
                                                        await handleFollowCreator(userData?._id, token, () => {
                                                            setUserData(prev => {
                                                                if (!prev) return prev;
                                                                const followers = prev.followers || [];
                                                                const isFollowing = followers.some(f => (f._id || f).toString() === userId?.toString());
                                                                const updatedFollowers = isFollowing
                                                                    ? followers.filter(f => (f._id || f).toString() !== userId?.toString())
                                                                    : [...followers, userId];
                                                                return {
                                                                    ...prev,
                                                                    followers: updatedFollowers
                                                                };
                                                            });
                                                        });
                                                    }}
                                                    className="bg-green-500 hover:bg-green-600 px-6 py-2.5 text-white font-semibold rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
                                                >
                                                    {userData?.followers?.some(f => (f._id || f).toString() === userId?.toString()) ? "Unfollow" : "Follow"}
                                                </button>

                                            )
                                        }

                                    </div>

                                </div>


                                {/* Bio */}
                                <div className="mt-5 max-w-[750px]">

                                    <p className="text-gray-600 leading-6 text-sm sm:text-base">
                                        {userData?.bio}
                                    </p>

                                </div>


                                {/* Stats */}
                                <div className="flex items-center gap-7 mt-5">

                                    {/* Followers */}
                                    <div>

                                        <p className="text-lg font-bold text-gray-900">
                                            {userData?.followers?.length}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Followers
                                        </p>

                                    </div>


                                    {/* Divider */}
                                    <div className="h-8 w-px bg-gray-200"></div>


                                    {/* Following */}
                                    <div>

                                        <p className="text-lg font-bold text-gray-900">
                                            {userData?.following?.length}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Following
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= MAIN CONTENT ================= */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-7 mt-7">


                        {/* ================= LEFT SIDE ================= */}
                        <div className="min-w-0">

                            {/* Navigation */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 sm:px-5">

                                <nav className="overflow-x-auto">

                                    <ul className="flex items-center gap-1 sm:gap-2 min-w-max">

                                        {/* Home */}
                                        <li>

                                            <Link
                                                to={`/${username}`}
                                                className={`
                                                    block px-4 py-3.5 text-sm font-medium transition-all
                                                    ${
                                                        location.pathname == `/${username}`
                                                            ? "text-green-600 border-b-2 border-green-500"
                                                            : "text-gray-500 hover:text-gray-900"
                                                    }
                                                `}
                                            >
                                                Home
                                            </Link>

                                        </li>


                                        {/* Saved Blogs */}
                                        {
                                            userData?.showSavedBlogs || isOwner
                                                ? (
                                                    <li>

                                                        <Link
                                                            to={`/${username}/saved-blogs`}
                                                            className={`
                                                                block px-4 py-3.5 text-sm font-medium transition-all
                                                                ${
                                                                    location.pathname ===
                                                                    `/${username}/saved-blogs`
                                                                        ? "text-green-600 border-b-2 border-green-500"
                                                                        : "text-gray-500 hover:text-gray-900"
                                                                }
                                                            `}
                                                        >
                                                            Saved

                                                            <span className="hidden sm:inline">
                                                                {" "}Blogs
                                                            </span>

                                                        </Link>

                                                    </li>
                                                )
                                                : null
                                        }


                                        {/* Liked Blogs */}
                                        {
                                            userData?.showLikedBlogs || isOwner
                                                ? (
                                                    <li>

                                                        <Link
                                                            to={`/${username}/liked-blogs`}
                                                            className={`
                                                                block px-4 py-3.5 text-sm font-medium transition-all
                                                                ${
                                                                    location.pathname ===
                                                                    `/${username}/liked-blogs`
                                                                        ? "text-green-600 border-b-2 border-green-500"
                                                                        : "text-gray-500 hover:text-gray-900"
                                                                }
                                                            `}
                                                        >
                                                            Liked

                                                            <span className="hidden sm:inline">
                                                                {" "}Blogs
                                                            </span>

                                                        </Link>

                                                    </li>
                                                )
                                                : null
                                        }


                                        {/* Draft Blogs */}
                                        {
                                            isOwner
                                                ? (
                                                    <li>

                                                        <Link
                                                            to={`/${username}/draft-blogs`}
                                                            className={`
                                                                block px-4 py-3.5 text-sm font-medium transition-all
                                                                ${
                                                                    location.pathname ===
                                                                    `/${username}/draft-blogs`
                                                                        ? "text-green-600 border-b-2 border-green-500"
                                                                        : "text-gray-500 hover:text-gray-900"
                                                                }
                                                            `}
                                                        >
                                                            Draft

                                                            <span className="hidden sm:inline">
                                                                {" "}Blogs
                                                            </span>

                                                        </Link>

                                                    </li>
                                                )
                                                : null
                                        }

                                    </ul>

                                </nav>

                            </div>


                            {/* Blogs */}
                            <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">

                                {
                                    renderComponent()
                                }

                            </div>

                        </div>


                        {/* ================= RIGHT SIDE ================= */}
                        <div className="hidden lg:block">

                            <div className="sticky top-5 space-y-5">


                                {/* About Profile Card */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                                    <div className="flex items-center gap-2 mb-5">

                                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                            👤
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-900">
                                            About
                                        </h2>

                                    </div>


                                    {/* Small Profile */}
                                    <div className="flex items-center gap-3 mb-5">

                                        <div className="w-12 h-12 rounded-full bg-green-50 p-1">

                                            <img
                                                src={
                                                    userData?.profilePic
                                                        ? userData?.profilePic
                                                        : `https://api.dicebear.com/10.x/initials/svg?seed=${userData?.name}`
                                                }
                                                alt="User"
                                                className="rounded-full w-full h-full object-cover"
                                            />

                                        </div>


                                        <div>

                                            <p className="font-semibold text-gray-900">
                                                {userData?.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                @{userData?.username}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Bio */}
                                    <div className="bg-gray-50 rounded-xl p-4">

                                        <p className="text-sm text-gray-600 leading-6">
                                            {userData?.bio}
                                        </p>

                                    </div>


                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">

                                        <div className="bg-green-50 rounded-xl p-3 text-center">

                                            <p className="text-lg font-bold text-green-600">
                                                {userData?.followers?.length}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Followers
                                            </p>

                                        </div>


                                        <div className="bg-gray-50 rounded-xl p-3 text-center">

                                            <p className="text-lg font-bold text-gray-700">
                                                {userData?.following?.length}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Following
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Following Card */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                                    <div className="flex items-center justify-between mb-5">

                                        <h2 className="text-lg font-bold text-gray-900">
                                            Following
                                        </h2>

                                        <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                                            {userData?.following?.length}
                                        </span>

                                    </div>


                                    <div>

                                        {
                                            userData?.following?.map((user) => (

                                                <div
                                                    className="py-3 border-b border-gray-50 last:border-none"
                                                    key={user?._id}
                                                >

                                                    <div className="flex justify-between items-center">

                                                        <Link
                                                            to={`/@${user?.username}`}
                                                        >

                                                            <div className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-1.5 -m-1.5 transition cursor-pointer">

                                                                <div className="w-9 h-9 rounded-full bg-green-50 p-0.5">

                                                                    <img
                                                                        src={`https://api.dicebear.com/10.x/initials/svg?seed=${user?.name}`}
                                                                        alt="User"
                                                                        className="rounded-full w-full h-full"
                                                                    />

                                                                </div>


                                                                <div>

                                                                    <p className="text-sm font-semibold text-gray-700">
                                                                        {user?.name}
                                                                    </p>

                                                                    <p className="text-xs text-gray-400">
                                                                        @{user?.username}
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </Link>

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                </div>


                                {/* eWrite Branding */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">

                                    <p className="text-xs font-bold tracking-[3px] text-green-600 mb-2">
                                        eWRITE
                                    </p>

                                    <h3 className="font-bold text-gray-800">
                                        Share your ideas.
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1 leading-5">
                                        Write, discover and connect with other creators.
                                    </p>

                                </div>


                            </div>

                        </div>

                    </div>

                </div>

            ) : (

                <div className="min-h-[60vh] flex items-center justify-center">

                    <div className="text-center">

                        <div className="w-12 h-12 border-4 border-green-100 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>

                        <p className="text-gray-500 text-sm">
                            Loading profile...
                        </p>

                    </div>

                </div>

            )
        }

        {/* Delete Blog Confirmation Modal */}
        {blogToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 text-xl">
                        <i className="fi fi-rr-trash"></i>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Delete Blog
                    </h3>

                    <p className="text-gray-600 text-sm leading-6 mb-4">
                        Are you sure you want to delete this blog? This action cannot be undone.
                    </p>

                    {blogToDelete?.title && (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                Blog Title
                            </p>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                                "{blogToDelete.title}"
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => setBlogToDelete(null)}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleConfirmDelete}
                            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <span>Delete</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
)
}

export default ProfilePage