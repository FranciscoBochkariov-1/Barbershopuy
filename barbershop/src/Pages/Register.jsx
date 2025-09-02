// src/Pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/forms.css';
import logo from '/Logo-barber.png';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        celular: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [celularError, setCelularError] = useState('');

    // Expresión regular para validar el celular:
    // ^\+?: opcionalmente comienza con un '+'
    // [0-9]{8,15}: seguido de 8 a 15 dígitos
    // $: el final de la cadena
    const celularRegex = /^\+?[0-9]{8,15}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validación en tiempo real para el campo de celular
        if (name === 'celular') {
            // Solo permite caracteres válidos mientras el usuario escribe
            const validCharacters = /^[0-9+]*$/;
            if (!validCharacters.test(value)) {
                // Previene que se escriban caracteres no válidos
                return;
            } else {
                setCelularError('');
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validatePassword = (password) => {
        // Mínimo 6 caracteres
        if (password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres.';
        }
        // Al menos una letra mayúscula
        if (!/[A-Z]/.test(password)) {
            return 'La contraseña debe contener al menos una letra mayúscula.';
        }
        // Al menos un carácter especial
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
            return 'La contraseña debe contener al menos un carácter especial.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setPasswordError('');
        setCelularError('');
        setLocalLoading(true);

        // Validaciones en el momento del submit
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLocalLoading(false);
            return;
        }

        const passValidationResult = validatePassword(formData.password);
        if (passValidationResult) {
            setPasswordError(passValidationResult);
            setLocalLoading(false);
            return;
        }

        // Validación de formato y longitud del celular
        if (!celularRegex.test(formData.celular)) {
            setCelularError('Por favor, ingresa un número de celular válido (ej: +56912345678), de 8 a 15 dígitos.');
            setLocalLoading(false);
            return;
        }

        if (!formData.nombre || !formData.apellido || !formData.celular || !formData.email || !formData.password) {
            setError('Por favor, completa todos los campos.');
            setLocalLoading(false);
            return;
        }

        const result = await register(formData);

        if (result.success) {
            setSuccess(result.message);
        } else {
            setError(result.error);
            console.error('Error de registro:', result.error);
        }
        setLocalLoading(false);
    };

    const isLoading = localLoading || authLoading;

    return (
        <section id="register-page" className="form-page section">
            <div className="form-background form-bg-image"></div>
            <div className="form-content section-content">
                <div className="form-container animate-on-scroll">
                    <Link to="/" className="form-logo-link">
                        <img src={logo} alt="Barbería Kodia Logo" className="form-logo" />
                    </Link>
                    <h2 className="form-title">Registrarse</h2>

                    {error && <p className="form-message error-message">{error}</p>}
                    {success && <p className="form-message success-message">{success}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="celular">Celular:</label>
                            <input
                                type="tel"
                                id="celular"
                                name="celular"
                                value={formData.celular}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            {celularError && <p className="form-validation-error">{celularError}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
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
                            {passwordError && <p className="form-validation-error">{passwordError}</p>}
                            <p className="password-rules">Mínimo 6 caracteres, 1 mayúscula y 1 carácter especial.</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" className="btn-form" disabled={isLoading}>
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>
                    <p className="form-link-text">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
