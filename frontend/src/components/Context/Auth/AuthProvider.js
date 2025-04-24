import AuthContext from './AuthContext';
import axios from "axios";
import { useContext, useEffect } from "react";
import UserContext from "../User/UserContext";

function AuthProvider({ children }) {
    const { setIsUserLoggedIn, setUserType, setUser, userType } = useContext(UserContext);

    const getRoleFromResponse = (data) => {
        return data.login?.role || data.role || '';
    };

    const login = (email, password) => {
        return axios.post('/auth/login', { email, password })
            .then(response => {
                const token = response.headers['jwt_token'];
                localStorage.setItem('access_token', token);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                setIsUserLoggedIn(true);
                const role = getRoleFromResponse(response.data);
                setUserType(role);

                getUserData(token);
                return response.data;
            })
            .catch(error => {
                console.log('Login failed:', error);
                throw error;
            });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        delete axios.defaults.headers.common['Authorization'];
        setIsUserLoggedIn(false);
        setUserType('');
        setUser(null);
    };

    const getUserData = (token) => {
        axios.get('/auth/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                setUser(response.data);
                const role = getRoleFromResponse(response.data);
                setUserType(role);
            })
            .catch(error => {
                console.log('Error getting user:', error);
                logout();
            });
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            setIsUserLoggedIn(true);
            getUserData(token);
        } else {
            logout();
        }
    }, [setIsUserLoggedIn, setUserType, setUser]);

    return (
        <AuthContext.Provider value={{ login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;