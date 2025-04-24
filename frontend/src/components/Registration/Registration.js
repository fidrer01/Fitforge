import styles from './Registration.module.css';
import { Tabs, TabList, Tab, TabPanel } from '@mui/joy';
import React, { useState } from "react";

import TrainerForm from "./TrainerForm/TrainerForm";
import ClientForm from "./ClientForm/ClientForm";
import { Snackbar } from "@mui/material";

function Registration() {
    const [snackBarError, setSnackBarError] = useState(false);
    const closeSnackBarError = () => setSnackBarError(false);
    const openSnackBarError = () => setSnackBarError(true);

    return (
        <div className={styles.container}>
            <Tabs>
                <TabList tabFlex="auto">
                    <Tab className={styles.tab}>
                        <div className={styles.tabText}>Edzőként</div>
                    </Tab>
                    <Tab className={styles.tab}>
                        <div className={styles.tabText}>Kliensként</div>
                    </Tab>
                </TabList>
                <TabPanel value={0}>
                    <TrainerForm openSnackBarError={openSnackBarError} />
                </TabPanel>
                <TabPanel value={1}>
                    <ClientForm openSnackBarError={openSnackBarError} />
                </TabPanel>
            </Tabs>
            <Snackbar
                open={snackBarError}
                autoHideDuration={1000}
                onClose={closeSnackBarError}
                message="Sikertelen Regisztráció!"
                style={{ position: "relative" }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: 'red',
                    }
                }}
            />
        </div>
    );
}

export default Registration;