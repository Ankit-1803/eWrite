import axios from "axios";
import toast from "react-hot-toast";

export async function handleSaveBlog(id, token, onSuccess) {
    if (!token) {
        toast.error("Please sign in to save this blog");
        return;
    }
    try {
        let res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/save-blog/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(res.data.message);
        if (onSuccess) {
            onSuccess(res.data);
        }
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save blog");
    }
}

export async function handleFollowCreator(id, token, onSuccess) {
    if (!token) {
        toast.error("Please sign in to follow this creator");
        return;
    }
    try {
        let res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/follow/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(res.data.message);
        if (onSuccess) {
            onSuccess(res.data);
        }
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to follow user");
    }
}

export async function handleDeleteBlog(id, token, onSuccess) {
    if (!token) {
        toast.error("Please sign in to delete this blog");
        return false;
    }
    try {
        const res = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/blog/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(res.data?.message || "Blog deleted successfully");
        if (onSuccess) {
            onSuccess(res.data);
        }
        return true;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete blog");
        return false;
    }
}
