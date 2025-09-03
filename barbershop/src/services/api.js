import axios from 'axios';

// Si la variable de entorno VITE_API_URL existe, la usa.
// Si no, usa la URL de desarrollo local.
// Esto permite que el código funcione tanto en producción como en desarrollo.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    // Concatenamos la URL base con el prefijo /api, ya que Django lo usa para todas las rutas de la API.
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Este interceptor añade el token de autenticación a cada petición
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