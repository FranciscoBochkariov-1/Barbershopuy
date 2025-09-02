// src/Pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/forms.css';
import logo from '/Logo-barber.png';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    // Estados para la recuperación de contraseña
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLocalLoading(true);

        if (!formData.username || !formData.password) {
            setError('Por favor, ingresa tu usuario/email y contraseña.');
            setLocalLoading(false);
            return;
        }

        const result = await login(formData.username, formData.password);

        if (result.success) {
            setSuccess('¡Inicio de sesión exitoso!');
        } else {
            setError(result.error);
            console.error('Error de login:', result.error);
        }
        setLocalLoading(false);
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setResetMessage('');
        setResetError('');
        setResetLoading(true);

        if (!resetEmail) {
            setResetError('Por favor, ingresa tu dirección de email.');
            setResetLoading(false);
            return;
        }

        try {
            // URL corregida para el backend en Render
            const response = await fetch('https://barberia-backend-tl1f.onrender.com/api/password-reset/request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resetEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setResetMessage(data.detail || 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.');
                setResetEmail('');
            } else {
                let errorMessage = 'No se pudo procesar la solicitud. Inténtalo de nuevo.';
                if (data.email) {
                    errorMessage = `Email: ${data.email.join(', ')}`;
                } else if (data.detail) {
                    errorMessage = data.detail;
                }
                setResetError(errorMessage);
                console.error('Error al solicitar reseteo:', data);
            }
        } catch (err) {
            setResetError('Hubo un problema al conectar con el servidor. Inténtalo de nuevo.');
            console.error('Network or server error for password reset:', err);
        } finally {
            setResetLoading(false);
        }
    };

    const isLoading = localLoading || authLoading;

    return (
        <section id="login-page" className="form-page section">
            <div className="form-background form-bg-image"></div>
            <div className="form-content section-content">
                <div className="form-container animate-on-scroll">
                    <Link to="/" className="form-logo-link">
                        <img src={logo} alt="Barbería Kodia Logo" className="form-logo" />
                    </Link>
                    <h2 className="form-title">Iniciar Sesión</h2>

                    {error && <p className="form-message error-message">{error}</p>}
                    {success && <p className="form-message success-message">{success}</p>}

                    <form onSubmit={handleLoginSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Usuario (o Email):</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" className="btn-form" disabled={isLoading}>
                            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <p className="form-link-text mt-md">
                        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                    </p>
                    <button
                        type="button"
                        className="forgot-password-link"
                        onClick={() => setShowForgotPassword(!showForgotPassword)}
                        disabled={isLoading}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>

                    {showForgotPassword && (
                        <div className="forgot-password-section">
                            <h3 className="form-subtitle">Restablecer Contraseña</h3>
                            {resetError && <p className="form-message error-message">{resetError}</p>}
                            {resetMessage && <p className="form-message success-message">{resetMessage}</p>}
                            <form onSubmit={handleForgotPasswordSubmit} className="auth-form mt-sm">
                                <div className="form-group">
                                    <label htmlFor="resetEmail">Email:</label>
                                    <input
                                        type="email"
                                        id="resetEmail"
                                        name="resetEmail"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                        disabled={resetLoading}
                                    />
                                </div>
                                <button type="submit" className="btn-form btn-secondary-form" disabled={resetLoading}>
                                    {resetLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LoginPage;