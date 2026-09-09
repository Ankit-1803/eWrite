import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../utils/userSlice"
import { Navigate, useNavigate } from "react-router-dom"

function EditProfile() {

    const {token, id:userId, email, name, username, profilePic, bio} = useSelector((state) =>state.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        profilePic: profilePic || null,
        name: name || "",
        username: username || "",
        bio: bio || "",
    })

    const initialData = {
        profilePic: profilePic || null,
        name: name || "",
        username: username || "",
        bio: bio || "",
    }

    const [isSubmitting, setIsSubmitting] = useState(false)

    const isUnchanged = JSON.stringify(userData) === JSON.stringify(initialData)
    const isButtonDisabled = isUnchanged || isSubmitting

    function handleChange(e) {
        const {value, name, files} = e.target
        if(files) {
            setUserData((prevData) => ({...prevData, [name]: files[0]}))
        }
        else {
            setUserData((prevData) => ({...prevData, [name]: value}))
        }
    }
    
    // Send data to backend
    async function handleUpdateProfile() {
        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("name" , userData.name || "")
        formData.append("username" , userData.username || "")
        if(userData.profilePic && typeof userData.profilePic !== "string") {
            formData.append("profilePic" , userData.profilePic)
        } else if (!userData.profilePic) {
            formData.append("profilePic", "")
        }
        formData.append("bio" , userData.bio || "")

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            }
        )
        toast.success(res.data.message)
        dispatch(login({...res.data.user, token, email, id: userId}))
        navigate(-1)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile")
            setIsSubmitting(false)
        }
    }

    return (
    !token ? (
        <Navigate to={"/signin"}/>
    ) : (
        <div className="w-full min-h-[calc(100vh-45px)] bg-gradient-to-br from-green-50 via-white to-gray-50 p-5">

            <div className="w-full md:w-[40%] lg:w-[30%] mx-auto my-8 lg:px-2">

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-7 text-white">
                        <h1 className="text-3xl font-bold">
                            Edit Profile
                        </h1>

                        <p className="text-green-50 mt-1 text-sm">
                            Update your personal information
                        </p>
                    </div>


                    <div className="p-6">

                        {/* Image field */}
                        <div className="mb-7">

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Profile Photo
                                    </h2>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Choose a photo that represents you
                                    </p>
                                </div>
                            </div>


                            <div className="flex items-center flex-col gap-3">

                                <label
                                    htmlFor="image"
                                    className="relative group cursor-pointer"
                                >
                                    {
                                        userData?.profilePic ? (
                                            <img
                                                src={
                                                    typeof(userData?.profilePic) === "string"
                                                        ? userData?.profilePic
                                                        : URL.createObjectURL(userData?.profilePic)
                                                }
                                                className="w-[145px] h-[145px] aspect-square object-cover rounded-full border-4 border-white ring-4 ring-green-100 shadow-lg transition-all duration-300 group-hover:ring-green-300 group-hover:scale-[1.02]"
                                                alt="Blog Image"
                                            />
                                        ) : (
                                            <div
                                                className="bg-gray-50 border-2 border-dashed w-[145px] h-[145px] border-green-300 rounded-full flex flex-col justify-center items-center text-gray-400 transition-all duration-300 group-hover:bg-green-50 group-hover:border-green-500"
                                            >
                                                <span className="text-3xl mb-1">
                                                    +
                                                </span>

                                                <span className="text-sm font-medium">
                                                    Select Image
                                                </span>
                                            </div>
                                        )
                                    }

                                    {/* Camera overlay */}
                                    <div className="absolute bottom-1 right-1 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-md text-white text-lg transition-transform group-hover:scale-110">
                                        📷
                                    </div>
                                </label>


                                {/* Remove profile picture */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserData((prevData) => ({
                                            ...prevData,
                                            profilePic: null
                                        }))
                                    }}
                                    className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline transition cursor-pointer"
                                >
                                    Remove photo
                                </button>

                            </div>


                            <input
                                className="hidden"
                                id="image"
                                type="file"
                                accept=".png, .jpeg, .jpg"
                                onChange={handleChange}
                                name="profilePic"
                            />

                        </div>


                        {/* Divider */}
                        <div className="h-px bg-gray-100 mb-6"></div>


                        {/* Name field */}
                        <div className="my-5">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Name
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    👤
                                </span>

                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={userData?.name || ""}
                                    name="name"
                                    onChange={handleChange}
                                    className="border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none rounded-xl w-full py-3 pl-11 pr-4 placeholder:text-gray-400 bg-gray-50 focus:bg-white transition-all duration-200"
                                />

                            </div>

                        </div>


                        {/* Username field */}
                        <div className="my-5">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                    @
                                </span>

                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={userData?.username || ""}
                                    name="username"
                                    onChange={handleChange}
                                    className="border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none rounded-xl w-full py-3 pl-11 pr-4 placeholder:text-gray-400 bg-gray-50 focus:bg-white transition-all duration-200"
                                />

                            </div>

                        </div>


                        {/* Bio field */}
                        <div className="my-5">

                            <div className="flex items-center justify-between mb-2">

                                <label className="block text-sm font-semibold text-gray-700">
                                    Bio
                                </label>

                                <span className="text-xs text-gray-400">
                                    Tell people about yourself
                                </span>

                            </div>


                            <textarea
                                placeholder="Enter your bio"
                                value={userData?.bio || ""}
                                name="bio"
                                onChange={handleChange}
                                className="resize-none h-[150px] w-full border border-gray-200 rounded-xl p-4 text-sm leading-6 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-gray-50 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                            />

                        </div>


                        {/* Update Button */}
                        <button
                            disabled={isButtonDisabled}
                            onClick={handleUpdateProfile}
                            className={
                                "w-full py-3.5 px-5 font-semibold rounded-xl transition-all duration-200 mt-3 " +
                                (
                                    isButtonDisabled
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-[1px] active:translate-y-0"
                                )
                            }
                        >
                            {isButtonDisabled ? "No Changes" : "Save Changes"}
                        </button>


                        {/* Bottom hint */}
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Your profile information will be updated securely.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
)
}

export default EditProfile