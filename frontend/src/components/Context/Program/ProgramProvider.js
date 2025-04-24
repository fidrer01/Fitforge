import React, {useState} from 'react';
import ProgramContext from "./ProgramContext";
import axios from "axios";

const UserProvider = ({ children }) => {

    const [programs, setPrograms] = useState([]);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get("/program/");
            setPrograms(response.data);
        }catch(err){
            console.log("Error fetching programs"+err);
        }
    }

    return (
        <ProgramContext.Provider value={{programs,setPrograms, fetchPrograms}}>
            {children}
        </ProgramContext.Provider>
    );
};

export default UserProvider;
