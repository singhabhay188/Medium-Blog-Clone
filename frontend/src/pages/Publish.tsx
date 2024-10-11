import { useState } from "react";
import { NavBar } from "../components";
import axios from "axios";
import { baseURL } from "../init";
import { useNavigate } from "react-router-dom";

export default function Publish(){
    const [blogInputs,setBlogInputs] = useState({ title: '', content: '' });
    const navigate = useNavigate();

    function handleChange(e) {
        setBlogInputs(prev => {
            return {
                ...prev,
                [e.target.id]: e.target.value,
            };
        });
    }
    
    async function handleSumbit(e){
        e.preventDefault();

        console.log('publishing...')

        try{
            let url = `${baseURL}/post`;

            let response = await axios.post(url,blogInputs,{
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });

            if(response.data.success){
                alert('Blog published successfully');
                navigate('/blog');
            }
            else{
                alert('An Error Occured while Publishing.');
            }
        }
        catch(e){
            alert('An Error Occured while Publishing.');
            console.log(e);
        }
        finally{
            console.log('publishing process finished..');
        }

    }

    return (
        <div>
            <NavBar name="Abhay Singh"/>

            <div className="py-8 max-w-screen-lg mx-auto w-[90%]">
                <form onSubmit={handleSumbit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title for Blog</label>
                        <input type="text" id="title" name="title" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"  required onChange={handleChange} value={blogInputs.title}/>
                    </div>
                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
                    <textarea id="content" name="content" rows={4} className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..." required minLength={20} onChange={handleChange}>{blogInputs.content}</textarea>

                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Publish Blog</button>
                </form>
            </div>
        </div>
    )
}