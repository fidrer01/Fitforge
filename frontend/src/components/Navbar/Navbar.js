import styles from './Navbar.module.css';
import React, { useContext, useEffect, useState } from 'react';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router';
import { Button, Modal, Select, Snackbar, TextField, MenuItem } from '@mui/material';
import { Dropdown, Menu, MenuButton } from '@mui/joy';
import UserContext from '../Context/User/UserContext';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import AuthContext from '../Context/Auth/AuthContext';
import Confirmation from "../Confirmation";
import PhoneInput from "react-phone-input-2";

function Navbar() {
    const navigate = useNavigate();
    const { userType, setUserType, isUserLoggedIn, setIsUserLoggedIn, user, fetchUser } = useContext(UserContext);
    const { logout } = useContext(AuthContext);
    const [openInfoModal, setOpenInfoModal] = useState(false);
    const [email, setEmail] = useState('');
    const [isSelectEdited, setIsSelectEdited] = useState(true);
    const [isBirthYearEdited, setIsBirthYearEdited] = useState(true);
    const [isPhoneEdited, setIsPhoneEdited] = useState(true);
    const [isNameEdited, setIsNameEdited] = useState(true);
    const [snackBarSuccess, setSnackBarSuccess] = useState(false);
    const [snackBarError, setSnackBarError] = useState(false);
    const [patchData, setPatchData] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

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

    const handleOpenInfo = () => setOpenInfoModal(true);
    const handleCloseInfo = () => setOpenInfoModal(false);
    const closeSnackBarSuccess = () => setSnackBarSuccess(false);
    const openSnackBarSuccess = () => setSnackBarSuccess(true);
    const closeSnackBarError = () => setSnackBarError(false);
    const openSnackBarError = () => setSnackBarError(true);

    const openDeleteModal = () => setDeleteModal(true);
    const closeDeleteModal = () => setDeleteModal(false);
    const whichUser = (userType) => (userType === 'TRAINER' ? <>Edző</> : userType === 'CLIENT' ? <>Kliens</> : <>Admin</>);

    const isThereQualification = () => {
        if (userType === 'TRAINER' && user) {
            const qualifications = [
                "Personal Trainer",
                "Fitness Instructor",
                "Pilates Instructor",
                "Crossfit Coach",
                "TRX Trainer",
                "Pound Trainer",
                "Other",
            ];

            return (
                <div className={styles.info}>
                    <h4>Végzettség:</h4>
                    <Select
                        className={styles.editInputs}
                        disabled={isSelectEdited}
                        defaultValue={user.qualification || ''}
                        onChange={handleChange}
                        name="qualification"
                        variant="outlined"
                        size="small"
                    >
                        {qualifications.map((qualification, key) => (
                            <MenuItem
                                key={key}
                                value={qualification.toUpperCase().replace(" ", "_")}
                            >
                                {getQualificationTranslation(qualification)}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className={styles.editButton}>
                        <EditIcon onClick={() => setIsSelectEdited(false)} />
                        {!isSelectEdited && (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsSelectEdited(true);
                                    patchUserData(patchData);
                                }}
                            >
                                Mentés
                            </Button>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    const handleLoginNavbar = () => {
        if (isUserLoggedIn && user) {
            return (
                <Dropdown>
                    <MenuButton className={styles.menuButton}>
                        <AccountCircleIcon style={{ fontSize: '2rem' }} />
                    </MenuButton>
                    <Menu className={styles.dropdownMenu}>
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHead}>
                                <AccountCircleIcon style={{ fontSize: '2rem' }} />
                                <div>{user.name}</div>
                            </div>
                            <div className={styles.userType}>{whichUser(userType)}</div>
                            {userType !== 'ADMIN' && (
                                <MenuItem onClick={handleOpenInfo}>Adataim</MenuItem>
                            )}
                            <MenuItem
                                onClick={() => {
                                    logout();
                                    navigate('/landingPage');
                                }}
                            >
                                Kijelentkezés
                            </MenuItem>
                        </div>
                    </Menu>
                </Dropdown>
            );
        } else {
            return (
                <Button
                    className={styles.loginButton}
                    variant="contained"
                    color="inherit"
                    onClick={() => navigate('/login')}
                >
                    Bejelentkezés
                </Button>
            );
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleChange = (event) => {
        let targetName;
        try {
            targetName = event.target.name;
        } catch (e) {
            targetName = 'birth_date';
        }
        if (targetName !== 'birth_date') {
            setPatchData((values) => ({
                ...values,
                selected: event.target.name.toUpperCase(),
                value: event.target.value,
            }));
        } else {
            setPatchData((values) => ({
                ...values,
                selected: 'BIRTH_DATE',
                value: formatDate(event.$d),
            }));
        }
    };
    const patchUserData = async () => {
        try {
            if (userType === 'TRAINER') {
                await axios.patch(`/trainer/${user.id}`, patchData);
            } else if (userType === 'CLIENT') {
                await axios.patch(`/client/${user.id}`, patchData);
            }
            openSnackBarSuccess();
        } catch (e) {
            openSnackBarError();
            console.error('Patch error:', e);
        }
        await fetchUser(userType);
    };

    const handleAdminPage = () => {
        if (userType === 'ADMIN') {
            return (
                <div className={styles.pageItem} onClick={() => navigate('/adminPage')}>
                    Felhasználók
                </div>
            );
        } else {
            return (
                <>
                    <div className={styles.pageItem} onClick={() => navigate('/blogs')}>
                        Blogok
                    </div>
                    <div className={styles.pageItem} onClick={() => navigate('/training')}>
                        Programok
                    </div>
                </>
            );
        }
    };

    const handleDeleteButton = (userType) => {
        if (userType === 'CLIENT') {
            return (
                <div className={styles.deleteButton}>
                    <Button
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={openDeleteModal}
                    >
                        Fiók törlése
                    </Button>
                </div>
            );
        }
        return null;
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`/auth/delete`);
            setIsUserLoggedIn(false);
            navigate('/landingPage');
            closeDeleteModal();
            handleCloseInfo();
            openSnackBarSuccess();
        } catch (e) {
            openSnackBarError();
            console.error('Delete error:', e);
        }
    };

    useEffect(() => {
        if (user && user.login && user.login.email) {
            setEmail(user.login.email);
        }
    }, [user]);

    useEffect(() => {
        if (isUserLoggedIn && !user) {
            fetchUser(userType);
        }
    }, [isUserLoggedIn, user, userType, fetchUser]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.body}>
                <div className={styles.container}>
                    <div className={styles.nav}>
                        <div className={styles.logo} onClick={() => navigate('/landingPage')}>
                            <FitnessCenterOutlinedIcon fontSize="large" />
                        </div>
                        <div className={styles.mobileMenuToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <MenuIcon fontSize="large" />
                        </div>
                        <div className={`${styles.pages} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                            {handleAdminPage()}
                            {handleLoginNavbar()}
                        </div>
                    </div>
                </div>

                <Modal open={openInfoModal} onClose={handleCloseInfo}>
                    {user ? (
                        <div className={styles.modalContainer}>
                            <div className={styles.modalHeader}>
                                <AccountCircleIcon className={styles.icon} />
                                <div className={styles.nameWrapper}>
                                    <TextField
                                        className={styles.editInputs}
                                        label="Név"
                                        disabled={isNameEdited}
                                        defaultValue={user.name || ''}
                                        name="name"
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <div className={styles.editButton}>
                                        <EditIcon onClick={() => setIsNameEdited(false)} />
                                        {!isNameEdited && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsNameEdited(true);
                                                    patchUserData();
                                                }}
                                            >
                                                Mentés
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.informations}>
                                <div className={styles.info}>
                                    <h4>Email:</h4>
                                    <span>{email || ''}</span>
                                </div>
                                <div className={styles.info}>
                                    <h4>Születési év:</h4>
                                    <DatePicker
                                        disabled={isBirthYearEdited}
                                        defaultValue={user.birthDate ? dayjs(user.birthDate) : null}
                                        className={styles.editInputs}
                                        name="birth_date"
                                        onChange={handleChange}
                                        slotProps={{ textField: { size: 'small', variant: 'outlined' } }}
                                    />
                                    <div className={styles.editButton}>
                                        <EditIcon onClick={() => setIsBirthYearEdited(false)} />
                                        {!isBirthYearEdited && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsBirthYearEdited(true);
                                                    patchUserData();
                                                }}
                                            >
                                                Mentés
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {isThereQualification()}
                                <div className={styles.info}>
                                    <h4>Telefonszám:</h4>
                                    <PhoneInput
                                        className={styles.editInputs}
                                        type="number"
                                        disabled={isPhoneEdited}
                                        value={user.phoneNumber || ''}
                                        onChange={(value) => handleChange({ target: { name: "phone_number", value } })}
                                        country="hu"
                                        inputStyle={{ width: '100%' }}
                                        inputProps={{ maxLength: 15 }}
                                    />
                                    <div className={styles.editButton}>
                                        <EditIcon onClick={() => setIsPhoneEdited(false)} />
                                        {!isPhoneEdited && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsPhoneEdited(true);
                                                    patchUserData();
                                                }}
                                            >
                                                Mentés
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {handleDeleteButton(userType)}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.modalContainer}>
                            <div className={styles.modalHeader}>
                                <p>Felhasználói adatok betöltése</p>
                            </div>
                        </div>
                    )}
                </Modal>

                <Modal open={deleteModal} onClose={closeDeleteModal}>
                    <Confirmation close={closeDeleteModal} deleteFunction={deleteUser} />
                </Modal>

                <Snackbar
                    open={snackBarSuccess}
                    autoHideDuration={6000}
                    onClose={closeSnackBarSuccess}
                    message="Sikeres módosítás!"
                    sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#2e7d32' } }}
                />
                <Snackbar
                    open={snackBarError}
                    autoHideDuration={6000}
                    onClose={closeSnackBarError}
                    message="Sikertelen módosítás!"
                    sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#d32f2f' } }}
                />
            </div>
        </LocalizationProvider>
    );
}

export default Navbar;