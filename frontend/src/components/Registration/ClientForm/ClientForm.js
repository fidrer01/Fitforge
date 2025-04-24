import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import styles from "./ClientForm.module.css";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { Button } from "@mui/material";
import axios from "axios";
import React from "react";

function ClientForm({ openSnackBarError }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await axios.post('/auth/registerClient', data);
            navigate('/login');
        } catch (error) {
            console.error("Form submission error:", error);
            openSnackBarError();
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputs}>
                    <div className={styles.inputWrapper}>
                        <label>Teljes név:</label>
                        <input
                            className={styles.input}
                            placeholder="Jhon Do"
                            {...register("name", {
                                required: "A név megadása kötelező!",
                                minLength: {
                                    value: 2,
                                    message: "A név legalább 2 karakter hosszú kell legyen!"
                                },
                                pattern: {
                                    value: /^[A-Za-z]+$/i,
                                    message: "A név csak betűket tartalmazhat!"
                                },
                            })}
                        />
                        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                    </div>

                    <div className={styles.inputWrapper}>
                        <label>Email:</label>
                        <input
                            className={styles.input}
                            placeholder="pelda@gmail.com"
                            type="email"
                            {...register("email", {
                                required: "Az email megadása kötelező!",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Érvénytelen email formátum!"
                                },
                            })}
                        />
                        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                    </div>
                    <div className={styles.inputWrapper}>
                        <label>Telefonszám:</label>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            rules={{
                                required: "A telefonszám megadása kötelező!",
                                pattern: {
                                    value: /^\d{11}$/,
                                    message: "A telefonszám pontosan 11 számjegy kell legyen (pl. 36201234567)!"
                                }
                            }}
                            render={({field: {onChange, value}}) => (
                                <PhoneInput
                                    value={value}
                                    onChange={onChange}
                                    country="hu"
                                    className={styles.phone}
                                    inputStyle={{width: '100%'}}
                                    inputProps={{maxLength: 15}}
                                />
                            )}
                        />
                        {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber.message}</span>}
                        {errors.phone && <span className={styles.error}>{errors.phone.message + "!"}</span>}
                    </div>

                    <div className={styles.inputWrapper}>
                        <label>Születési év:</label>
                        <input
                            className={styles.input}
                            placeholder="Születési év"
                            type="date"
                            {...register("birthDate", {
                                required: "A születési év megadása kötelező!",
                                validate: value => {
                                    const date = new Date(value);
                                    const today = new Date();
                                    return date < today || "A születési dátum nem lehet a jövőben!";
                                }
                            })}
                        />
                        {errors.birthDate && <span className={styles.error}>{errors.birthDate.message}</span>}
                    </div>

                    <div className={styles.inputWrapper}>
                        <label>Jelszó:</label>
                        <input
                            className={styles.input}
                            placeholder="Jelszó"
                            type="password"
                            {...register("password", {
                                required: "A jelszó megadása kötelező!",
                                minLength: {
                                    value: 8,
                                    message: "A jelszó legalább 8 karakter hosszú kell legyen!"
                                }
                            })}
                        />
                        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                    </div>

                    <div className={styles.inputWrapper}>
                        <label>Nem:</label>
                        <div className={styles.formRadio}>
                            <label>
                                <input
                                    type="radio"
                                    value="MALE"
                                    {...register("gender", {required: "Válasszon egy nemet!" })}
                                />
                                Férfi
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="FEMALE"
                                    {...register("gender", { required: "Válasszon egy nemet!" })}
                                />
                                Nő
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="OTHER"
                                    {...register("gender", { required: "Válasszon egy nemet!" })}
                                />
                                Egyéb
                            </label>
                        </div>
                        {errors.gender && <span className={styles.error}>{errors.gender.message}</span>}
                    </div>
                </div>

                <div className={styles.buttons}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => navigate("/landingPage")}
                    >
                        Bezárás
                    </Button>
                    <Button
                        variant="contained"
                        color="info"
                        type="submit"
                    >
                        Regisztrálás
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ClientForm;