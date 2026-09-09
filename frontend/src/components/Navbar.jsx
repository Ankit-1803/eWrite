import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../../public/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../utils/userSlice";

function Navbar() {

    const { token, name, profilePic, username } = useSelector(
        (state) => state.user
    );

    const [showPopup, setShowPopup] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();


    function handleLogout() {
        dispatch(logout());
        setShowPopup(false);
    }


    const [prevPath, setPrevPath] = useState(location.pathname);

    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        if (location.pathname !== "/search") {
            setSearchQuery("");
        }
        if (location.pathname !== "/") {
            setShowPopup(false);
        }
    }


    return (
        <>
            {/* ===================================================== */}
            {/*                         NAVBAR                        */}
            {/* ===================================================== */}

            <div className="
                bg-white
                w-full
                h-[58px]
                sm:h-[60px]
                px-3
                sm:px-5
                md:px-8
                lg:px-10
                flex
                justify-between
                items-center
                border-b
                border-gray-200
                shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                relative
                z-50
            ">


                {/* ================================================= */}
                {/*                    LEFT SECTION                   */}
                {/* ================================================= */}

                <div className="
                    flex
                    items-center
                    gap-2
                    sm:gap-4
                    md:gap-6
                    min-w-0
                    flex-shrink
                ">


                    {/* ================= BRAND ================= */}

                    <Link
                        to={"/"}
                        className="
                            flex
                            items-center
                            flex-shrink-0
                            cursor-pointer
                        "
                    >

                        <div className="
                            flex
                            items-center
                            gap-1.5
                            sm:gap-2
                        ">

                            {/* Logo */}

                            <div className="
                                w-8
                                h-8
                                sm:w-9
                                sm:h-9
                                md:w-10
                                md:h-10
                                flex
                                items-center
                                justify-center
                                flex-shrink-0
                            ">

                                <img
                                    src={logo}
                                    alt="eWrite"
                                    className="
                                        w-full
                                        h-full
                                        object-contain
                                    "
                                />

                            </div>


                            {/* App Name */}

                            <div className="
                                text-[20px]
                                sm:text-[23px]
                                md:text-[27px]
                                font-extrabold
                                tracking-tight
                                leading-none
                                whitespace-nowrap
                            ">

                                <span className="text-green-500">
                                    e
                                </span>

                                <span className="text-gray-900">
                                    Write
                                </span>

                            </div>

                        </div>

                    </Link>


                    {/* Divider */}

                    <div className="
                        hidden
                        md:block
                        h-7
                        w-px
                        bg-gray-200
                    "></div>


                    {/* ================================================= */}
                    {/*                    DESKTOP SEARCH                 */}
                    {/* ================================================= */}

                    <div className="
                        hidden
                        sm:block
                        relative
                    ">

                        <i className="
                            fi
                            fi-rr-search
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-lg
                            text-gray-500
                        "></i>


                        <input
                            type="text"
                            className="
                                bg-gray-100
                                border
                                border-transparent
                                focus:border-green-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-green-50
                                focus:outline-none
                                rounded-full
                                pl-11
                                pr-5
                                py-2.5
                                w-[190px]
                                md:w-[260px]
                                lg:w-[310px]
                                text-sm
                                text-gray-700
                                placeholder:text-gray-400
                                transition-all
                                duration-200
                            "
                            placeholder="Search blogs or topics"
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.code == "Enter") {

                                    if (searchQuery.trim()) {

                                        setShowSearchBar(false);
                                        setSearchQuery("");

                                        navigate(
                                            `/search?q=${encodeURIComponent(
                                                searchQuery.trim()
                                            )}`
                                        );

                                    }

                                }

                            }}
                        />

                    </div>

                </div>



                {/* ================================================= */}
                {/*                    RIGHT SECTION                  */}
                {/* ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-end
                    gap-1
                    sm:gap-3
                    md:gap-5
                    flex-shrink-0
                ">


                    {/* ================================================= */}
                    {/*                  MOBILE SEARCH                    */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        className="
                            sm:hidden
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
                        onClick={() =>
                            setShowSearchBar((prev) => !prev)
                        }
                    >

                        <i className="
                            fi
                            fi-rr-search
                            text-lg
                            text-gray-700
                        "></i>

                    </button>



                    {/* ================================================= */}
                    {/*                         WRITE                     */}
                    {/* ================================================= */}

                    <Link to={"/add-blog"}>

                        <div className="
                            flex
                            items-center
                            gap-2
                            px-2
                            sm:px-3
                            py-2
                            rounded-xl
                            hover:bg-green-50
                            hover:text-green-600
                            active:bg-green-100
                            transition-all
                            duration-200
                            cursor-pointer
                        ">

                            <i className="
                                fi
                                fi-rr-edit
                                text-lg
                                sm:text-xl
                                mt-1
                            "></i>


                            <span className="
                                text-sm
                                sm:text-base
                                font-medium
                                hidden
                                sm:inline
                            ">
                                Write
                            </span>

                        </div>

                    </Link>



                    {/* ================================================= */}
                    {/*                       PROFILE                     */}
                    {/* ================================================= */}

                    {
                        token ? (

                            <div
                                onClick={() =>
                                    setShowPopup((prev) => !prev)
                                }
                                className="
                                    w-8
                                    h-8
                                    sm:w-9
                                    sm:h-9
                                    rounded-full
                                    cursor-pointer
                                    flex-shrink-0
                                    p-[2px]
                                    bg-white
                                    border
                                    border-gray-200
                                    hover:ring-2
                                    hover:ring-green-200
                                    hover:border-green-300
                                    transition-all
                                    duration-200
                                "
                            >

                                <img
                                    src={
                                        profilePic
                                            ? profilePic
                                            : `https://api.dicebear.com/10.x/initials/svg?seed=${name}`
                                    }
                                    alt="User name logo at navbar"
                                    className="
                                        rounded-full
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                />

                            </div>

                        ) : (

                            /* ================= AUTH BUTTONS ================= */

                            <div className="
                                flex
                                items-center
                                gap-1.5
                                sm:gap-3
                            ">

                                <Link to={"/signup"}>

                                    <button
                                        className="
                                            bg-orange-500
                                            hover:bg-orange-600
                                            active:bg-orange-700
                                            text-white
                                            text-[11px]
                                            sm:text-sm
                                            font-semibold
                                            rounded-full
                                            px-2.5
                                            sm:px-4
                                            py-2
                                            cursor-pointer
                                            transition-all
                                            duration-200
                                            whitespace-nowrap
                                        "
                                    >
                                        Signup
                                    </button>

                                </Link>


                                <Link to={"/signin"}>

                                    <button
                                        className="
                                            bg-green-500
                                            hover:bg-green-600
                                            active:bg-green-700
                                            text-white
                                            text-[11px]
                                            sm:text-sm
                                            font-semibold
                                            rounded-full
                                            px-2.5
                                            sm:px-4
                                            py-2
                                            cursor-pointer
                                            transition-all
                                            duration-200
                                            whitespace-nowrap
                                        "
                                    >
                                        Signin
                                    </button>

                                </Link>

                            </div>

                        )
                    }

                </div>



                {/* ================================================= */}
                {/*                    MOBILE SEARCH                  */}
                {/* ================================================= */}

                {
                    showSearchBar && (

                        <div className="
                            sm:hidden
                            absolute
                            left-3
                            right-3
                            top-[63px]
                            z-[70]
                        ">

                            <div className="
                                bg-white
                                border
                                border-gray-200
                                rounded-2xl
                                shadow-[0_10px_35px_rgba(0,0,0,0.12)]
                                p-3
                            ">

                                <div className="relative">

                                    <i className="
                                        fi
                                        fi-rr-search
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-lg
                                        text-gray-500
                                    "></i>


                                    <input
                                        autoFocus
                                        type="text"
                                        className="
                                            bg-gray-100
                                            focus:bg-white
                                            border
                                            border-transparent
                                            focus:border-green-400
                                            focus:ring-4
                                            focus:ring-green-50
                                            focus:outline-none
                                            rounded-xl
                                            pl-10
                                            pr-4
                                            py-3
                                            w-full
                                            text-sm
                                            text-gray-700
                                            placeholder:text-gray-400
                                            transition-all
                                        "
                                        placeholder="Search blogs..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyDown={(e) => {

                                            if (e.code == "Enter") {

                                                if (searchQuery.trim()) {

                                                    setShowSearchBar(false);
                                                    setSearchQuery("");

                                                    navigate(
                                                        `/search?q=${encodeURIComponent(
                                                            searchQuery.trim()
                                                        )}`
                                                    );

                                                }

                                            }

                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    )
                }



                {/* ================================================= */}
                {/*                    PROFILE POPUP                   */}
                {/* ================================================= */}

                {
                    showPopup ? (

                        <div
                            onMouseLeave={() =>
                                setShowPopup(false)
                            }
                            className="
                                w-[170px]
                                sm:w-[180px]
                                bg-white
                                border
                                border-gray-200
                                absolute
                                right-2
                                sm:right-3
                                top-[62px]
                                sm:top-[65px]
                                rounded-2xl
                                shadow-[0_10px_35px_rgba(0,0,0,0.12)]
                                overflow-hidden
                                z-[80]
                                py-1
                            "
                        >

                            {/* Profile */}

                            <Link to={`/@${username}`}>

                                <p className="
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    hover:bg-green-50
                                    hover:text-green-600
                                    cursor-pointer
                                    transition
                                ">
                                    Profile
                                </p>

                            </Link>


                            {/* Edit Profile */}

                            <Link to={`/edit-profile`}>

                                <p className="
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    hover:bg-green-50
                                    hover:text-green-600
                                    cursor-pointer
                                    transition
                                ">
                                    Edit Profile
                                </p>

                            </Link>


                            {/* Settings */}

                            <Link to={"/setting"}>

                                <p className="
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    hover:bg-green-50
                                    hover:text-green-600
                                    cursor-pointer
                                    transition
                                ">
                                    Setting
                                </p>

                            </Link>


                            {/* Divider */}

                            <div className="
                                border-t
                                border-gray-100
                                my-1
                            "></div>


                            {/* Logout */}

                            <p
                                onClick={handleLogout}
                                className="
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-red-500
                                    hover:bg-red-50
                                    cursor-pointer
                                    transition
                                "
                            >
                                Log out
                            </p>

                        </div>

                    ) : (

                        ""
                    )
                }

            </div>


            <Outlet />

        </>
    );
}

export default Navbar;