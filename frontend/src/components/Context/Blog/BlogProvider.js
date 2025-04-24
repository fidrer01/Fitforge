import React, {useState} from 'react';
import BlogContext from './BlogContext';
import axios from "axios";
const BlogProvider = ({ children }) => {

    const [blogs, setBlogs] = useState([]);
    const fetchBlogs = async () => {
        try {
            const response = await axios.get("/blog/");
            setBlogs(response.data);
        }catch(err){
            console.log("Error fetching programs"+err);
        }
    }
    return (
        <BlogContext.Provider value={{blogs, setBlogs,fetchBlogs}}>
            {children}
        </BlogContext.Provider>
    );
};

export default BlogProvider;
