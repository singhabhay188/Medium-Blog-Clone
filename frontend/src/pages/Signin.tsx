import { useEffect, useState } from "react";
import {Header,Input} from "../components";
import { LogInSchema } from "@singhbetu188/medium-blog-common";
import axios from "axios";
import { baseURL } from "../init";
import { useNavigate } from "react-router-dom";

export default function Signin(){
    const navigate = useNavigate();

    useEffect(()=>{
        let token = localStorage.getItem('token');
        if(token){
            navigate('/blog');
        }
    },[]);

    let [signinInput,setSigninInput] = useState<LogInSchema>({
        email: "",
        password: ""
    });

    async function handleSignIn(e){
        e.preventDefault();
        try{
            let url = `${baseURL}/user/login`;
            console.log(url,signinInput);
            let response = await axios.post(url, signinInput);
            if(response.data.success){
                alert('Sign In Successfull');
                localStorage.setItem('token',response.data.token);
                navigate('/blog');
            }
            else{
                alert(response.data.error);
            }
        }
        catch(e){
            alert('An Error Occured while Sign In.');
            console.log(e);
        }
    }

    return(
        <div className="w-screen h-screen bg-gray-200 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center gap-4">
                <Header first="Create an Account" second="New Here Create Account ?" redirect="SignUp" redirectURL="/signup"/>
                
                <form onSubmit={handleSignIn} className="w-[90%] max-w-[400px]">
                    <Input label="email" placeholder="example@gmail.com" type="email" handler={setSigninInput} value={signinInput.email}/>
                    <Input label="password" placeholder="*********" type="password" handler={setSigninInput} value={signinInput.password}/>
                    <button className="w-full bg-black text-white p-2 rounded-lg font-bold mt-4" type="submit">Login</button>
                </form>
            </div>
            <div className="w-full md:w-1/2 h-full p-8 flex flex-col items-center justify-center gap-5">
                <p className="font-bold text-2xl lg:text-3xl md:text-center">"The customer service I received was exceptional. The support team went above and beyond to address my concerns."</p>
                <p className="font-semibold text-xl">Jules Winnfield</p>
                <p className="text-gray-500">CEO, Acme Inc</p>
            </div>
        </div>
    )
}