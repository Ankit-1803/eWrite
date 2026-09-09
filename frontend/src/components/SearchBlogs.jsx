
import { useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import DisplayBlogs from "./DisplayBlogs"
import usePagination from "../hooks/usePagination"

function SearchBlogs() {

    const [searchParams] = useSearchParams()
    const {tag} = useParams()
    
    const [page, setPage] = useState(1)
    const q = searchParams.get("q")
    
    const [prevQuery, setPrevQuery] = useState(tag || q)
    const currentQuery = tag || q
    if (prevQuery !== currentQuery) {
        setPrevQuery(currentQuery)
        setPage(1)
    }

    const query = tag ?
        {tag: tag.toLowerCase().replace(" ","-")} :
        {search: q}

    // Send searchQuery to backend by usePagination hook
    const {blogs, hasMore, error} = usePagination("search-blogs", query, 2, page)

    
    return (
        <div className="w-full min-h-[calc(100vh-55px)] bg-gradient-to-br from-green-50/40 via-white to-gray-50">

            <div className="w-full sm:w-[85%] md:w-[70%] lg:w-[65%] xl:w-[60%] mx-auto px-4 sm:px-6 py-8 sm:py-10">

                {/* ================= SEARCH HEADER ================= */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_35px_rgba(0,0,0,0.06)] overflow-hidden mb-7">

                    <div className="relative px-6 sm:px-8 py-7 overflow-hidden">

                        {/* Decorative background */}
                        <div className="absolute -right-10 -top-16 w-40 h-40 rounded-full bg-green-50"></div>

                        <div className="absolute -left-12 -bottom-20 w-36 h-36 rounded-full bg-emerald-50"></div>


                        <div className="relative z-10">

                            {/* Small label */}
                            <div className="flex items-center gap-2 mb-3">

                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                    🔎
                                </div>

                                <p className="text-xs font-bold tracking-[2px] text-green-600 uppercase">
                                    Search Results
                                </p>

                            </div>


                            {/* Heading */}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">

                                Results for{" "}

                                <span className="text-green-600">
                                    "{tag ? tag : q}"
                                </span>

                            </h1>


                            <p className="text-sm text-gray-500 mt-2">
                                Discover stories and ideas from the eWrite community.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================= RESULTS ================= */}
                {
                    blogs.length > 0 ? (

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">

                            {/* Results label */}
                            <div className="flex items-center justify-between mb-5">

                                <div className="flex items-center gap-2">

                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>

                                    <p className="text-sm font-semibold text-gray-700">
                                        Latest matches
                                    </p>

                                </div>

                                <span className="text-xs text-gray-400">
                                    Explore & read
                                </span>

                            </div>


                            <DisplayBlogs blogs={blogs}/>

                        </div>

                    ) : (

                        /* ================= EMPTY STATE ================= */
                        !error && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">

                                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 text-3xl">
                                    🔍
                                </div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    No blogs found
                                </h2>

                                <p className="text-sm text-gray-500 mt-2">
                                    Try searching with a different keyword.
                                </p>

                            </div>
                        )

                    )
                }


                {/* ================= ERROR ================= */}
                {
                    error && (
                        <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-8 text-center">

                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-2xl">
                                ⚠️
                            </div>

                            <h2 className="text-lg font-bold text-gray-800">
                                No results found
                            </h2>

                            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                                {error}
                            </p>

                            <p className="text-xs text-gray-400 mt-3">
                                Try changing your search keyword.
                            </p>

                        </div>
                    )
                }


                {/* ================= LOAD MORE ================= */}
                {
                    hasMore && (
                        <div className="flex justify-center mt-7">

                            <button
                                onClick={() => setPage((prev) => prev + 1)}
                                className="px-7 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-sm hover:shadow-lg hover:shadow-green-200 hover:from-green-600 hover:to-emerald-600 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 cursor-pointer"
                            >
                                Load more
                            </button>

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default SearchBlogs