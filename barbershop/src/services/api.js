import axios from 'axios';

// Usa una variable de entorno para la URL de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Este interceptor añade el token automáticamente a cada petición
api.interceptors.request.use(
    (config) => {
        // La clave del localStorage debe coincidir con la de tu AuthContext, que es 'token'
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;