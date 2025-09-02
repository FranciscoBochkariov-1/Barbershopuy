import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // URL base de la API en Render
    const API_URL = 'https://barberia-backend-tl1f.onrender.com/api/';

    // Cargar el estado de autenticación desde localStorage al inicio
    useEffect(() => {
        const loadAuthData = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error al cargar datos de autenticación de localStorage:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        loadAuthData();
    }, []);

    const login = useCallback(async (username, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                navigate('/');
                return { success: true };
            } else {
                return { success: false, error: data.detail || 'Credenciales inválidas.' };
            }
        } catch (err) {
            console.error('Error de red o servidor durante el login:', err);
            return { success: false, error: 'Hubo un problema al conectar con el servidor.' };
        } finally {
            setLoading(false);
        }
    }, [navigate, API_URL]);

    const register = useCallback(async (userData) => {
        setLoading(true);
        try {
            const payload = {
                username: userData.email,
                first_name: userData.nombre,
                last_name: userData.apellido,
                telefono: userData.celular,
                email: userData.email,
                password: userData.password,
            };

            const response = await fetch(`${API_URL}register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token && data.user) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setToken(data.token);
                    setUser(data.user);
                    navigate('/');
                    return { success: true, message: 'Registro exitoso. ¡Sesión iniciada!' };
                } else {
                    navigate('/login');
                    return { success: true, message: 'Registro exitoso. Por favor, inicia sesión.' };
                }
            } else {
                let errorMessage = 'Error en el registro. Por favor, inténtalo de nuevo.';
                if (data.username) errorMessage = `Usuario: ${data.username.join(', ')}`;
                else if (data.email) errorMessage = `Email: ${data.email.join(', ')}`;
                else if (data.telefono) errorMessage = `Teléfono: ${data.telefono.join(', ')}`;
                else if (data.password) errorMessage = `Contraseña: ${data.password.join(', ')}`;
                else if (data.detail) errorMessage = data.detail;
                return { success: false, error: errorMessage };
            }
        } catch (err) {
            console.error('Error de red o servidor durante el registro:', err);
            return { success: false, error: 'Hubo un problema al conectar con el servidor.' };
        } finally {
            setLoading(false);
        }
    }, [navigate, API_URL]);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            if (token) {
                await fetch(`${API_URL}logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
            }
        } catch (err) {
            console.error('Error al intentar cerrar sesión en el backend:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            setLoading(false);
            navigate('/login');
        }
    }, [token, navigate, API_URL]);

    const contextValue = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};