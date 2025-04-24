import styles from './Confirmation.module.css';
import React from "react";
import { Button } from "@mui/material";

function Confirmation({ close, deleteFunction, deletingId }) {
    return (
        <div className={styles.container}>
            <h1>Biztos ki akarod törölni?</h1>
            <div className={styles.buttons}>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => {
                        deleteFunction(deletingId) || deleteFunction();
                        close();
                    }}
                >
                    Törlés
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => close()}
                >
                    Bezárás
                </Button>
            </div>
        </div>
    );
}

export default Confirmation;