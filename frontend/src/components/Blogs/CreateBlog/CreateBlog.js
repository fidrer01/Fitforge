import styles from './CreateBlog.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { Select, Snackbar, TextField, MenuItem, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Textarea } from '@mui/joy';
import UserContext from '../../Context/User/UserContext';
import BlogContext from '../../Context/Blog/BlogContext';

function CreateBlog({ close }) {
    const { user } = useContext(UserContext);
    const { fetchBlogs } = useContext(BlogContext);
    const [successSnackBar, setSuccessSnackBar] = useState(false);
    const [errorSnackBar, setErrorSnackBar] = useState(false);

    const closeSuccessSnackBar = () => setSuccessSnackBar(false);
    const openSuccessSnackBar = () => setSuccessSnackBar(true);
    const closeErrorSnackBar = () => setErrorSnackBar(false);
    const openErrorSnackBar = () => setErrorSnackBar(true);

    const {
        register,
        reset,
        handleSubmit,
        control,
    } = useForm();

    const onSubmit = async (data) => {
        const formattedData = {
            trainerId: user.id,
            title: data.title,
            headerText: data.headerText,
            mainText: data.mainText,
            blogType: data.blogType,
        };

        try {
            const response = await axios.post('/blog/', formattedData);
            await savePictureToBlog(response, data.file[0]);
            reset();
            await fetchBlogs();
            openSuccessSnackBar();
            setTimeout(close, 2000);
        } catch (error) {
            console.error('Error creating blog:', error);
            openErrorSnackBar();
        }
    };

    const savePictureToBlog = async (response, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            await axios.post(`/blog/upload-image/${response.data.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (e) {
            console.error('Error uploading picture:', e);
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
                    <h1 className={styles.title}>Új Blogbejegyzés</h1>
                    <CloseIcon className={styles.closeIcon} onClick={close} />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formSection}>
                        <Controller
                            name="title"
                            control={control}
                            defaultValue=""
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
                            defaultValue="DIET"
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
                        defaultValue=""
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
                        defaultValue=""
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
                    <div className={styles.fileSection}>
                        <input
                            type="file"
                            {...register('file', { required: 'Kötelező képet feltölteni' })}
                            className={styles.fileInput}
                        />
                        {control._formState.errors.file && (
                            <span className={styles.error}>{control._formState.errors.file.message}</span>
                        )}
                    </div>
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
                            Létrehozás
                        </Button>
                    </div>
                </form>
                <Snackbar
                    open={successSnackBar}
                    autoHideDuration={6000}
                    onClose={closeSuccessSnackBar}
                    message="Sikeresen létrehozva!"
                    sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#2e7d32' } }}
                />
                <Snackbar
                    open={errorSnackBar}
                    autoHideDuration={6000}
                    onClose={closeErrorSnackBar}
                    message="Hiba történt a létrehozás során!"
                    sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#d32f2f' } }}
                />
            </div>
        </div>
    );
}

export default CreateBlog;