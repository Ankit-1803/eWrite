import { useEffect } from "react";
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function VerifyUser() {
    const {verificationToken} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function verifyUser() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-email/${verificationToken}`)
                toast.success(res.data.message)
            } 
            catch (error) {
                toast.error(error.response.data.message)
            }
            finally {
                navigate("/signin")
            }
        }
        verifyUser()
    },[verificationToken, navigate])

    return (
        <div>
            <h1>VerifyUser</h1>
        </div>
    )
}

export default VerifyUser;