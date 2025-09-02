import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/perfil.css';

const Perfil = () => {
    // Definimos el estado inicial para los datos del usuario, la contraseña y el manejo de la UI
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        telefono: '',
    });
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [passwordStrength, setPasswordStrength] = useState(0); // Nuevo estado para la fortaleza de la contraseña
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const API_URL = 'http://127.0.0.1:8000/api/';

    // Usamos useEffect para cargar los datos del usuario al montar el componente
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${API_URL}profile/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setUser(response.data);
            } catch (err) {
                console.error('Error al obtener el perfil:', err);
                setError('No se pudieron cargar los datos del perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    // Función para calcular la fortaleza de la contraseña
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 7) {
            strength += 1;
        }
        if (password.match(/[A-Z]/)) {
            strength += 1;
        }
        if (password.match(/[0-9]/)) {
            strength += 1;
        }
        if (password.match(/[^a-zA-Z0-9]/)) {
            strength += 1;
        }
        setPasswordStrength(strength);
    };

    // Maneja los cambios en los campos del perfil
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Maneja los cambios en los campos de la contraseña
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });

        // Calculamos la fortaleza solo si se está cambiando la nueva contraseña
        if (name === 'new_password') {
            checkPasswordStrength(value);
        }
    };

    // Maneja el envío del formulario de actualización de perfil
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        const token = localStorage.getItem('token');

        try {
            await axios.put(`${API_URL}profile/`, user, {
                headers: { Authorization: `Token ${token}` },
            });
            setSuccessMessage('Perfil actualizado exitosamente.');
            setIsEditing(false);
        } catch (err) {
            console.error('Error al actualizar el perfil:', err.response?.data || err);
            setError(err.response?.data?.detail || 'Error al actualizar el perfil. Por favor, verifica tus datos.');
        } finally {
            setLoading(false);
        }
    };

    // Maneja el envío del formulario de cambio de contraseña
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        const token = localStorage.getItem('token');

        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('La nueva contraseña y la confirmación no coinciden.');
            setLoading(false);
            return;
        }

        try {
            // El backend requiere los 3 campos, por lo tanto, es necesario incluirlos.
            const payload = {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
                confirm_password: passwordData.confirm_password,
            };

            const response = await axios.post(`${API_URL}profile/password/change/`, payload, {
                headers: { Authorization: `Token ${token}` },
            });

            setSuccessMessage(response.data.detail);
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Error al cambiar la contraseña:', err.response?.data || err);
            setError(err.response?.data?.detail || 'Error al cambiar la contraseña.');
        } finally {
            setLoading(false);
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: '',
            });
        }
    };

    const getStrengthText = () => {
        if (passwordData.new_password.length === 0) return '';
        if (passwordStrength <= 1) return 'Contraseña débil';
        if (passwordStrength === 2) return 'Contraseña aceptable';
        return 'Contraseña segura';
    };

    const getStrengthClass = () => {
        if (passwordData.new_password.length === 0) return '';
        if (passwordStrength <= 1) return 'weak';
        if (passwordStrength === 2) return 'medium';
        return 'strong';
    };

    if (loading) {
        return <div className="perfil-container"><p>Cargando perfil...</p></div>;
    }

    return (
        <div className="perfil-container">
            <h1 className="perfil-title">Mi Perfil</h1>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {/* Sección de Datos del Perfil */}
            <div className="profile-section profile-info-card">
                <div className="profile-header">
                    <h2>Datos Personales</h2>
                    {!isEditing ? (
                        <button className="edit-button" onClick={() => setIsEditing(true)}>
                            Editar
                        </button>
                    ) : (
                        <button className="cancel-edit-button" onClick={() => setIsEditing(false)}>
                            Cancelar
                        </button>
                    )}
                </div>
                
                <form className="profile-form" onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={user.first_name}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={user.last_name}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Celular:</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={user.telefono}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    {isEditing && (
                        <button className="save-button" type="submit" disabled={loading}>
                            Guardar Cambios
                        </button>
                    )}
                </form>
            </div>

            {/* Sección de Cambio de Contraseña */}
            <div className="profile-section password-change-card">
                <h2>Cambiar Contraseña</h2>
                <form className="password-form" onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label>Contraseña Actual:</label>
                        <input
                            type="password"
                            name="old_password"
                            value={passwordData.old_password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nueva Contraseña:</label>
                        <input
                            type="password"
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            required
                        />
                        {/* Barra de progreso de fortaleza de contraseña */}
                        {passwordData.new_password && (
                            <div className="password-strength-container">
                                <div className={`password-strength-bar ${getStrengthClass()}`}
                                     style={{ width: `${passwordStrength * 25}%` }}>
                                </div>
                                <span className="password-strength-text">{getStrengthText()}</span>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Confirmar Nueva Contraseña:</label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button className="password-button" type="submit" disabled={loading || passwordStrength < 3}>
                        Cambiar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Perfil;