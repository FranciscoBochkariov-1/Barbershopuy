import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../CSS/mis-turnos.css';

const MisTurnos = () => {
    const { isAuthenticated, token, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [turnoToCancel, setTurnoToCancel] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver tus turnos.');
            setLoading(false);
            navigate('/login');
            return;
        }

        const fetchTurnos = async () => {
            try {
                // URL corregida para el backend en Render
                const response = await fetch('https://barberia-backend-tl1f.onrender.com/api/turnos/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                if (response.status === 401) {
                    throw new Error('Sesión expirada o no válida. Por favor, vuelve a iniciar sesión.');
                }
                
                if (!response.ok) {
                    throw new Error('Error al cargar los turnos.');
                }

                const data = await response.json();
                setTurnos(data);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener los turnos:", err);
                setError(err.message || 'Error al cargar los turnos. Por favor, inténtalo de nuevo.');
                setLoading(false);
                if (err.message.includes('expirada')) {
                    navigate('/login');
                }
            }
        };

        fetchTurnos();
    }, [isAuthenticated, authLoading, token, navigate]);

    const handleCancelClick = (id) => {
        setTurnoToCancel(id);
        setShowModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!isAuthenticated || !token) {
            setNotification({ message: 'Debes iniciar sesión para cancelar un turno.', type: 'error', visible: true });
            navigate('/login');
            return;
        }

        try {
            // URL corregida para el backend en Render
            const response = await fetch(`https://barberia-backend-tl1f.onrender.com/api/turnos/${turnoToCancel}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.status === 401) {
                throw new Error('Sesión expirada o no válida. Por favor, vuelve a iniciar sesión.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Hubo un error al cancelar el turno.');
            }
            
            setTurnos(turnos.filter(turno => turno.id !== turnoToCancel));
            setNotification({ message: 'Turno cancelado exitosamente.', type: 'success', visible: true });

            setTimeout(() => {
                setNotification({ ...notification, visible: false });
            }, 3000);

        } catch (err) {
            console.error("Error al cancelar el turno:", err);
            setNotification({ message: err.message, type: 'error', visible: true });
            setTimeout(() => {
                setNotification({ ...notification, visible: false });
            }, 5000);

            if (err.message.includes('expirada')) {
                navigate('/login');
            }
        } finally {
            setShowModal(false);
            setTurnoToCancel(null);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTurnoToCancel(null);
    };
    
    const handleCloseNotification = () => {
        setNotification({ ...notification, visible: false });
    };

    if (loading || authLoading) {
        return <div className="mis-turnos-container loading-message">Cargando turnos...</div>;
    }

    if (error) {
        return <div className="mis-turnos-container error-message">{error}</div>;
    }

    if (turnos.length === 0) {
        return <div className="mis-turnos-container no-turnos-message">No tienes turnos programados.</div>;
    }

    return (
        <div className="mis-turnos-container">
            <h1 className="mis-turnos-title">Mis Turnos</h1>
            <div className="dashboard-table-container">
                <table className="turnos-table">
                    <thead>
                        <tr>
                            <th>Barbero</th>
                            <th>Servicio</th>
                            <th>Hora</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.map((turno) => (
                            <tr key={turno.id}>
                                <td>{turno.barbero.usuario.first_name}</td>
                                <td>{turno.servicio.nombre}</td>
                                <td>{turno.hora}</td>
                                <td>{turno.fecha}</td>
                                <td>
                                    <button 
                                        onClick={() => handleCancelClick(turno.id)} 
                                        className="cancel-button"
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>¿Estás seguro de que deseas cancelar este turno?</p>
                        <div className="modal-actions">
                            <button className="btn-confirm" onClick={handleConfirmCancel}>
                                Confirmar
                            </button>
                            <button className="btn-cancel" onClick={handleCloseModal}>
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification.visible && (
                <div className={`notification-container ${notification.type}`}>
                    <p>{notification.message}</p>
                    <button className="close-button" onClick={handleCloseNotification}>&times;</button>
                </div>
            )}
        </div>
    );
};

export default MisTurnos;
