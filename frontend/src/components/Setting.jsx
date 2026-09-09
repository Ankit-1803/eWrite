import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { updateData } from "../utils/userSlice"

function Setting() {

    const {token, showLikedBlogs, showSavedBlogs} = useSelector((state) =>state?.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [data, setData] = useState({
        showLikedBlogs,
        showSavedBlogs,
    })

    async function handleVisibility() {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/change-blogs-visibility`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        dispatch(updateData(data))
        toast.success(res?.data?.message)
        navigate(-1)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    return (
    !token ? (
        <Navigate to={"/signin"}/>
    ) : (
        <div className="w-full min-h-[calc(100vh-120px)] bg-gradient-to-br from-green-50 via-white to-gray-50 p-5">

            <div className="w-full md:w-[500px] mx-auto my-8">

                {/* Settings Card */}
                <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-7 text-white">

                        <div className="flex items-center gap-4">

                            {/* Settings Icon */}
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                                ⚙️
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold">
                                    Settings
                                </h1>

                                <p className="text-sm text-green-50 mt-1">
                                    Manage your blog visibility preferences
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Settings Body */}
                    <div className="p-6">


                        {/* Privacy Section */}
                        <div className="mb-6">

                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                    🔒
                                </span>

                                <h2 className="text-lg font-bold text-gray-800">
                                    Privacy & Visibility
                                </h2>
                            </div>

                            <p className="text-sm text-gray-500">
                                Control which blogs are visible on your profile.
                            </p>

                        </div>


                        {/* Show Saved Blogs */}
                        <div className="mb-6">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Show Saved Blogs
                            </label>

                            <div className="relative">

                                <select
                                    name=""
                                    id=""
                                    value={data.showSavedBlogs}
                                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-base bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 cursor-pointer transition-all duration-200"
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            showSavedBlogs:
                                                e.target.value == "true"
                                                    ? true
                                                    : false
                                        }))
                                    }
                                >
                                    <option value="true">
                                        True
                                    </option>

                                    <option value="false">
                                        False
                                    </option>

                                </select>

                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    ▼
                                </div>

                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                Allow other users to see your saved blogs.
                            </p>

                        </div>


                        {/* Show Liked Blogs */}
                        <div className="mb-7">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Show Liked Blogs
                            </label>

                            <div className="relative">

                                <select
                                    name=""
                                    id=""
                                    value={data.showLikedBlogs}
                                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-base bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 cursor-pointer transition-all duration-200"
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            showLikedBlogs:
                                                e.target.value == "true"
                                                    ? true
                                                    : false
                                        }))
                                    }
                                >
                                    <option value="true">
                                        True
                                    </option>

                                    <option value="false">
                                        False
                                    </option>

                                </select>

                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    ▼
                                </div>

                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                Allow other users to see your liked blogs.
                            </p>

                        </div>


                        {/* Divider */}
                        <div className="h-px bg-gray-100 mb-6"></div>


                        {/* Update Button */}
                        <button
                            className="w-full h-[50px] rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 cursor-pointer"
                            onClick={handleVisibility}
                        >
                            Save Changes
                        </button>


                        {/* Bottom text */}
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Your privacy preferences are saved securely.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
)
}
export default Setting