import Navbar from "../Navbar/Navbar";
import React, { useContext, useEffect } from "react";
import styles from "./Training.module.css";
import Trainer from "./Trainer/Trainer";
import Client from "./Client/Client";
import UserContext from "../Context/User/UserContext";
import ProgramContext from "../Context/Program/ProgramContext";

function Training() {
    const { fetchPrograms } = useContext(ProgramContext);
    const { userType } = useContext(UserContext);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleUser = (userType) => {

        return userType==='TRAINER' ? <Trainer /> : <Client />;
    };

    return (
        <>
            <Navbar/>
            <div className={styles.calendar}>
                {handleUser(userType)}
            </div>
        </>
    );
}

export default Training;