import Navbar from '../Navbar/Navbar';
import styles from './Blogs.module.css';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardOverflow,
    Typography,
    AspectRatio,
    Divider,
} from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { Fab, Modal, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserContext from '../Context/User/UserContext';
import BlogContext from '../Context/Blog/BlogContext';
import CreateBlog from './CreateBlog/CreateBlog';
import EditBlog from './EditBlog/EditBlog';
import axios from 'axios';
import Confirmation from '../Confirmation';

function Blogs() {
    const navigate = useNavigate();
    const { userType } = useContext(UserContext);
    const { blogs, fetchBlogs } = useContext(BlogContext);
    const [createBlog, setCreateBlog] = useState(false);
    const [editBlog, setEditBlog] = useState(false);
    const [editedBlog, setEditedBlog] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [blogImages, setBlogImages] = useState({});
    const [snackBarError, setSnackBarError] = useState(false);

    const closeSnackBarError = () => setSnackBarError(false);
    const openSnackBarError = () => setSnackBarError(true);

    const openDeleteModal = (id) => {
        setDeleteModal(true);
        setDeletingId(id);
    };
    const closeDeleteModal = () => setDeleteModal(false);

    const fetchBlogImage = useCallback(
        async (blogId) => {
            if (blogImages[blogId] || blogImages[blogId] === '') return blogImages[blogId];

            try {
                const response = await axios.get(`/blog/image/${blogId}`, {
                    responseType: 'arraybuffer',
                    timeout: 3000,
                });
                const byteArray = new Uint8Array(response.data);
                const blob = new Blob([byteArray], {
                    type: response.headers['content-type'] || 'image/jpeg',
                });
                const imageUrl = URL.createObjectURL(blob);
                setBlogImages((prev) => ({ ...prev, [blogId]: imageUrl }));
                return imageUrl;
            } catch (error) {
                console.error(`Failed to fetch image for blog ${blogId}:`, error);
                setBlogImages((prev) => ({ ...prev, [blogId]: '' }));
                return '';
            }
        },
        [blogImages]
    );

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                await fetchBlogs();
            } catch (e) {
                openSnackBarError();
            }
        };
        loadBlogs();
    }, []);

    useEffect(() => {
        if (blogs.length > 0) {
            const fetchImages = async () => {
                const imagePromises = blogs
                    .filter((blog) => !blogImages[blog.id] && blogImages[blog.id] !== '')
                    .map((blog) => fetchBlogImage(blog.id));
                await Promise.all(imagePromises);
            };
            fetchImages();
        }
    }, [blogs, fetchBlogImage]);

    useEffect(() => {
        return () => {
            Object.values(blogImages).forEach((url) => {
                if (url && url !== '') URL.revokeObjectURL(url);
            });
        };
    }, [blogImages]);

    const blogDelete = async (id) => {
        try {
            await axios.delete(`/blog/${id}`);
            await fetchBlogs();
            setDeleteModal(false);
        } catch (error) {
            openSnackBarError();
        }
    };

    const isUserTypeTrainer = (userType, blog) => {
        if (userType === 'TRAINER') {
            return (
                <div className={styles.trainerButtons}>
                    <EditIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditBlog(true);
                            setEditedBlog(blog);
                        }}
                    />
                    <DeleteIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(blog.id);
                        }}
                    />
                </div>
            );
        }
        return null;
    };

    const handleCreateButton = (userType) => {
        if (userType === 'TRAINER') {
            return (
                <div className={styles.buttons}>
                    <Fab
                        size="medium"
                        className={styles.fabButton}
                        aria-label="add"
                        onClick={() => setCreateBlog(true)}
                    >
                        <AddIcon />
                    </Fab>
                </div>
            );
        }
    };

    const handleBlogType = (blogType) => {
        switch (blogType) {
            case 'TRAINING':
                return 'Edzés';
            case 'DIET':
                return 'Étrend';
            default:
                return null;
        }
    };

    return (
        <div className={styles.blogs}>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Navbar />
            <div className={styles.contentWrapper}>
                <div className={styles.container}>
                    <div className={styles.blogGrid}>
                        {blogs.length > 0 ? (
                            blogs.map((blog, index) => {
                                const imageUrl = blogImages[blog.id] || '';
                                return (
                                    <div key={index} className={styles.cardWrapper}>
                                        <Card variant="outlined" className={styles.card}>
                                            <CardOverflow
                                                onClick={() => {
                                                    console.log('Navigating to /openedBlog/', blog.id);
                                                    navigate(`/openedBlog/${blog.id}`);
                                                }}
                                            >
                                                <AspectRatio ratio="16/9">
                                                    <img
                                                        src={imageUrl}
                                                        alt={blog.title}
                                                        loading="lazy"
                                                    />
                                                </AspectRatio>
                                            </CardOverflow>
                                            <CardContent
                                                onClick={() => {
                                                    console.log('Navigating to /openedBlog/', blog.id);
                                                    navigate(`/openedBlog/${blog.id}`);
                                                }}
                                            >
                                                <Typography className={styles.blogTitle}>
                                                    {blog.title}
                                                </Typography>
                                            </CardContent>
                                            <CardOverflow
                                                variant="soft"
                                                className={styles.cardFooter}
                                            >
                                                <Divider inset="context" />
                                                <CardContent orientation="horizontal">
                                                    <Typography className={styles.blogType}>
                                                        {handleBlogType(blog.blogType)}
                                                    </Typography>
                                                    <Divider orientation="vertical" />
                                                    <Typography className={styles.trainerActions}>
                                                        {isUserTypeTrainer(userType, blog)}
                                                    </Typography>
                                                </CardContent>
                                            </CardOverflow>
                                        </Card>
                                    </div>
                                );
                            })
                        ) : (
                            <Typography level="h1" className={styles.blogError}>
                                Jelenleg egy blog sem elérhető
                            </Typography>
                        )}
                    </div>
                    {handleCreateButton(userType)}
                </div>
            </div>
            <Modal open={createBlog} onClose={() => setCreateBlog(false)}>
                <CreateBlog close={() => setCreateBlog(false)} />
            </Modal>
            <Modal open={editBlog} onClose={() => setEditBlog(false)}>
                <EditBlog close={() => setEditBlog(false)} blog={editedBlog} />
            </Modal>
            <Modal open={deleteModal} onClose={closeDeleteModal}>
                <Confirmation
                    close={closeDeleteModal}
                    deleteFunction={blogDelete}
                    deletingId={deletingId}
                />
            </Modal>
            <Snackbar
                open={snackBarError}
                autoHideDuration={6000}
                onClose={closeSnackBarError}
                message="Sikertelen művelet!"
                sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#d32f2f' } }}
            />
        </div>
    );
}

export default Blogs;