import styles from './EditBlog.module.css';
import React, { useContext, useState } from 'react';
import BlogContext from '../../Context/Blog/BlogContext';
import { Controller, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { Select, Snackbar, TextField, MenuItem, Button } from '@mui/material';
import { Textarea } from '@mui/joy';
import axios from 'axios';

function EditBlog({ blog, close }) {
    const { fetchBlogs } = useContext(BlogContext);
    const [successSnackBar, setSuccessSnackBar] = useState(false);
    const [errorSnackBar, setErrorSnackBar] = useState(false);

    const closeSuccessSnackBar = () => setSuccessSnackBar(false);
    const openSuccessSnackBar = () => setSuccessSnackBar(true);
    const closeErrorSnackBar = () => setErrorSnackBar(false);
    const openErrorSnackBar = () => setErrorSnackBar(true);

    const { reset, handleSubmit, control } = useForm({
        defaultValues: {
            title: blog.title,
            headerText: blog.headerText,
            mainText: blog.mainText,
            blogType: blog.blogType,
        },
    });

    const onSubmit = async (data) => {
        const formattedData = {
            trainerId: blog.trainer.id,
            title: data.title,
            headerText: data.headerText,
            mainText: data.mainText,
            blogType: data.blogType,
            image: 'Images/edzesTervKep1.jpg',
        };

        try {
            await axios.put(`/blog/${blog.id}`, formattedData);
            reset();
            await fetchBlogs();
            openSuccessSnackBar();
            setTimeout(close, 2000);
        } catch (error) {
            openErrorSnackBar();
            setTimeout(close, 2000);
        }
    };

    const blogTypes = [
        { value: 'TRAINING', label: 'Edzés' },
        { value: 'DIET', label: 'Diéta' },
    ];

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Blog Módosítása</h1>
                    <CloseIcon className={styles.closeIcon} onClick={close} />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formSection}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'A cím megadása kötelező!' }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    label="Cím"
                                    variant="outlined"
                                    fullWidth
                                    className={styles.input}
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="blogType"
                            control={control}
                            rules={{ required: 'A blog típus megadása kötelező!' }}
                            render={({ field, fieldState: { error } }) => (
                                <Select
                                    variant="outlined"
                                    fullWidth
                                    className={styles.input}
                                    {...field}
                                    error={!!error}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (!selected) return <em>Típus kiválasztása</em>;
                                        return blogTypes.find(type => type.value === selected)?.label;
                                    }}
                                >
                                    {blogTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>
                    <Controller
                        name="headerText"
                        control={control}
                        rules={{ required: 'A bevezetés szöveg megadása kötelező!' }}
                        render={({ field, fieldState: { error } }) => (
                            <Textarea
                                minRows={4}
                                placeholder="Bevezetés szövege"
                                variant="outlined"
                                className={styles.textarea}
                                {...field}
                                error={!!error}
                                sx={{ borderColor: error ? '#d32f2f' : undefined }}
                            />
                        )}
                    />
                    {control._formState.errors.headerText && (
                        <span className={styles.error}>{control._formState.errors.headerText.message}</span>
                    )}
                    <Controller
                        name="mainText"
                        control={control}
                        rules={{ required: 'A tárgyalás szövegének megadása kötelező!' }}
                        render={({ field, fieldState: { error } }) => (
                            <Textarea
                                minRows={6}
                                placeholder="Fő szöveg"
                                variant="outlined"
                                className={styles.textarea}
                                {...field}
                                error={!!error}
                                sx={{ borderColor: error ? '#d32f2f' : undefined }}
                            />
                        )}
                    />
                    {control._formState.errors.mainText && (
                        <span className={styles.error}>{control._formState.errors.mainText.message}</span>
                    )}
                    <div className={styles.actions}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={close}
                            className={styles.cancelButton}
                        >
                            Mégse
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={styles.submitButton}
                        >
                            Módosítás
                        </Button>
                    </div>
                </form>
                <Snackbar
                    open={successSnackBar}
                    autoHideDuration={6000}
                    onClose={closeSuccessSnackBar}
                    message="Sikeresen módosítva!"
                    sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#2e7d32' } }}
                />
                <Snackbar
                    open={errorSnackBar}
                    autoHideDuration={6000}
                    onClose={closeErrorSnackBar}
                    message="Hiba történt a módosítás során!"
                    sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#d32f2f' } }}
                />
            </div>
        </div>
    );
}

export default EditBlog;