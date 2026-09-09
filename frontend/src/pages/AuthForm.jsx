import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { login } from "../utils/userSlice";
import Input from "../components/Input";
import googleIcon from "../../public/googleIcon.svg"
import { googleAuth } from "../utils/firebase";

function AuthForm({type}) {
    const [userData, setUserData] = useState({
            name: "", 
            email: "", 
            password: "" ,
        })

const dispatch = useDispatch()
const navigate= useNavigate()

async function handleAuthForm(e) {
    e.preventDefault();
    try {
        
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${type}`,userData)
        
        if(type =="signup") {
            toast.success(res.data.message);
            navigate("/signin")
        }
        else {
            // Store user's data and token to Redux Slices
            dispatch(login(res.data.user))
            toast.success(res.data.message);  
            navigate("/")
        }
        
        
    } 
    catch (error) {
        toast.error(error.response?.data?.message || "Authentication failed")
    }
    finally {
        setUserData({
            name: "", 
            email: "", 
            password: "" 
        })
    }
}
    
async function handleGoogleAuth() {
    try {
        let user = await googleAuth()
        if (!user) return

        const idToken = typeof user.getIdToken === "function" ? await user.getIdToken() : user.accessToken

        let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/google-auth`,{
            accessToken: idToken
        })
        dispatch(login(res.data.user))
        toast.success(res.data.message); 
        navigate("/")
    } catch (error) {
        toast.error(error.response?.data?.message || "Google sign in failed")
    }
}

    return (
        
        <div className="
            w-full
            min-h-[calc(100vh-50px)]
            bg-gradient-to-br
            from-white
            via-white
            to-emerald-50
            relative
            overflow-hidden
            flex
            items-center
            justify-center
            px-6
            py-12
        ">

            {/* ================= BACKGROUND DECORATION ================= */}

            <div className="
                absolute
                -top-32
                -right-32
                w-96
                h-96
                rounded-full
                bg-green-100/60
                blur-3xl
            "></div>

            <div className="
                absolute
                -bottom-40
                -left-40
                w-[450px]
                h-[450px]
                rounded-full
                bg-emerald-100/50
                blur-3xl
            "></div>

            <div className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[500px]
                h-[500px]
                rounded-full
                bg-green-50/50
                blur-3xl
            "></div>


            {/* ================= MAIN CONTENT ================= */}

            <div className="
                relative
                z-10
                w-full
                max-w-[1250px]
                flex
                items-center
                justify-between
                gap-10
            ">


                {/* ================= LEFT SECTION ================= */}

                <div className="
                    flex-1
                    max-w-[360px]
                    hidden
                    lg:block
                ">

                    <p className="
                        text-green-600
                        font-bold
                        tracking-[4px]
                        text-sm
                        mb-5
                    ">
                        SHARE&nbsp;&nbsp;•&nbsp;&nbsp;READ&nbsp;&nbsp;•&nbsp;&nbsp;GROW
                    </p>


                    <h2 className="
                        text-5xl
                        font-extrabold
                        leading-[1.08]
                        text-slate-900
                    ">
                        Ideas
                        <br />
                        build a better
                        <br />
                        tomorrow
                    </h2>


                    <div className="
                        w-16
                        h-2
                        bg-green-500
                        rounded-full
                        mt-7
                        mb-7
                    "></div>


                    <p className="
                        text-lg
                        leading-8
                        text-slate-500
                        max-w-[320px]
                    ">
                        Join a community of curious minds.
                        Write, share, and discover stories
                        that inspire.
                    </p>


                    {/* Quote */}

                    <div className="mt-16">

                        <p className="
                            text-4xl
                            font-semibold
                            italic
                            text-emerald-600
                            leading-tight
                        ">
                            Good
                            <br />
                            Ideas
                            <br />
                            Live Forever
                        </p>

                        <div className="
                            mt-3
                            w-28
                            h-[3px]
                            bg-emerald-500
                            rotate-[-8deg]
                            rounded-full
                        "></div>

                    </div>

                </div>



                {/* ================= AUTH CARD ================= */}

                <div className="
                    w-full
                    max-w-[465px]
                    bg-white/90
                    backdrop-blur-xl
                    border
                    border-white
                    rounded-[30px]
                    px-9
                    py-8
                    shadow-[0_25px_80px_rgba(15,23,42,0.12)]
                ">


                    {/* ================= LOGO ================= */}

                    <div className="
                        flex
                        flex-col
                        items-center
                        mb-7
                    ">

                        <div className="
                            w-16
                            h-16
                            rounded-[18px]
                            bg-gradient-to-br
                            from-green-500
                            to-emerald-600
                            flex
                            items-center
                            justify-center
                            shadow-[0_10px_25px_rgba(16,185,129,0.3)]
                            mb-4
                        ">

                            <i className="
                                fi
                                fi-rr-pencil
                                text-white
                                text-2xl
                            "></i>

                        </div>


                        <h1 className="
                            text-3xl
                            font-extrabold
                            tracking-tight
                            text-slate-900
                        ">
                            {type === "signin"
                                ? "Welcome Back"
                                : "Create Account"
                            }
                        </h1>


                        <p className="
                            text-sm
                            text-slate-500
                            mt-2
                            text-center
                        ">
                            {type === "signin"
                                ? "Sign in to continue writing and exploring"
                                : "Join eWrite and start sharing your stories"
                            }
                        </p>

                    </div>



                    {/* ================= AUTH FORM ================= */}

                    <form
                        onSubmit={handleAuthForm}
                        className="
                            w-full
                            flex
                            flex-col
                            items-center
                            gap-4
                        "
                    >

                        {/* Name */}

                        {
                            type === "signup" && (
                                <>
                                    <Input 
                                        type={"text"} 
                                        placeholder={"Enter your name"} 
                                        setUserData={setUserData}
                                        field={"name"}
                                        value={userData.name}
                                        icon={"fi-rr-circle-user"}
                                    />

                                    <br />
                                </>
                            )
                        }


                        {/* Email */}

                        <Input 
                            type={"email"} 
                            placeholder={"Enter your email"} 
                            setUserData={setUserData}
                            field={"email"}
                            value={userData.email}
                            icon={"fi-rr-envelope"}
                        />

                        <br />


                        {/* Password */}

                        <Input 
                            type={"password"} 
                            placeholder={"Enter your password"} 
                            setUserData={setUserData}
                            field={"password"}
                            value={userData.password}
                            icon={"fi-rr-lock"}
                        />

                        <br />


                        {/* ================= REGISTER BUTTON ================= */}

                        <button
                            className="
                                w-full
                                h-[54px]
                                focus:outline-none
                                hover:cursor-pointer
                                text-lg
                                font-bold
                                text-white
                                bg-gradient-to-r
                                from-green-500
                                to-emerald-600
                                rounded-xl
                                shadow-[0_10px_25px_rgba(16,185,129,0.25)]
                                hover:shadow-[0_14px_30px_rgba(16,185,129,0.35)]
                                hover:-translate-y-[2px]
                                active:translate-y-0
                                transition-all
                                duration-200
                            "
                        >
                            {type === "signin" ? "Login" : "Register"}
                            <span className="ml-2">
                                →
                            </span>
                        </button>

                    </form>



                    {/* ================= OR DIVIDER ================= */}

                    <div className="
                        w-full
                        flex
                        items-center
                        gap-4
                        my-6
                    ">

                        <div className="
                            flex-1
                            h-px
                            bg-slate-200
                        "></div>


                        <p className="
                            text-sm
                            font-semibold
                            text-slate-400
                        ">
                            OR
                        </p>


                        <div className="
                            flex-1
                            h-px
                            bg-slate-200
                        "></div>

                    </div>



                    {/* ================= GOOGLE AUTH ================= */}

                    <div
                        onClick={handleGoogleAuth}
                        className="
                            bg-white
                            w-full
                            h-[54px]
                            px-4
                            rounded-xl
                            flex
                            gap-3
                            items-center
                            justify-center
                            border
                            border-slate-200
                            shadow-sm
                            hover:bg-slate-50
                            hover:border-slate-300
                            hover:shadow-md
                            cursor-pointer
                            transition-all
                            duration-200
                        "
                    >

                        <img
                            className="w-5 h-5"
                            src={googleIcon}
                            alt="eWrite"
                        />


                        <p className="
                            text-base
                            font-semibold
                            text-slate-700
                        ">
                            Continue with Google
                        </p>

                    </div>



                    {/* ================= ACCOUNT SWITCH ================= */}

                    {
                        type === "signin" ? 

                        <p className="
                            text-sm
                            text-slate-500
                            text-center
                            mt-6
                        ">
                            Don't have an account?{" "}

                            <Link
                                to={"/signup"}
                                className="
                                    font-bold
                                    text-green-600
                                    hover:text-green-700
                                    hover:underline
                                    transition-colors
                                "
                            >
                                Sign Up
                            </Link>

                        </p>

                        : 

                        <p className="
                            text-sm
                            text-slate-500
                            text-center
                            mt-6
                        ">
                            Already have an account?{" "}

                            <Link
                                to={"/signin"}
                                className="
                                    font-bold
                                    text-green-600
                                    hover:text-green-700
                                    hover:underline
                                    transition-colors
                                "
                            >
                                Sign In
                            </Link>

                        </p>
                    }

                </div>



                {/* ================= RIGHT SECTION ================= */}

                <div className="
                    flex-1
                    max-w-[360px]
                    hidden
                    lg:flex
                    flex-col
                    items-center
                    justify-center
                    relative
                ">


                    {/* Handwritten heading */}

                    <div className="
                        self-start
                        ml-10
                        mb-5
                    ">

                        <p className="
                            text-4xl
                            font-semibold
                            italic
                            text-slate-500
                            leading-tight
                            rotate-[-5deg]
                        ">
                            Write
                            <br />
                            Your Story
                        </p>


                        <div className="
                            w-24
                            h-[3px]
                            bg-emerald-400
                            rounded-full
                            rotate-[-12deg]
                            mt-2
                            ml-8
                        "></div>

                    </div>



                    {/* ================= BOOK STACK ================= */}

                    <div className="
                        relative
                        w-[290px]
                        h-[280px]
                        flex
                        flex-col
                        justify-end
                    ">

                        {/* Plant */}

                        <div className="
                            absolute
                            right-[-20px]
                            top-[-30px]
                            text-green-700
                        ">

                            <div className="
                                text-7xl
                                rotate-[-20deg]
                            ">
                                🌿
                            </div>

                        </div>


                        {/* Book 1 */}

                        <div className="
                            w-[260px]
                            h-[65px]
                            bg-gradient-to-r
                            from-emerald-700
                            to-green-600
                            rounded-lg
                            shadow-xl
                            flex
                            items-center
                            justify-center
                            text-white
                            text-2xl
                            font-semibold
                            ml-3
                            rotate-[-2deg]
                        ">
                            Ideas
                        </div>


                        {/* Book 2 */}

                        <div className="
                            w-[275px]
                            h-[62px]
                            bg-[#f3eee2]
                            border
                            border-slate-200
                            rounded-lg
                            shadow-xl
                            flex
                            items-center
                            justify-center
                            text-slate-700
                            text-2xl
                            font-semibold
                            -mt-1
                            rotate-[1deg]
                        ">
                            Inspire
                        </div>


                        {/* Book 3 */}

                        <div className="
                            w-[265px]
                            h-[65px]
                            bg-gradient-to-r
                            from-green-800
                            to-emerald-700
                            rounded-lg
                            shadow-xl
                            flex
                            items-center
                            justify-center
                            text-white
                            text-2xl
                            font-semibold
                            ml-5
                            -mt-1
                            rotate-[-1deg]
                        ">
                            Change
                        </div>

                    </div>



                    {/* Quote */}

                    <p className="
                        text-center
                        text-sm
                        text-slate-500
                        max-w-[280px]
                        mt-7
                        leading-6
                    ">
                        "A reader lives a thousand lives
                        before he dies."
                        <br />
                        <span className="font-semibold">
                            — George R.R. Martin
                        </span>
                    </p>
                    
                    <footer className="text-center py-4 text-sm text-gray-500">
                        © 2026 eWrite · Developed by <span className="font-semibold text-gray-700">Ankit Raj</span>
                    </footer>

                </div>

            </div>

        </div>
    )
}
export default AuthForm;