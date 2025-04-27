import styles from './Trainer.module.css';
import { Grid } from '@mui/joy';
import { Divider, Fab, Modal, Snackbar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useContext, useState } from "react";
import CreateTraining from "./CreateTraining/CreatTraining";
import EditTraining from "./EditTraining/EditTraining";
import ProgramContext from "../../Context/Program/ProgramContext";
import axios from "axios";
import UserContext from "../../Context/User/UserContext";
import Confirmation from "../../Confirmation";

function Trainer() {
    const { programs, fetchPrograms } = useContext(ProgramContext);
    const { user, isUserLoggedIn } = useContext(UserContext);
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [openedProgram, setOpenedProgram] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [snackBarError, setSnackBarError] = useState(false);
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
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

    const getProgramTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const openCreateModal = () => setCreateModal(true);
    const closeCreateModal = () => setCreateModal(false);
    const openEditModal = () => setEditModal(true);
    const closeEditModal = () => setEditModal(false);
    const openDeleteModal = (id) => {
        setDeleteModal(true);
        setDeletingId(id);
    };
    const closeDeleteModal = () => setDeleteModal(false);

    const deleteProgram = async (id) => {
        try {
            await axios.delete(`/program/${id}`);
            await fetchPrograms();
            closeDeleteModal();
        } catch (error) {
            openSnackBarError();
        }
    };

    const handleUserLoggedInEditAndDelete = (program) => {
        if (isUserLoggedIn && user.id === program.trainer.id) {
            return (
                <div className={styles.programIcons}>
                    <EditIcon onClick={() => {
                        setOpenedProgram(program);
                        openEditModal();
                    }} />
                    <DeleteIcon onClick={() => openDeleteModal(program.id)} />
                </div>
            );
        }
        return null;
    };

    const handleCreateButton = () => {
        if (isUserLoggedIn) {
            return (
                <Fab size="small" color="info" aria-label="add" onClick={openCreateModal}>
                    <AddIcon />
                </Fab>
            );
        }
        return null;
    };

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
                                    <p>Foglalt időpontok:</p>
                                    {groupedPrograms[day] ? (
                                        groupedPrograms[day].map((program) => (
                                            <div key={program.id}>
                                                <Divider/>
                                                <div>{program.trainer.name || ' '}</div>
                                                <div className={styles.dates}>
                                                    <div>{getProgramTime(program.startTime)} - {getProgramTime(program.endTime)}</div>
                                                    {handleUserLoggedInEditAndDelete(program)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <Divider />
                                            <div className={styles.dates}>Nincs program</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    );
                })}
            </Grid>
            <div className={styles.buttons}>
                {handleCreateButton()}
            </div>
            <Modal open={createModal} onClose={closeCreateModal}>
                <CreateTraining close={closeCreateModal} />
            </Modal>
            <Modal open={editModal} onClose={closeEditModal}>
                <EditTraining program={openedProgram} close={closeEditModal} />
            </Modal>
            <Modal open={deleteModal} onClose={closeDeleteModal}>
                <Confirmation close={closeDeleteModal} deleteFunction={deleteProgram} deletingId={deletingId} />
            </Modal>
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

export default Trainer;