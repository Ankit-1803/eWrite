import { useState } from "react";

function Input({type, placeholder, setUserData, field, value, icon}) {

    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="relative w-full flex items-center">
            <i className={"fi " + icon + " absolute top-1/2 -translate-y-1/2 left-2 mt-1 text-2xl opacity-50"}></i>
            
            <input 
                type={type != "password" ? 
                    type :
                    (showPassword ? "text" : "password")
                } 
                value={value}
                className="w-full h-[35px] focus:outline-none hover:cursor-pointer text-xl pl-10 p-5 rounded-full border bg-white text-black"
                placeholder={placeholder}
                onChange={(e)=> setUserData(prev => ({...prev, [field]: e.target.value}))}
            />
            {
               type == "password" && (
                    <i 
                        onClick={() => setShowPassword((prev) => !prev)}
                        className={`fi ${showPassword ? " fi-rr-eye " : " fi-rr-eye-crossed "} absolute top-1/2 -translate-y-1/2 right-2 mt-1 text-2xl opacity-50 cursor-pointer`}>
                    </i>
                )
            }
        </div>
    )
}
export default Input;