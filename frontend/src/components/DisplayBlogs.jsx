import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useSelector } from "react-redux";
import { handleSaveBlog } from "../utils/blogActions";

function DisplayBlogs({ blogs = [], onDeleteBlog = null }) {
    const { token, id: userId } = useSelector((state) => state?.user);

    return (
        <div>
            {blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                    <Link key={blog?._id} to={"/blog/" + blog?.blogId}>
                        <div className="my-10 flex w-full justify-between items-start">
                            <div className="w-[65%] sm:w-[70%] flex flex-col gap-2">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">{blog?.creator?.name}</p>
                                </div>

                                <h1 className="font-bold text-xl sm:text-2xl hover:text-green-600 transition-colors">
                                    {blog?.title}
                                </h1>
                                <h4 className="line-clamp-2 text-gray-600 text-sm sm:text-base">{blog?.description}</h4>
                                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                                    <p>{formatDate(blog?.createdAt)}</p>

                                    {/* Likes, comments, saves, and actions */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <i className="fi fi-rr-heart text-base"></i>
                                            <p>{blog?.likes?.length || 0}</p>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <i className="fi fi-rr-comment-alt text-base"></i>
                                            <p>{blog?.comments?.length || 0}</p>
                                        </div>

                                        {/* Save blog button */}
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSaveBlog(blog?._id, token);
                                            }}
                                            className="hover:cursor-pointer flex items-center gap-1.5 hover:text-green-600 transition-colors"
                                        >
                                            {blog?.totalSaves?.some((s) => (s._id || s).toString() === userId?.toString()) ? (
                                                <i className="fi fi-sr-bookmark text-base text-green-600"></i>
                                            ) : (
                                                <i className="fi fi-rr-bookmark text-base"></i>
                                            )}
                                        </div>

                                        {/* Delete blog button (Only rendered when onDeleteBlog is provided) */}
                                        {onDeleteBlog && (
                                            <button
                                                type="button"
                                                title="Delete Blog"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onDeleteBlog(blog);
                                                }}
                                                className="hover:cursor-pointer flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                                            >
                                                <i className="fi fi-rr-trash text-sm"></i>
                                                <span>Delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Blog thumbnail  user image*/}
                            <div className="w-[28%] sm:w-[20%] lg:w-[30%]">
                                <img src={blog?.image} alt="Blog Cover" />
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <h1 className="md:mx-30 font-bold md:my-10">No data found...</h1>
            )}
        </div>
    );
}

export default DisplayBlogs;