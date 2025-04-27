import styles from './Client.module.css';
import { Grid } from '@mui/joy';
import { Divider, Button, Snackbar, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/User/UserContext";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProgramContext from "../../Context/Program/ProgramContext";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Rating from '@mui/material/Rating';

function Client() {
    const { user, isUserLoggedIn } = useContext(UserContext);
    const { programs } = useContext(ProgramContext);
    const [snackBarSuccess, setSnackBarSuccess] = useState(false);
    const [snackBarError, setSnackBarError] = useState(false);
    const [registeredPrograms, setRegisteredPrograms] = useState({});
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [participatedPrograms, setParticipatedPrograms] = useState({});

    const closeSnackBarSuccess = () => setSnackBarSuccess(false);
    const openSnackBarSuccess = () => setSnackBarSuccess(true);
    const closeSnackBarError = () => setSnackBarError(false);
    const openSnackBarError = () => setSnackBarError(true);

    const getWeekDays = (startDate) => {
        const days = [];
        const start = new Date(startDate);
        const dayOfWeek = start.getDay();
        const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        start.setDate(start.getDate() + offset);
        start.setHours(0, 0, 0, 0);
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const [weekDays, setWeekDays] = useState(getWeekDays(currentWeekStart));

    const handlePrevWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
        setWeekDays(getWeekDays(newStart));
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
        setWeekDays(getWeekDays(newStart));
    };

    const formatDate = (date) => {
        const options = { weekday: 'long' };
        const dayName = new Intl.DateTimeFormat('hu-HU', options).format(date);
        return dayName.charAt(0).toUpperCase() + dayName.slice(1);
    };

    const filteredPrograms = programs.filter(program => {
        const programDate = new Date(program.startTime);
        programDate.setHours(0, 0, 0, 0);
        const weekStart = new Date(weekDays[0]);
        const weekEnd = new Date(weekDays[6]);
        const isInWeek = programDate >= weekStart && programDate <= weekEnd;
        return isInWeek;
    });

    const groupedPrograms = filteredPrograms.reduce((acc, program) => {
        const programDate = new Date(program.startTime);
        programDate.setHours(0, 0, 0, 0);
        const day = formatDate(programDate);
        if (!acc[day]) acc[day] = [];
        acc[day].push(program);
        return acc;
    }, {});


    const getTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleUserRegistrationToProgram = async (program) => {
        try {
            await axios.post(`/program/${program.id}/clients/${user.id}`);
            setRegisteredPrograms(prev => ({ ...prev, [program.id]: true }));
            openSnackBarSuccess();
        } catch (error) {
            console.log(error)
            openSnackBarError();
        }
    };

    const handleUserCancellationToProgram = async (program) => {
        try {
            await axios.delete(`/program/${program.id}/clients/${user.id}`);
            setRegisteredPrograms(prev => ({ ...prev, [program.id]: false }));
            openSnackBarSuccess();
        } catch (error) {
            openSnackBarError();
        }
    };



    const handleRatingSubmit = async (trainerId, score) => {
        try {
            if (score > 0) {
                await axios.post(`/trainer/${trainerId}/rating`, { score });
                openSnackBarSuccess();
            }
        } catch (error) {
            openSnackBarError();
        }
    };

    const handleApplication = (isLoggedIn, program) => {
        if (!isLoggedIn || !user) return null;
        const programId = program.id;
        const isRegistered = registeredPrograms[programId] || false;
        const hasParticipated = participatedPrograms[programId] || false;

        if (program.status === "UPCOMING") {
            if (!isRegistered) {
                return (
                    <Button variant='contained' size="small" onClick={() => handleUserRegistrationToProgram(program)}>
                        Jelentkezés
                    </Button>
                );
            } else {
                return (
                    <Button variant='outlined' color='error' size="small" onClick={() => handleUserCancellationToProgram(program)}>
                        Lemondás
                    </Button>
                );
            }
        } else if (program.status === "COMPLETED" && hasParticipated) {
            return (
                <Rating
                    name={`rating-${programId}`}
                    defaultValue={0}
                    onChange={(event, newValue) => {
                        if (newValue) handleRatingSubmit(program.trainer.id, newValue);
                    }}
                    size="small"
                />
            );
        }
        return null;
    };

    const handleStatus = (status) => {
        let color, statusText;
        switch (status) {
            case "UPCOMING": color = 'green'; statusText = 'Közelgő'; break;
            case "ONGOING": color = 'orange'; statusText = 'Folyamatban lévő'; break;
            case "COMPLETED": color = 'red'; statusText = 'Befejezett'; break;
            default: return null;
        }
        return (
            <>
                <MoreVertIcon style={{ color }} />
                <div>{statusText}</div>
            </>
        );
    };

    const handleProgramType = (programType) => {
        switch (programType) {
            case "STRENGTH_TRAINING": return "Erőnléti edzés";
            case "PILATES": return "Pilates edzés";
            case "CROSSFIT": return "Crossfit edzés";
            case "B_FIT": return "B edzés";
            case "SPINNING": return "Spinning edzés";
            case "FUNCTIONAL_TRAINING": return "Funkcionális edzés";
            case "TRX": return "TRX edzés";
            default: return null;
        }
    };

    useEffect(() => {
        const fetchStatuses = async () => {
            if (!isUserLoggedIn || !user || programs.length === 0) return;

            const promises = programs.map(async (program) => {
                const programId = program.id;
                const clientId = user.id;

                if (registeredPrograms[programId] === undefined) {
                    try {
                        const regResponse = await axios.get(`/program/${programId}/clients/${clientId}`);
                        setRegisteredPrograms(prev => ({ ...prev, [programId]: regResponse.data }));
                    } catch (error) {
                        setRegisteredPrograms(prev => ({ ...prev, [programId]: false }));
                    }
                }

                if (program.status === "COMPLETED" && participatedPrograms[programId] === undefined) {
                    try {
                        const partResponse = await axios.get(`/program/${programId}/clients/${clientId}`);
                        setParticipatedPrograms(prev => ({ ...prev, [programId]: partResponse.data }));
                    } catch (error) {
                        setParticipatedPrograms(prev => ({ ...prev, [programId]: false }));
                    }
                }
            });

            await Promise.all(promises);

        };

        fetchStatuses();
    }, [isUserLoggedIn, user, programs]);

    return (
        <div className={styles.calendar}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className={styles.calendarWeek}>
                <IconButton onClick={handlePrevWeek}>
                    <ArrowBackIcon />
                </IconButton>
                <h3>{`${weekDays[0].toLocaleDateString('hu-HU')} - ${weekDays[6].toLocaleDateString('hu-HU')}`}</h3>
                <IconButton onClick={handleNextWeek}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>
            <Grid container rowSpacing={1} spacing={2} columns={{ xs: 1, sm: 2, lg: 7 }}>
                {weekDays.map((date) => {
                    const day = formatDate(date);
                    return (
                        <Grid item xs={1} key={day} className={styles.days}>
                            <div className={styles.program}>
                                <h2>{day}</h2>
                                <Divider color='black' />
                                <div className={styles.programOnDay}>
                                    <p>Programok:</p>
                                    {groupedPrograms[day] ? (
                                        groupedPrograms[day].map((program, index) => (
                                            <div key={index}>
                                                <Divider />
                                                <div className={styles.status}>
                                                    {handleStatus(program.status)}
                                                </div>
                                                <div className={styles.dates}>
                                                    <div><strong>Edzés:</strong> {handleProgramType(program.programType)}</div>
                                                    <div><strong>Edző:</strong> {program.trainer.name}</div>
                                                    <div><strong>Kezdés:</strong> {getTime(program.startTime)}</div>
                                                    <div><strong>Vége:</strong> {getTime(program.endTime)}</div>
                                                    <div><strong>Ár:</strong> {program.price} Ft</div>
                                                </div>
                                                <div className={styles.signUpButton}>
                                                    {handleApplication(isUserLoggedIn, program)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <Divider />
                                            <div>Nincs program</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    );
                })}
            </Grid>
            <Snackbar
                open={snackBarSuccess}
                autoHideDuration={6000}
                onClose={closeSnackBarSuccess}
                message="Sikeres!"
                sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'green' } }}
            />
            <Snackbar
                open={snackBarError}
                autoHideDuration={6000}
                onClose={closeSnackBarError}
                message="Sikertelen próbálkozás!"
                sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'red' } }}
            />
        </div>
    );
}

export default Client;