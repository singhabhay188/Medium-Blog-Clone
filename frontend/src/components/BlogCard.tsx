import { useNavigate } from "react-router-dom";

type BlogCardProps = {
    id: string
    title: string,
    content: string,
    authorName: string,
    publishedDate: string
}

export default function BlogCard({ id, title, content, authorName, publishedDate }: BlogCardProps) {
    const navigate = useNavigate();
    return (
        <div className="bg-gray-100 p-4 my-4 space-y-4 cursor-pointer" onClick={()=>{ navigate(`/blog/${id}`) }}>
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center font-bold text-xl text-white uppercase">{authorName[0]}</div>
                &#x2022;
                <p className="capitalize font-bold text-lg">{authorName}</p>
                &#x2022;
                {/* <p>{new Date(publishedDate).toString().split(' ').splice(0, 4).join(' ')}</p> */}
                <p>{new Date(publishedDate).toDateString()}</p>
            </div>
            <h2 className="md:text-2xl text-xl font-bold">{title}</h2>
            <p className="text-gray-500">{`${content.substring(0, 100)} ${content.length > 100 ? '...' : ''}`}</p>

        </div>
    );
}