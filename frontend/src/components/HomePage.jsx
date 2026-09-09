import { useState } from "react";

import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";
import { Link } from "react-router-dom";

function HomePage() {

    const [page, setPage] = useState(1)

    // Fetch Blog data from backend by a hook( usePagination )
    const {blogs, hasMore} = usePagination("blogs", {}, 2, page)

    return (
        <div className="
            w-full
            lg:w-[65%]
            mx-auto
            pl-5
            flex
            bg-gradient-to-br
            from-white
            via-white
            to-emerald-50/40
        ">

            {/* =====================================================
                LEFT / MAIN BLOG SECTION
            ====================================================== */}

            <div className="
                w-full
                md:w-[65%]
                pr-5
                md:pr-10
            ">


                {/* ================= HERO SECTION ================= */}

                <div className="
                    mt-6
                    mb-7
                    relative
                    overflow-hidden
                    rounded-3xl
                    bg-gradient-to-r
                    from-emerald-50
                    via-green-50
                    to-white
                    border
                    border-green-100
                    px-6
                    py-7
                    shadow-sm
                ">

                    {/* Decorative circles */}

                    <div className="
                        absolute
                        -right-12
                        -top-14
                        w-40
                        h-40
                        rounded-full
                        bg-green-200/40
                    "></div>

                    <div className="
                        absolute
                        -left-10
                        -bottom-16
                        w-32
                        h-32
                        rounded-full
                        bg-emerald-200/30
                    "></div>


                    {/* Decorative leaves */}

                    <div className="
                        absolute
                        right-5
                        bottom-2
                        text-5xl
                        opacity-30
                        rotate-[-15deg]
                    ">
                        🌿
                    </div>


                    <div className="
                        relative
                        z-10
                    ">

                        <p className="
                            text-xs
                            font-extrabold
                            tracking-[3px]
                            text-green-600
                            mb-2
                        ">
                            GOOD IDEAS LIVE FOREVER
                        </p>


                        <h1 className="
                            text-3xl
                            font-extrabold
                            text-gray-900
                            leading-tight
                        ">
                            Discover Stories
                            <br />
                            That{" "}
                            <span className="text-green-600">
                                Inspire
                            </span>
                        </h1>


                        <p className="
                            text-sm
                            text-gray-500
                            mt-3
                            max-w-[390px]
                            leading-6
                        ">
                            Read, learn, share, and grow with
                            a community of curious minds.
                        </p>


                        {/* Small decorative line */}

                        <div className="
                            mt-4
                            w-12
                            h-1
                            rounded-full
                            bg-green-500
                        "></div>

                    </div>

                </div>



                {/* ================= LATEST STORIES HEADER ================= */}

                <div className="
                    mb-5
                    flex
                    items-end
                    justify-between
                    gap-3
                ">

                    <div>

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <span className="
                                w-1.5
                                h-7
                                rounded-full
                                bg-gradient-to-b
                                from-green-500
                                to-emerald-600
                            "></span>


                            <h1 className="
                                text-2xl
                                font-extrabold
                                text-gray-900
                                tracking-tight
                            ">
                                Latest Stories
                            </h1>

                        </div>


                        <p className="
                            text-sm
                            text-gray-500
                            ml-4
                            mt-1
                        ">
                            Handpicked stories from our community.
                        </p>

                    </div>


                    {/* Small visual badge */}

                    <div className="
                        hidden
                        sm:flex
                        items-center
                        gap-2
                        bg-green-50
                        border
                        border-green-100
                        px-3
                        py-1.5
                        rounded-full
                    ">

                        <span className="
                            w-2
                            h-2
                            rounded-full
                            bg-green-500
                        "></span>

                        <span className="
                            text-xs
                            font-semibold
                            text-green-700
                        ">
                            Fresh reads
                        </span>

                    </div>

                </div>



                {/* ================= BLOGS ================= */}

                {
                    blogs.length > 0 &&
                    <DisplayBlogs blogs={blogs}/>
                }



                {/* ================= LOAD MORE ================= */}

                {
                    hasMore && 
                    <div className="
                        flex
                        justify-center
                        py-8
                    ">

                        <button 
                            onClick={() => setPage((prev) => prev+1)}
                            className="
                                bg-gradient-to-r
                                from-green-500
                                to-emerald-600
                                py-3
                                px-8
                                text-white
                                font-bold
                                rounded-full
                                cursor-pointer
                                shadow-lg
                                shadow-green-200
                                hover:shadow-xl
                                hover:shadow-green-200
                                hover:-translate-y-1
                                active:translate-y-0
                                transition-all
                                duration-200
                            "
                        >

                            <span className="
                                mr-2
                                text-lg
                            ">
                                ↓
                            </span>

                            Load more

                        </button>

                    </div>
                }

            </div>



            {/* =====================================================
                RIGHT SIDEBAR
            ====================================================== */}

            <div className="
                hidden
                md:block
                w-[30%]
                border-l
                border-gray-200
                pl-7
                min-h-[calc(100vh_-_45px)]
            ">

                <div className="
                    mt-6
                    sticky
                    top-5
                ">


                    {/* =================================================
                        RECOMMENDED TOPICS
                    ================================================= */}

                    <div className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        p-5
                        shadow-[0_8px_30px_rgba(0,0,0,0.05)]
                        relative
                        overflow-hidden
                    ">


                        {/* Decorative dots */}

                        <div className="
                            absolute
                            right-4
                            bottom-4
                            opacity-30
                            text-green-300
                            text-xl
                            tracking-widest
                        ">
                            •••
                            <br />
                            •••
                        </div>


                        {/* Heading */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            mb-1
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <div className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-green-50
                                    flex
                                    items-center
                                    justify-center
                                    text-lg
                                ">
                                    🔥
                                </div>


                                <h1 className="
                                    text-xl
                                    font-extrabold
                                    text-gray-900
                                    leading-tight
                                ">
                                    Recommended
                                    <br />
                                    Topics
                                </h1>

                            </div>

                        </div>


                        <p className="
                            text-xs
                            text-gray-500
                            ml-11
                            mb-5
                        ">
                            Explore trending topics on eWrite
                        </p>



                        {/* Topics */}

                        <div className="
                            flex
                            flex-wrap
                        ">

                            {
                                [
                                    "mern",
                                    "dsa",
                                    "blogs",
                                    "javascript"
                                ]?.map(
                                    (tag, index) => (

                                        <Link
                                            to={`/tag/${tag}`}
                                            key={index}
                                        >

                                            <div
                                                className="
                                                    bg-gray-100
                                                    text-gray-700
                                                    rounded-full
                                                    m-1
                                                    px-4
                                                    py-2
                                                    flex
                                                    justify-center
                                                    items-center
                                                    cursor-pointer
                                                    border
                                                    border-transparent
                                                    hover:text-green-700
                                                    hover:bg-green-50
                                                    hover:border-green-200
                                                    hover:-translate-y-0.5
                                                    transition-all
                                                    duration-200
                                                "
                                            >

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                    whitespace-nowrap
                                                ">
                                                    {tag}
                                                </p>

                                            </div>

                                        </Link>

                                    )
                                )
                            }

                        </div>


                    </div>



                    {/* =================================================
                        START WRITING CARD
                    ================================================= */}

                    <div className="
                        mt-5
                        rounded-2xl
                        border
                        border-green-100
                        bg-gradient-to-br
                        from-green-50
                        via-emerald-50
                        to-green-100/60
                        p-5
                        relative
                        overflow-hidden
                        shadow-sm
                    ">


                        {/* Decorative circle */}

                        <div className="
                            absolute
                            -right-10
                            -top-10
                            w-28
                            h-28
                            rounded-full
                            bg-green-200/50
                        "></div>


                        <div className="
                            absolute
                            right-2
                            bottom-1
                            text-4xl
                            opacity-20
                        ">
                            ✎
                        </div>


                        <div className="
                            relative
                            z-10
                        ">


                            <div className="
                                flex
                                items-center
                                gap-2
                                mb-3
                            ">

                                <div className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-white
                                    shadow-sm
                                    flex
                                    items-center
                                    justify-center
                                    text-lg
                                ">
                                    ✍️
                                </div>


                                <h2 className="
                                    font-extrabold
                                    text-gray-900
                                ">
                                    Start Writing
                                </h2>

                            </div>


                            <p className="
                                text-sm
                                text-gray-600
                                leading-5
                                mb-4
                            ">
                                Have an idea? Turn your thoughts
                                into a story and share it with
                                the world.
                            </p>


                            {/* IMPORTANT:
                                No Link added here because your
                                original code did not provide a
                                writing route.
                            */}

                            <div className="
                                w-full
                                bg-gradient-to-r
                                from-green-500
                                to-emerald-600
                                text-white
                                py-2.5
                                rounded-xl
                                font-bold
                                text-center
                                shadow-md
                                shadow-green-200
                            ">
                               <Link to={"/add-blog"}>
                                    ✎ &nbsp; Start Writing
                               </Link>
                            </div>

                        </div>

                    </div>



                </div>

            </div>

        </div>
        
    )
}

export default HomePage;