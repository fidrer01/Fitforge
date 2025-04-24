import styles from './TrainerForm.module.css';
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import axios from "axios";
import React from "react";

function TrainerForm({ openSnackBarError }) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const getQualificationTranslation = (qualification) => {
        switch (qualification) {
            case "Personal Trainer": return "Személyi edző";
            case "Fitness Instructor": return "Fitnesz oktató";
            case "Pilates Instructor": return "Pilates oktató";
            case "Crossfit Coach": return "Crossfit edző";
            case "TRX Trainer": return "TRX edző";
            case "Pound Trainer": return "Pound edző";
            case "Other": return "Egyéb";
            default: return qualification;
        }
    };

    const onSubmit = async (data) => {
        try {
            qualificationToEnum(data);
            const formattedData = {
                name: data.name.trim(),
                birthDate: data.birthDate,
                gender: data.gender,
                qualification: data.qualification,
                phoneNumber: data.phoneNumber,
                email: data.email,
                password: data.password
            };
            const response = await axios.post('/auth/registerTrainer', formattedData);
            await savePictureToTrainer(response, data.file[0]);
            navigate('/login');
        } catch (error) {
            console.error("Form submission error:", error);
            openSnackBarError();
        }
    };

    const savePictureToTrainer = async (response, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            await axios.put(`/trainer/upload-picture/${response.data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (e) {
            console.error("Error updating training:", e);
        }
    };

    const qualificationToEnum = (data) => {
        let qualSplitted = data.qualification.toUpperCase().split(" ");
        if (qualSplitted.length > 1) {
            data.qualification = qualSplitted.join("_");
        } else {
            data.qualification = data.qualification.toUpperCase();
        }
    };

    const qualifications = [
        "Personal Trainer",
        "Fitness Instructor",
        "Pilates Instructor",
        "Crossfit Coach",
        "TRX Trainer",
        "Pound Trainer",
        "Other"
    ];

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
                                maxLength: {
                                    value: 50,
                                    message: "A név legfeljebb 50 karakter hosszú lehet!"
                                }
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
                                }
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
                            render={({ field: { onChange, value } }) => (
                                <PhoneInput
                                    value={value}
                                    onChange={onChange}
                                    country="hu"
                                    className={styles.phone}
                                    inputStyle={{ width: '100%' }}
                                    inputProps={{ maxLength: 15 }}
                                />
                            )}
                        />
                        {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber.message}</span>}
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
                        <label>Foglalkozás:</label>
                        <select
                            className={styles.input}
                            {...register("qualification", { required: "Válasszon egy foglalkozást!" })}
                        >
                            <option value="">Válasszon...</option>
                            {qualifications.map((qualification, index) => (
                                <option value={qualification} key={index}>
                                    {getQualificationTranslation(qualification)}
                                </option>
                            ))}
                        </select>
                        {errors.qualification && <span className={styles.error}>{errors.qualification.message}</span>}
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
                                    {...register("gender", { required: "Válasszon egy nemet!" })}
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

                    <div className={styles.inputWrapper}>
                        <label>Kép:</label>
                        <input
                            type="file"
                            className={styles.fileInput}
                            {...register("file", { required: "A kép feltöltése kötelező!" })}
                        />
                        {errors.file && <span className={styles.error}>{errors.file.message}</span>}
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

export default TrainerForm;