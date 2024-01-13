import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

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
        navigate('/');
    }

    const checkTokenExpiration = () => {
        const currentToken = getToken();
      
        if (currentToken) {
          try {
            const decodedToken = jwtDecode(currentToken);
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = new Date().getTime();
            if (currentTime >= expirationTime) {
              logout();
            }
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      };

      useEffect(() => {
        checkTokenExpiration();
      })

    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    }
    
    const http = axios.create({baseURL: import.meta.env.VITE_API_BASE_URL});

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

export default ApiCall;