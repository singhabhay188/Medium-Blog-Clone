import axios from "axios";
import { useEffect, useState } from "react";
import { baseURL } from "../init";
import { typeBlog } from "../types/typeBlog";


export default function useBlog() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<typeBlog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
        try {
            const { data } = await axios.get(`${baseURL}/post/all`, {
            headers: {
                authorization: localStorage.getItem("token"),
            },
            });
            setBlogs(data.posts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    fetchBlogs();
  }, []);

  return { loading, blogs };
}
