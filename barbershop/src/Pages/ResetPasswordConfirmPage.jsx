// src/Pages/ResetPasswordConfirmPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../CSS/forms.css'; // Reutiliza los estilos de formularios
import logo from '/Logo-barber.png';

const ResetPasswordConfirmPage = () => {
    const { uid, token } = useParams(); // Obtiene uid y token de la URL
    const navigate = useNavigate();
    
    // URL de la API actualizada para el backend en Render
    const API_URL = 'https://barberia-backend-tl1f.onrender.com/api/password-reset/confirm/';

    const [formData, setFormData] = useState({
        new_password: '',
        confirm_password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidLink, setIsValidLink] = useState(true); // Para verificar si el enlace es válido

    // Opcional: Puedes hacer una verificación de validez del token al cargar la página
    // useEffect(() => {
    //     const verifyToken = async () => {
    //         // Podrías tener un endpoint en Django para verificar solo el token sin cambiar la contraseña
    //         // Por ahora, el endpoint de confirmación lo validará al POSTear.
    //         if (!uid || !token) {
    //             setIsValidLink(false);
    //             setError('Enlace de restablecimiento incompleto.');
    //         }
    //     };
    //     verifyToken();
    // }, [uid, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.new_password !== formData.confirm_password) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        if (formData.new_password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    new_password: formData.new_password,
                    confirm_password: formData.confirm_password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.detail || 'Contraseña restablecida exitosamente. Redirigiendo al login...');
                setTimeout(() => {
                    navigate('/login'); // Redirige al login después de un éxito
                }, 2000);
            } else {
                // Manejo de errores específicos del backend
                let errorMessage = 'Error al restablecer la contraseña. Inténtalo de nuevo.';
                if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.new_password) { // Errores de validación para el campo new_password
                    errorMessage = `Nueva contraseña: ${data.new_password.join(', ')}`;
                } else if (data.token) { // Errores de validación para el campo token
                    errorMessage = `Token: ${data.token.join(', ')}`;
                } else if (data.uid) { // Errores de validación para el campo uid
                    errorMessage = `UID: ${data.uid.join(', ')}`;
                } else if (data.non_field_errors) { // Errores generales no asociados a un campo
                    errorMessage = data.non_field_errors.join(', ');
                }
                setError(errorMessage);
                console.error('Error al restablecer contraseña:', data);
                // Si el error es por token/uid inválido, marcamos el enlace como no válido
                if (data.detail && (data.detail.includes('inválido') || data.detail.includes('expirado'))) {
                     setIsValidLink(false);
                }
            }
        } catch (err) {
            setError('Hubo un problema al conectar con el servidor. Inténtalo de nuevo.');
            console.error('Network or server error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isValidLink) {
        return (
            <section id="reset-password-page" className="form-page section">
                <div className="form-background form-bg-image"></div>
                <div className="form-content section-content">
                    <div className="form-container animate-on-scroll">
                        <Link to="/" className="form-logo-link">
                            <img src={logo} alt="Barbería Kodia Logo" className="form-logo" />
                        </Link>
                        <h2 className="form-title">Error de Restablecimiento</h2>
                        <p className="form-message error-message">
                            El enlace para restablecer la contraseña no es válido o ha expirado.
                            Por favor, solicita un nuevo enlace.
                        </p>
                        <p className="form-link-text">
                            <Link to="/login">Volver al inicio de sesión</Link>
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="reset-password-page" className="form-page section">
            <div className="form-background form-bg-image"></div>
            <div className="form-content section-content">
                <div className="form-container animate-on-scroll">
                    <Link to="/" className="form-logo-link">
                        <img src={logo} alt="Barbería Kodia Logo" className="form-logo" />
                    </Link>
                    <h2 className="form-title">Establecer Nueva Contraseña</h2>

                    {error && <p className="form-message error-message">{error}</p>}
                    {success && <p className="form-message success-message">{success}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="new_password">Nueva Contraseña:</label>
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password">Confirmar Nueva Contraseña:</label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn-form" disabled={loading}>
                            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </form>
                    <p className="form-link-text">
                        <Link to="/login">Volver al inicio de sesión</Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordConfirmPage;
