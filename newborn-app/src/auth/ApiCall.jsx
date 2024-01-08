import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ApiCall () {
    const navigate = useNavigate();
    const getToken = () =>{
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () =>{
        const userString = sessionStorage.getItem('user');
        const user_detail = JSON.parse(userString);
        return user_detail;
    }

    const [token,setToken] = useState(getToken());
    const [user,setUser] = useState(getUser());


    const saveToken = (user,token) =>{
        sessionStorage.setItem('token',JSON.stringify(token));
        sessionStorage.setItem('user',JSON.stringify(user));

        setToken(token);
        setUser(user);
        navigate('/dashboard');
    }

    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    }
    
    const http = axios.create({
        baseURL: "http://127.0.0.1:8000/api",
        headers: {
            "Content-type" : "application/json"
        }
    });

    http.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return {
        setToken:saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}

export default ApiCall