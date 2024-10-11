import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Signout(){
    const navigate = useNavigate();
    useEffect(()=>{
        localStorage.removeItem('token');
        navigate('/signin');
    });

    return (
        <div className="w-screen h-screen bg-black p-8 text-white">
            <p className="font-bold text-2xl lg:text-3xl">You have Successfully Logged Out.</p>
            <NavLink to="/signin" className="font-bold underline">Click here to go to Login Page</NavLink>
        </div>
    )
}