import styles from "../EditTraining/EditTraining.module.css";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, useForm } from "react-hook-form";
import { Select, Snackbar, TextField, Button, MenuItem } from "@mui/material";
import React, { useContext, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import ProgramContext from "../../../Context/Program/ProgramContext";

function EditTraining({ program, close }) {
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
    } = useForm({
        defaultValues: {
            date: dayjs(program.startTime),
            startTime: dayjs(program.startTime),
            endTime: dayjs(program.endTime),
            price: program.price,
            capacity: program.capacity,
            programType: program.programType
        }
    });

    const onSubmit = async (data) => {
        const editedData = {
            trainerId: program.trainer.id,
            startTime: formatDateTime(data.date.$d, data.startTime.$d),
            endTime: formatDateTime(data.date.$d, data.endTime.$d),
            price: data.price,
            capacity: data.capacity,
            programType: data.programType.toUpperCase()
        };

        try {
            await axios.put(`/program/${program.id}`, editedData);
            openSuccessSnackBar();
        } catch (error) {
            console.error("Error updating training:", error);
            openErrorSnackBar();
        }
        reset();
        await fetchPrograms();
        setTimeout(close, 2000);
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
                            render={({ field }) => (
                                <DatePicker label="Nap" {...field} />
                            )}
                        />
                        <Controller
                            name="startTime"
                            control={control}
                            render={({ field }) => (
                                <TimePicker label="Kezdete" {...field} />
                            )}
                        />
                        <Controller
                            name="endTime"
                            control={control}
                            render={({ field }) => (
                                <TimePicker label="Vége" {...field} />
                            )}
                        />
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    className={styles.textFields}
                                    label="Ár"
                                    type="number"
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="capacity"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    className={styles.textFields}
                                    label="Max létszám"
                                    type="number"
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="programType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    className={styles.textFields}
                                    aria-label="Program Típus"
                                    {...field}
                                >
                                    {programTypes.map((type, key) => (
                                        <MenuItem key={key} value={type.toUpperCase()}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <Button type="submit" variant="contained" className={styles.submitButton}>
                            Módosítás
                        </Button>
                    </div>
                </form>
            </LocalizationProvider>
            <Snackbar
                open={successSnackBar}
                autoHideDuration={6000}
                onClose={closeSuccessSnackBar}
                message="Sikeresen módosítás!"
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: 'green',
                    }
                }}
            />
            <Snackbar
                open={errorSnackBar}
                autoHideDuration={6000}
                onClose={closeErrorSnackBar}
                message="Sikertelen módosítás!"
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: 'red',
                    }
                }}
            />
        </div>
    );
}

export default EditTraining;