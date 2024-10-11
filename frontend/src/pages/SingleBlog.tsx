import { useNavigate, useParams } from 'react-router-dom';
import { BlogCard, NavBar } from '../components';
import { useEffect, useState } from 'react';
import { typeBlog } from '../types/typeBlog';
import axios from 'axios';
import { baseURL } from '../init';
import { CardLoaderSingle } from '../components';


function useSingleBlog({id}:{id: string}){
    const [loading,setLoading] = useState(true);
    const [blog,setBlog] = useState<typeBlog>();

    useEffect(()=>{
        async function fetchBlog() {
            try {
                const { data } = await axios.get(`${baseURL}/post/${id}`, {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
                });
                setBlog(data.post);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchBlog();
    },[]);


    return {loading,blog};
}

const BlogDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    if(!id){
       navigate('/blog');
       return <div>Invalid ID</div>
    }

    const {loading,blog} = useSingleBlog({id});

    if(loading){
        return (
            <div>
                <NavBar name="Abhay Singh" />
                <CardLoaderSingle/>
            </div>
        )
    }

    if(!blog){
        navigate('/blog');
        return <div>Invalid ID</div>
    }

    return (
        <div>
            <NavBar name="Abhay Singh" />
            <div className="p-6 space-y-4 max-w-screen-lg mx-auto flex flex-col md:flex-row-reverse gap-4 md:gap-12 md:items-start">
                <div className='border border-gray-300 p-4 flex-1'>
                    <p className='font-bold text-gray-400'>About the Author</p>
                    <p className="capitalize font-bold text-lg md:text-xl">{blog.author.name}</p>
                    <p className='text-sm font-semibold'>{blog.author.email}</p>
                </div>
                <div className='space-y-3 max-w-[600px] w-[90%] md:w-[60%]'>
                    <h2 className="text-4xl capitalize font-bold">{blog.title}</h2>
                    <p className='font-semibold text-gray-500'>Posted on {new Date(blog.createdAt).toLocaleString()}</p>
                    <p className="">{blog.content}</p>
                </div>
            </div>
        </div>
    )
};

export default BlogDetail;
