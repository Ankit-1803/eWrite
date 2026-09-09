import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function VerifyUser() {
    const { verificationToken } = useParams();
    const navigate = useNavigate();
    const hasRequested = useRef(false);
    const [statusMessage, setStatusMessage] = useState("Verifying your email, please wait...");

    useEffect(() => {
        if (!verificationToken || hasRequested.current) return;
        hasRequested.current = true;

        async function verifyUser() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/verify-email/${verificationToken}`
                );
                toast.success(res.data.message || "Email verified successfully");
                setStatusMessage("Email verified! Redirecting to sign in...");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Email verification failed. The link may be expired or invalid.";
                toast.error(message);
                setStatusMessage(message);
            } finally {
                setTimeout(() => {
                    navigate("/signin");
                }, 1500);
            }
        }

        verifyUser();
    }, [verificationToken, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
            <h1 className="text-2xl font-semibold mb-2">Email Verification</h1>
            <p className="text-gray-600 dark:text-gray-300 text-center">{statusMessage}</p>
        </div>
    );
}

export default VerifyUser;