import styles from './LoginPage.module.css';
import React, { useContext, useState } from 'react';
import { Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import UserContext from "../Context/User/UserContext";
import AuthContext from "../Context/Auth/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { setUser, setIsUserLoggedIn, setUserType,userType } = useContext(UserContext);
    const [snackBarError, setSnackBarError] = useState(false);
    const closeSnackBarError = () => setSnackBarError(false);
    const openSnackBarError = () => setSnackBarError(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const loginData = await login(data.email, data.password);
            setUserType(loginData.role);
            const userResponse = await axios.get(`/auth/me`);
            setUser(userResponse.data);
            setIsUserLoggedIn(true);
            navigate('/landingPage');
        } catch (error) {
            openSnackBarError();
        }
    };

    return (
        <div className={styles.login}>
            <div className={styles.container}>
                <h2 className={styles.title}>Bejelentkezés</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.inputs}>
                        <div className={styles.inputWrapper}>
                            <input
                                placeholder="Email"
                                className={styles.email}
                                {...register("email", {
                                    required: "Az email kötelező!",
                                    minLength: {
                                        value: 2,
                                        message: "A felhasználó név legalább 2 karakter hosszú kell legyen!"
                                    }
                                })}
                            />
                            {errors.email && <div className={styles.error}>{errors.email.message}</div>}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                placeholder="Jelszó"
                                type="password"
                                className={styles.password}
                                {...register("password", {
                                    required: "Jelszó kötelező!",
                                    minLength: {
                                        value: 2,
                                        message: "A jelszó legalább 2 karakter hosszú kell legyen!"
                                    }
                                })}
                            />
                            {errors.password && <div className={styles.error}>{errors.password.message}</div>}
                        </div>
                        <div className={styles.buttons}>
                            <Button
                                className={styles.closeButton}
                                variant="contained"
                                onClick={() => navigate("/landingPage")}
                            >
                                Bezárás
                            </Button>
                            <Button
                                className={styles.sendButton}
                                variant="contained"
                                type="submit"
                            >
                                Bejelentkezés
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <Snackbar
                open={snackBarError}
                autoHideDuration={6000}
                onClose={closeSnackBarError}
                message="Sikertelen bejelentkezés! Hibás felhasználó név vagy jelszó!"
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#d32f2f',
                        fontSize: '0.875rem',
                    }
                }}
            />
        </div>
    );
}

export default LoginPage;