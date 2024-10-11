import { useEffect} from "react";
import { NavBar,BlogCard } from "../components";
import useBlog from "../hooks/useBlog";
import CardLoader from "../components/CardLoader";


export default function Blog() {
    
    useEffect(() => {
        let token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/signin';
        }
    }, []);
    
    const {loading,blogs} = useBlog();

    if(loading){
        return (
            <div>
                <NavBar name="Abhay Singh" />
                <CardLoader/>
                <CardLoader/>
                <CardLoader/>
            </div>
        )
    }
    return (
        <div>
            <NavBar name="Abhay Singh" />
            <div className="p-6 space-y-4 max-w-[600px] mx-auto">
                {blogs.map((blog,ind) => {
                    return <BlogCard id={blog.id} key={ind} title={blog.title} content={blog.content} authorName={blog.author?.name || "Anonymous"} publishedDate={blog.createdAt} />
                })}
            </div>
        </div>
    )
}