import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function usePagination(path, queryParams = {}, limit = 2, page = 1) {
    const [blogs, setBlogs] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");

    const queryKey = JSON.stringify(queryParams);
    const currentTarget = `${path}|${queryKey}`;
    const [prevTarget, setPrevTarget] = useState(currentTarget);

    if (prevTarget !== currentTarget) {
        setPrevTarget(currentTarget);
        setBlogs([]);
        setHasMore(true);
        setError("");
    }

    useEffect(() => {
        let isMounted = true;
        async function fetchBlogs() {
            try {
                setError("");
                const parsedParams = JSON.parse(queryKey);
                let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${path}`, {
                    params: {
                        ...parsedParams,
                        limit,
                        page,
                    },
                });

                if (isMounted) {
                    const fetchedBlogs = res.data?.blogs || [];
                    setBlogs((prev) => (page === 1 ? fetchedBlogs : [...prev, ...fetchedBlogs]));
                    setHasMore(Boolean(res.data?.hasMore));
                }
            } catch (err) {
                if (isMounted) {
                    if (page === 1) {
                        setBlogs([]);
                    }
                    setHasMore(false);
                    const msg = err.response?.data?.message || "";
                    if (msg) {
                        setError(msg);
                        toast.error(msg);
                    }
                }
            }
        }
        fetchBlogs();
        return () => {
            isMounted = false;
        };
    }, [path, queryKey, limit, page]);

    return { blogs, hasMore, error };
}

export default usePagination;