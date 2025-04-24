import React, {useState} from 'react';
import UserContext from './UserContext';
import axios from "axios";

const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [user, setUser] = useState([
        {email: ''},
    ]);
    const fetchUser = async (usertype) => {
       try{
           if (usertype ==='TRAINER'){
               const response = await axios.get(`/trainer/${user.id}`);
               setUser(response.data);
           }
           if (usertype==='CLIENT') {
               const response = await axios.get(`/client/${user.id}`);
               setUser(response.data);
           }

        }catch(err){
            console.log("Error fetching User"+err);
        }
    }


    return (
        <UserContext.Provider value={{userType,isUserLoggedIn, setIsUserLoggedIn, user, setUser,setUserType, fetchUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
