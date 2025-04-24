import styles from './CreateTraining.module.css';
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Select, TextField, Snackbar, MenuItem } from "@mui/material";
import React, { useContext, useState } from "react";
import UserContext from "../../../Context/User/UserContext";
import axios from "axios";
import ProgramContext from "../../../Context/Program/ProgramContext";

function CreateTraining({ close }) {
    const { user } = useContext(UserContext);
    const { fetchPrograms } = useContext(ProgramContext);
    const [successSnackBar, setSuccessSnackBar] = useState(false);
    const [errorSnackBar, setErrorSnackBar] = useState(false);

    const closeSuccessSnackBar = () => setSuccessSnackBar(false);
    const openSuccessSnackBar = () => setSuccessSnackBar(true);
    const closeErrorSnackBar = () => setErrorSnackBar(false);
    const openErrorSnackBar = () => setErrorSnackBar(true);

    const {
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const formattedData = {
            trainerId: user.id,
            startTime: formatDateTime(data.date.$d, data.startTime.$d),
            endTime: formatDateTime(data.date.$d, data.endTime.$d),
            price: data.price,
            capacity: data.capacity,
            programType: data.programType.toUpperCase(),
        };

        try {
            await axios.post('/program/', formattedData);
            reset();
            await fetchPrograms();
            openSuccessSnackBar();
            setTimeout(close, 2000);
        } catch (error) {
            console.error("Error creating training:", error);
            openErrorSnackBar();
        }
    };

    const formatDateTime = (dateString, timeString) => {
        const date = new Date(dateString);
        const time = new Date(timeString);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const programTypes = ["Strength_Training", "B_Fit", "Pilates", "Crossfit", "TRX", "Functional_Training", "Spinning"];

    return (
        <div className={styles.container}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.inputs}>
                        <Controller
                            name="date"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "A dátum megadása kötelező!" }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <DatePicker
                                        label="Nap"
                                        {...field}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                    {error && <span className={styles.error}>{error.message}</span>}
                                </>
                            )}
                        />
                        <Controller
                            name="startTime"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "A kezdés idő megadása kötelező!" }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <TimePicker
                                        label="Kezdete"
                                        {...field}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                    {error && <span className={styles.error}>{error.message}</span>}
                                </>
                            )}
                        />
                        <Controller
                            name="endTime"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "A program végének ideje megadása kötelező!" }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <TimePicker
                                        label="Vége"
                                        {...field}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                    {error && <span className={styles.error}>{error.message}</span>}
                                </>
                            )}
                        />
                        <Controller
                            name="price"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "Az ár megadása kötelező!" }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <TextField
                                        className={styles.textFields}
                                        label="Ár"
                                        type="number"
                                        size="small"
                                        {...field}
                                    />
                                    {error && <span className={styles.error}>{error.message}</span>}
                                </>
                            )}
                        />
                        <Controller
                            name="capacity"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "A létszám megadása kötelező" }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <TextField
                                        className={styles.textFields}
                                        label="Max létszám"
                                        type="number"
                                        size="small"
                                        {...field}
                                    />
                                    {error && <span className={styles.error}>{error.message}</span>}
                                </>
                            )}
                        />
                        <Controller
                            name="programType"
                            control={control}
                            defaultValue="TRX"
                            rules={{ required: "A program típus megadása kötelező!" }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Select
                                        className={styles.textFields}
                                        aria-label="Program Típus"
                                        size="small"
                                        {...field}
                                    >
                                        {programTypes.map((type, key) => (
                                            <MenuItem key={key} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {error && <span className={styles.error}>{error.message}</span>}
                                </>
                            )}
                        />
                        <Button type="submit" variant="contained" size="small" className={styles.submitButton}>
                            Létrehozás
                        </Button>
                    </div>
                </form>
            </LocalizationProvider>
            <Snackbar
                open={successSnackBar}
                autoHideDuration={6000}
                onClose={closeSuccessSnackBar}
                message="Sikeresen létrehozás!"
                sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'green' } }}
            />
            <Snackbar
                open={errorSnackBar}
                autoHideDuration={6000}
                onClose={closeErrorSnackBar}
                message="Sikertelen létrehozás!"
                sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'red' } }}
            />
        </div>
    );
}

export default CreateTraining;