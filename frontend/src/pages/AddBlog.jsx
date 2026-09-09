import axios from "axios"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import {  Navigate, useNavigate, useParams } from "react-router-dom"
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import Embed from "@editorjs/embed";
import ImageTool from '@editorjs/image';
import { setIsOpen } from "../utils/commentSlice"
import { removeSelectedBlog } from "../utils/selectedBlogSlice"

function AddBlog() {

    // Id of blog ->  /blog/(((ebug3&fu4ec)))
    const {id} = useParams()
    
    const {token} = useSelector(slice=>slice.user)

    const {title, description, image, content, draft, tags} = useSelector((slice)=>slice.selectedBlog)

    const editorjsRef = useRef(null)
    const hasLoadedBlog = useRef(false)
    const dispatch = useDispatch()

    const [blogData, setBlogData] = useState({
        title: "",
        description: "",
        image: null,
        content: "",
        tags: [],
        draft: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const navigate = useNavigate();
    

    // All data is Send to BACKEND
  
    // Handle post functionality
    async function handlePostBlog() {
        if(isSubmitting) return
        setIsSubmitting(true)

        let editorContent = blogData.content;
        if (editorjsRef.current && typeof editorjsRef.current.save === "function") {
            try {
                editorContent = await editorjsRef.current.save();
            } catch (err) {
                console.error("Editor save error:", err);
            }
        }

        const formData = new FormData()
        formData.append("title" , blogData.title || "")
        formData.append("description" , blogData.description || "")
        if (blogData.image) {
            formData.append("image" , blogData.image)
        }
        formData.append("content" , JSON.stringify(editorContent || { blocks: [] }))
        formData.append("tags" , JSON.stringify(blogData.tags || []))
        formData.append("draft" , blogData.draft ? "true" : "false")

        if (editorContent && Array.isArray(editorContent.blocks)) {
            editorContent.blocks.forEach((block) => {
                if(block.type === "image" && block.data?.file?.image) {
                    formData.append("images" , block.data.file.image)
                }
            })
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(res.data.message)
            navigate("/")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to publish blog")
            setIsSubmitting(false)
        }
    }

    // Handle update functionality
    async function handleUpdateBlog() {
        if(isSubmitting) return
        setIsSubmitting(true)

        let editorContent = blogData.content;
        if (editorjsRef.current && typeof editorjsRef.current.save === "function") {
            try {
                editorContent = await editorjsRef.current.save();
            } catch (err) {
                console.error("Editor save error:", err);
            }
        }

        const formData = new FormData();
        formData.append("title" , blogData.title || "")
        formData.append("description" , blogData.description || "")
        if (blogData.image) {
            formData.append("image" , blogData.image)
        }
        formData.append("content", JSON.stringify(editorContent || { blocks: [] }))
        formData.append("tags" , JSON.stringify(blogData.tags || []))
        formData.append("draft" , blogData.draft ? "true" : "false")

        let existingImages = [];
        if (editorContent && Array.isArray(editorContent.blocks)) {
            editorContent.blocks.forEach((block) => {
                if(block.type === "image") {
                    if(block.data?.file?.image) {
                        formData.append("images" , block.data.file.image)
                    }
                    else if(block.data?.file?.url) {
                        existingImages.push({
                            url: block.data.file.url,
                            imageId: block.data.file.imageId,
                        })
                    }
                }
            })
        }

        formData.append("existingImages", JSON.stringify(existingImages));

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            })
            toast.success(res.data.message)
            navigate("/")
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong while updating blog")
            setIsSubmitting(false)
        }
    }

    // Tag delete function
    function deleteTag(index) {
        const updatedTags = (blogData?.tags || []).filter(
            (_, tagIndex) => tagIndex !== index
        )
        setBlogData((prev) => ({...prev, tags: updatedTags}))
    }

    // Key down handler for tags
    function handleKeyDown(e) {
        const tag = e?.target?.value?.trim().toLowerCase()

        if(e?.code === "Space") e.preventDefault()

        if(e?.code === "Enter") {
            e.preventDefault()
            if(!tag) return

            // check tags limit
            if((blogData?.tags?.length || 0) >= 10) {
                e.target.value = ""
                return toast.error("You can add only 10 tags")
            }

            // check repetition of tags
            if(blogData?.tags?.includes(tag)) {
                e.target.value = ""
                return toast.error("This tag is already added, please try another tag")
            }

            setBlogData((prev) => ({...prev, tags: [...(prev?.tags || []), tag]}))
            e.target.value = ""
        }
    }

    useEffect(() => {
        if (!id || hasLoadedBlog.current) return;
        let isMounted = true;

        async function loadBlog() {
            if (title) {
                hasLoadedBlog.current = true;
                setBlogData({
                    title: title || "",
                    description: description || "",
                    image: image || null,
                    content: content || { blocks: [] },
                    tags: tags || [],
                    draft: draft || false
                });
            } else {
                try {
                    const { data: { blog } } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/${id}`);
                    if (!isMounted) return;
                    hasLoadedBlog.current = true;
                    setBlogData({
                        title: blog?.title || "",
                        description: blog?.description || "",
                        image: blog?.image || null,
                        content: blog?.content || { blocks: [] },
                        tags: blog?.tags || [],
                        draft: blog?.draft || false
                    });
                    if (editorjsRef.current && typeof editorjsRef.current.render === "function" && blog?.content?.blocks) {
                        editorjsRef.current.isReady?.then(() => {
                            editorjsRef.current.render(blog.content);
                        }).catch(() => {});
                    }
                } catch (err) {
                    toast.error(err?.response?.data?.message || "Failed to load blog for editing");
                }
            }
        }

        loadBlog();

        return () => {
            isMounted = false;
        };
    }, [id, title, description, image, content, tags, draft]);

    const initialContentRef = useRef(content);

    useEffect(() => {
        if(!token) {
            return;
        }

        if(editorjsRef.current == null) {
            const initialEditorData = id ? (initialContentRef.current && initialContentRef.current.blocks ? initialContentRef.current : { blocks: [] }) : { blocks: [] };
            editorjsRef.current = new EditorJS({
                holder: "editorjs",
                placeholder: "Write Something...",
                data: initialEditorData,
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: "Enter a header...",
                            levels: [2,3,4],
                            defaultLevel: 3,
                        }
                    },
                    List: {
                        class: List,
                        inlineToolbar: true,
                    },
                    code: CodeTool,
                    Marker: Marker,
                    Underline: Underline,
                    Embed: Embed,
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                uploadByFile: async (image) => {
                                    return {
                                        success: 1,
                                        file: {
                                            url: URL.createObjectURL(image),
                                            image,
                                        }
                                    };
                                }
                            }
                        }
                    },
                },
                onChange: async () => {
                    let data = await editorjsRef.current.save()
                    setBlogData((prev) => ({...prev, content: data}));
                }
            })
        }
        return () => {
            if(editorjsRef.current && typeof editorjsRef.current.destroy === "function") {
                editorjsRef.current.destroy()
                editorjsRef.current = null
            }

            dispatch(setIsOpen(false))

            if(window.location.pathname !== `/edit/${id}` && window.location.pathname !== `/blog/${id}`) {
                dispatch(removeSelectedBlog())
            }
        }
    }, [token, dispatch, id])


    return !token ? (
    <Navigate to={"/signin"}/>
) : (

    <div className="
        min-h-[calc(100vh-45px)]
        w-full
        bg-gradient-to-br
        from-white
        via-emerald-50/30
        to-green-50/60
        px-4
        py-8
        sm:px-6
        lg:px-8
    ">

        {/* =========================================================
            MAIN ADD BLOG CONTAINER
        ========================================================== */}

        <div className="
            w-full
            sm:w-[400px]
            lg:w-[1050px]
            mx-auto
            bg-white
            rounded-3xl
            overflow-hidden
            border
            border-gray-100
            shadow-[0_20px_70px_rgba(15,23,42,0.10)]
            lg:flex
        ">


            {/* =====================================================
                LEFT INTRODUCTION PANEL
            ====================================================== */}

            <div className="
                hidden
                lg:flex
                lg:w-[310px]
                shrink-0
                bg-gradient-to-br
                from-emerald-50
                via-green-50
                to-white
                relative
                overflow-hidden
                flex-col
                justify-between
                p-8
            ">


                {/* Decorative circles */}

                <div className="
                    absolute
                    -left-24
                    -bottom-24
                    w-64
                    h-64
                    rounded-full
                    bg-emerald-200/40
                "></div>

                <div className="
                    absolute
                    -right-20
                    top-28
                    w-44
                    h-44
                    rounded-full
                    bg-green-100/70
                "></div>


                {/* Decorative leaves */}

                <div className="
                    absolute
                    left-3
                    top-28
                    text-3xl
                    opacity-30
                    rotate-[-25deg]
                ">
                    🌿
                </div>

                <div className="
                    absolute
                    right-5
                    bottom-24
                    text-4xl
                    opacity-30
                    rotate-[15deg]
                ">
                    🌿
                </div>



                {/* =================================================
                    INTRO TEXT
                ================================================== */}

                <div className="
                    relative
                    z-10
                ">

                    {/* Icon */}

                    <div className="
                        w-16
                        h-16
                        rounded-2xl
                        bg-emerald-100
                        flex
                        items-center
                        justify-center
                        shadow-sm
                        mb-6
                    ">

                        <i className="
                            fi
                            fi-rr-edit
                            text-3xl
                            text-emerald-600
                        "></i>

                    </div>


                    <p className="
                        text-xs
                        font-extrabold
                        tracking-[3px]
                        text-emerald-600
                        mb-3
                    ">
                        CREATE • SHARE • INSPIRE
                    </p>


                    <h1 className="
                        text-4xl
                        font-extrabold
                        text-gray-900
                        leading-[1.08]
                    ">

                        Share Your

                        <br />

                        <span className="
                            text-emerald-600
                        ">
                            Knowledge
                        </span>

                    </h1>


                    <p className="
                        mt-5
                        text-sm
                        text-gray-500
                        leading-6
                        max-w-[235px]
                    ">
                        Write, share and inspire.
                        Your ideas can make a difference
                        in someone's journey.
                    </p>


                    {/* Small line */}

                    <div className="
                        mt-6
                        w-12
                        h-1
                        rounded-full
                        bg-emerald-500
                    "></div>

                </div>



                {/* =================================================
                    WRITING ILLUSTRATION
                ================================================== */}

                <div className="
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                    mt-8
                ">


                    {/* Idea bubble */}

                    <div className="
                        absolute
                        right-0
                        top-0
                        bg-white/80
                        border
                        border-emerald-100
                        rounded-2xl
                        px-4
                        py-3
                        shadow-sm
                        rotate-[-3deg]
                    ">

                        <p className="
                            text-xs
                            font-semibold
                            text-emerald-600
                            leading-5
                        ">
                            Good
                            <br />
                            Ideas
                            <br />
                            Grow
                            <br />
                            Here
                        </p>

                    </div>



                    {/* Person */}

                    <div className="
                        text-[105px]
                        leading-none
                        mt-5
                    ">
                        🧑‍💻
                    </div>


                    {/* Books */}

                    <div className="
                        flex
                        flex-col
                        items-center
                        -mt-2
                    ">

                        <div className="
                            w-52
                            h-5
                            rounded-md
                            bg-emerald-700
                            shadow-sm
                        "></div>

                        <div className="
                            w-44
                            h-5
                            rounded-md
                            bg-emerald-400
                            mt-1
                            shadow-sm
                        "></div>

                        <div className="
                            w-52
                            h-5
                            rounded-md
                            bg-green-800
                            mt-1
                            shadow-sm
                        "></div>

                    </div>



                    {/* Plant */}

                    <div className="
                        absolute
                        right-2
                        bottom-2
                        text-5xl
                    ">
                        🪴
                    </div>


                    {/* Bottom text */}

                    <p className="
                        mt-5
                        text-xs
                        italic
                        text-gray-400
                    ">
                        Every great idea starts with a thought.
                    </p>

                </div>

            </div>



            {/* =====================================================
                RIGHT FORM SECTION
            ====================================================== */}

            <div className="
                flex-1
                p-5
                sm:p-7
                lg:p-8
                min-w-0
            ">


                {/* =================================================
                    TOP ROW
                ================================================== */}

                <div className="
                    lg:flex
                    lg:gap-8
                ">


                    {/* =================================================
                        IMAGE FIELD
                    ================================================== */}

                    <div className="
                        lg:w-1/2
                        min-w-0
                    ">

                        <div className="
                            flex
                            items-start
                            gap-3
                            mb-3
                        ">

                            <div className="
                                w-9
                                h-9
                                shrink-0
                                rounded-xl
                                bg-emerald-50
                                flex
                                items-center
                                justify-center
                            ">

                                <i className="
                                    fi
                                    fi-rr-picture
                                    text-lg
                                    text-emerald-600
                                "></i>

                            </div>


                            <div>

                                <h2 className="
                                    text-base
                                    font-extrabold
                                    text-gray-900
                                ">
                                    Image
                                </h2>

                                <p className="
                                    text-xs
                                    text-gray-400
                                    mt-0.5
                                ">
                                    Choose a cover image for your blog
                                </p>

                            </div>

                        </div>


                        <label htmlFor="image">

                            {
                                blogData.image ? (

                                    <div className="
                                        relative
                                        w-2/3
                                        h-[190px]
                                        rounded-2xl
                                        overflow-hidden
                                        border
                                        border-emerald-100
                                        bg-emerald-50
                                        cursor-pointer
                                        group
                                    ">

                                        <img
                                            src={
                                                typeof(blogData.image) === "string"
                                                ? blogData.image
                                                : URL.createObjectURL(blogData.image)
                                            }
                                            className="
                                                w-full
                                                h-full
                                                object-cover
                                                transition-transform
                                                duration-300
                                                group-hover:scale-[1.02]
                                            "
                                            alt="Blog Image"
                                        />

                                        <div className="
                                            absolute
                                            inset-0
                                            bg-black/0
                                            group-hover:bg-black/10
                                            transition-all
                                        "></div>

                                    </div>

                                ) : (

                                    <div className="
                                        w-full
                                        h-[190px]
                                        rounded-2xl
                                        border-2
                                        border-dashed
                                        border-gray-200
                                        bg-gray-50/70
                                        flex
                                        flex-col
                                        justify-center
                                        items-center
                                        cursor-pointer
                                        hover:border-emerald-300
                                        hover:bg-emerald-50/50
                                        transition-all
                                        duration-200
                                    ">

                                        <div className="
                                            w-14
                                            h-14
                                            rounded-2xl
                                            bg-white
                                            border
                                            border-gray-100
                                            shadow-sm
                                            flex
                                            items-center
                                            justify-center
                                            mb-3
                                        ">

                                            <i className="
                                                fi
                                                fi-rr-picture
                                                text-2xl
                                                text-gray-400
                                            "></i>

                                        </div>


                                        <p className="
                                            text-sm
                                            font-bold
                                            text-gray-700
                                        ">
                                            Select Image
                                        </p>


                                        <p className="
                                            text-xs
                                            text-gray-400
                                            mt-1
                                        ">
                                            Click to upload or drag and drop
                                        </p>


                                        <p className="
                                            text-[10px]
                                            text-gray-400
                                            mt-1
                                        ">
                                            PNG, JPG, JPEG
                                        </p>

                                    </div>

                                )
                            }

                        </label>


                        <input
                            className="hidden"
                            id="image"
                            type="file"
                            accept=".png, .jpeg, .jpg"
                            onChange={(e)=>setBlogData((blogData)=>({
                                ...blogData,
                                image: e.target.files[0]
                            }))}
                        />

                    </div>



                    {/* =================================================
                        TITLE + TAGS
                    ================================================== */}

                    <div className="
                        lg:w-1/2
                        min-w-0
                        mt-6
                        lg:mt-0
                    ">


                        {/* TITLE */}

                        <div className="mb-6">

                            <div className="
                                flex
                                items-start
                                gap-3
                                mb-3
                            ">

                                <div className="
                                    w-9
                                    h-9
                                    shrink-0
                                    rounded-xl
                                    bg-emerald-50
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <i className="
                                        fi
                                        fi-rr-heading
                                        text-lg
                                        text-emerald-600
                                    "></i>

                                </div>


                                <div>

                                    <h2 className="
                                        text-base
                                        font-extrabold
                                        text-gray-900
                                    ">
                                        Title
                                    </h2>

                                    <p className="
                                        text-xs
                                        text-gray-400
                                        mt-0.5
                                    ">
                                        Give your blog a catchy title
                                    </p>

                                </div>

                            </div>


                            <input
                                id="title"
                                type="text"
                                placeholder="Enter Title Here..."
                                onChange={(e)=>setBlogData((blogData)=>({
                                    ...blogData,
                                    title: e.target.value
                                }))}
                                value={blogData.title}
                                className="
                                    w-full
                                    h-[48px]
                                    border
                                    border-gray-200
                                    bg-gray-50/70
                                    rounded-xl
                                    px-4
                                    text-sm
                                    text-gray-800
                                    placeholder:text-gray-400
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-emerald-100
                                    focus:border-emerald-400
                                    focus:bg-white
                                    transition-all
                                "
                            />

                        </div>



                        {/* TAGS */}

                        <div>

                            <div className="
                                flex
                                items-start
                                gap-3
                                mb-3
                            ">

                                <div className="
                                    w-9
                                    h-9
                                    shrink-0
                                    rounded-xl
                                    bg-emerald-50
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <span className="
                                        text-xl
                                        font-bold
                                        text-emerald-600
                                    ">
                                        #
                                    </span>

                                </div>


                                <div>

                                    <h2 className="
                                        text-base
                                        font-extrabold
                                        text-gray-900
                                    ">
                                        Tags
                                    </h2>

                                    <p className="
                                        text-xs
                                        text-gray-400
                                        mt-0.5
                                    ">
                                        Add relevant tags to help others find your blog
                                    </p>

                                </div>

                            </div>


                            <input
                                type="text"
                                placeholder="Enter Tags Here..."
                                className="
                                    w-full
                                    h-[48px]
                                    border
                                    border-gray-200
                                    bg-gray-50/70
                                    rounded-xl
                                    px-4
                                    text-sm
                                    text-gray-800
                                    placeholder:text-gray-400
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-emerald-100
                                    focus:border-emerald-400
                                    focus:bg-white
                                    transition-all
                                "
                                onKeyDown={handleKeyDown}
                            />


                            <div className="
                                flex
                                justify-between
                                gap-3
                                mt-2
                                px-1
                            ">

                                <p className="
                                    text-[11px]
                                    text-gray-400
                                ">
                                    *Click on Enter to add tag
                                </p>

                                <p className="
                                    text-[11px]
                                    text-gray-400
                                ">
                                    {10 - blogData?.tags.length} tags remaining
                                </p>

                            </div>


                            {/* Selected Tags */}

                            <div className="
                                flex
                                flex-wrap
                                mt-2
                            ">

                                {
                                    blogData?.tags?.map((tag, index) => (

                                        <div
                                            key={index}
                                            className="
                                                bg-emerald-50
                                                text-emerald-700
                                                border
                                                border-emerald-100
                                                rounded-full
                                                m-1
                                                px-3
                                                py-1.5
                                                gap-2
                                                flex
                                                justify-center
                                                items-center
                                            "
                                        >

                                            <p className="
                                                text-xs
                                                font-semibold
                                            ">
                                                #{tag}
                                            </p>


                                            <i
                                                onClick={() => deleteTag(index)}
                                                className="
                                                    fi
                                                    fi-sr-cross-circle
                                                    mt-0.5
                                                    text-sm
                                                    cursor-pointer
                                                    text-emerald-500
                                                    hover:text-red-500
                                                    transition-colors
                                                "
                                            ></i>

                                        </div>

                                    ))
                                }

                            </div>

                        </div>

                    </div>

                </div>



                {/* =====================================================
                    DESCRIPTION
                ====================================================== */}

                <div className="
                    mt-7
                ">

                    <div className="
                        flex
                        items-start
                        gap-3
                        mb-3
                    ">

                        <div className="
                            w-9
                            h-9
                            shrink-0
                            rounded-xl
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                        ">

                            <i className="
                                fi
                                fi-rr-document
                                text-lg
                                text-emerald-600
                            "></i>

                        </div>


                        <div>

                            <h2 className="
                                text-base
                                font-extrabold
                                text-gray-900
                            ">
                                Description
                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-0.5
                            ">
                                Write a short description about your blog
                            </p>

                        </div>

                    </div>


                    <textarea
                        type="text"
                        value={blogData.description}
                        placeholder="Enter Description Here..."
                        className="
                            resize-none
                            h-[105px]
                            w-full
                            border
                            border-gray-200
                            bg-gray-50/70
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            text-gray-800
                            placeholder:text-gray-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-100
                            focus:border-emerald-400
                            focus:bg-white
                            transition-all
                        "
                        onChange={(e)=>setBlogData((blogData)=>({
                            ...blogData,
                            description: e.target.value
                        }))}
                    />

                </div>



                {/* =====================================================
                    DRAFT
                ====================================================== */}

                <div className="
                    mt-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-3
                    ">

                        <div className="
                            w-9
                            h-9
                            rounded-xl
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                        ">

                            <i className="
                                fi
                                fi-rr-document
                                text-lg
                                text-emerald-600
                            "></i>

                        </div>


                        <div>

                            <h2 className="
                                text-base
                                font-extrabold
                                text-gray-900
                            ">
                                Draft
                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-0.5
                            ">
                                Save as a draft or publish directly
                            </p>

                        </div>

                    </div>


                    <select
                        name=""
                        id=""
                        value={blogData.draft}
                        className="
                            w-full
                            sm:w-[200px]
                            h-[46px]
                            border
                            border-gray-200
                            bg-gray-50/70
                            rounded-xl
                            px-4
                            text-sm
                            text-gray-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-100
                            focus:border-emerald-400
                            cursor-pointer
                        "
                        onChange={(e) => setBlogData((prev) => ({
                            ...prev,
                            draft: e.target.value == "true"
                                ? true
                                : false
                        }))}
                    >

                        <option value="true">
                            Save as Draft
                        </option>

                        <option value="false">
                            Publish
                        </option>

                    </select>

                </div>



                {/* =====================================================
                    CONTENT
                ====================================================== */}

                <div className="
                    mt-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-3
                    ">

                        <div className="
                            w-9
                            h-9
                            rounded-xl
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                        ">

                            <i className="
                                fi
                                fi-rr-edit
                                text-lg
                                text-emerald-600
                            "></i>

                        </div>


                        <div>

                            <h2 className="
                                text-base
                                font-extrabold
                                text-gray-900
                            ">
                                Content
                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-0.5
                            ">
                                Start writing your blog content
                            </p>

                        </div>

                    </div>


                    {/* EditorJS */}

                    <div className="
                        w-full
                        min-h-[100px]
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50/50
                        px-4
                        py-3
                        focus-within:border-emerald-300
                        focus-within:ring-2
                        focus-within:ring-emerald-50
                        transition-all
                    ">

                        <div
                            className="
                                w-full
                            "
                            id="editorjs"
                        ></div>

                    </div>

                </div>



                {/* =====================================================
                    BOTTOM ACTION
                ====================================================== */}

                <div className="
                    flex
                    justify-end
                    mt-7
                    pt-5
                    border-t
                    border-gray-100"
                >

                   <button
                        disabled={isSubmitting}
                        className={`
                            min-h-[50px]
                            px-7
                            rounded-full
                            border
                            font-bold
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition-all
                            duration-200

                            ${
                                isSubmitting
                                    ? `
                                        bg-gray-400
                                        border-gray-400
                                        cursor-not-allowed
                                        shadow-none
                                    `
                                    : `
                                        border-emerald-500
                                        bg-gradient-to-r
                                        from-emerald-500
                                        to-green-600
                                        shadow-lg
                                        shadow-emerald-100
                                        hover:shadow-xl
                                        hover:shadow-emerald-200
                                        hover:-translate-y-0.5
                                        active:translate-y-0
                                        cursor-pointer
                                    `
                            }
                        `}
                        onClick={
                            id
                                ? handleUpdateBlog
                                : handlePostBlog
                        }
                    >

                        {
                            isSubmitting ? (

                                <>
                                    {/* Loading spinner */}

                                    <span
                                        className="
                                            w-5
                                            h-5
                                            border-2
                                            border-white/40
                                            border-t-white
                                            rounded-full
                                            animate-spin
                                        "
                                    ></span>

                                    <span>
                                        {
                                            id
                                                ? "Updating..."
                                                : blogData.draft
                                                    ? "Saving..."
                                                    : "Publishing..."
                                        }
                                    </span>
                                </>

                            ) : (

                                <>
                                    <i className="fi fi-rr-paper-plane"></i>

                                    {
                                        blogData.draft
                                            ? "Save as draft"
                                            : (
                                                id
                                                    ? "Update Blog"
                                                    : "Post Blog"
                                            )
                                    }
                                </>

                            )
                        }

                    </button>

                </div>

            </div>

        </div>

    </div>
)
}

export default AddBlog;