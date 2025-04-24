import styles from './OpenedBlog.module.css';
import { useParams, Navigate, useNavigate } from "react-router";
import Navbar from "../../Navbar/Navbar";
import { Divider, Card, CardOverflow, AspectRatio, CardContent, Typography } from "@mui/joy";
import { useContext } from "react";
import BlogContext from "../../Context/Blog/BlogContext";

function OpenedBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { blogs } = useContext(BlogContext);


    const blog = blogs.find(b => b.id === Number(id));

    if (!blog) {
        return <Navigate to="/blogs" replace />;
    }

    const imageUrl = `/blog/image/${blog.id}` || '' ;

    return (
        <div className={styles.openedBlog} style={{ minHeight: "100vh" }}>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.blogTitle}>{blog.title}</h1>
                <div className={styles.blogText}>
                    <div className={styles.textContent}>{blog.headerText}</div>
                    <div className={styles.kep}>
                        <img
                            src={imageUrl}
                            alt="Blog Image"
                        />
                    </div>
                </div>
                <div className={styles.blogText}>
                    {blog.mainText}
                </div>
            </div>
            <Divider />
            <div className={styles.moreBlogs}>
                <h1 className={styles.moreBlogsTitle}>Hasonló blogok</h1>
                <div className={styles.blogGrid}>
                    {blogs.length > 1 ? (
                        blogs.map((moreBlog) => {
                            if (moreBlog.id !== blog.id) {
                                const moreBlogImage =  `/blog/image/${moreBlog.id}` || ' ' ;
                                return (
                                    <div key={moreBlog.id} className={styles.blog}>
                                        <Card variant="outlined" className={styles.card}>
                                            <CardOverflow onClick={() => navigate(`/openedBlog/${moreBlog.id}`)}>
                                                <AspectRatio ratio="16/9">
                                                    <img
                                                        src={moreBlogImage}
                                                        loading="lazy"
                                                        alt={moreBlog.title}
                                                    />
                                                </AspectRatio>
                                            </CardOverflow>
                                            <CardContent onClick={() => navigate(`/openedBlog/${moreBlog.id}`)}>
                                                <Typography className={styles.cardTitle}>
                                                    {moreBlog.title}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <p className={styles.noMoreBlogs}>Nincsenek további blogok</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OpenedBlog;