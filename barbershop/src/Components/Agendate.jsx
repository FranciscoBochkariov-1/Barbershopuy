import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/es';
import '../CSS/agendate.css';
import { PacmanLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// URLs de tu API de Django (CORREGIDAS PARA EL DEPLIEGUE)
const API_URL = 'https://barberia-backend-tl1f.onrender.com';
const API_URL_BARBEROS = `${API_URL}/api/barberos/`;
const API_URL_SERVICIOS = `${API_URL}/api/servicios/`;
const API_URL_RESERVAR_TURNO = `${API_URL}/api/turnos/`;
const API_URL_HORARIOS_DISPONIBLES = `${API_URL}/api/horarios-disponibles/`;

const DEFAULT_BARBERO_IMAGE = 'https://placehold.co/100x100/4B5563/FFFFFF?text=Barbero';

moment.locale('es');

// Helper para obtener el token CSRF
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// Componente para la notificación flotante
const RegisterPrompt = ({ nombre, apellido, celular, navigate }) => {
    const handleRegisterClick = () => {
        // Redirige al usuario al formulario de registro, pasando los datos por el estado
        navigate('/Register', {
            state: {
                nombre: nombre,
                apellido: apellido,
                celular: celular,
            },
        });
    };

    return (
        <div className="notification-prompt-container">
            <div className="notification-prompt">
                <p>
                    ¿Querés crear una cuenta con estos mismos datos para no tener que escribirlos de nuevo la próxima vez?
                </p>
                <button 
                    onClick={handleRegisterClick} 
                    className="register-prompt-button"
                >
                    Registrarme
                </button>
            </div>
        </div>
    );
};

const Agendate = () => {
    // Uso de hooks
    const navigate = useNavigate();
    const { isAuthenticated, user, token } = useAuth();
    
    // Estados para la carga de datos iniciales
    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para la selección del turno
    const [selectedBarberoId, setSelectedBarberoId] = useState(null);
    const [selectedBarberoNombre, setSelectedBarberoNombre] = useState('');
    const [selectedServicioId, setSelectedServicioId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const [selectedHour, setSelectedHour] = useState('');

    // Estados para los datos del cliente
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [celular, setCelular] = useState('');

    // Estados para la UI (mensajes, spinners, notificación)
    const [isLoadingHours, setIsLoadingHours] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

    // Manejo de errores de imagen
    const handleImageError = (e) => {
        e.target.src = DEFAULT_BARBERO_IMAGE;
    };

    // Carga inicial de barberos y servicios
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [barberosResponse, serviciosResponse] = await Promise.all([
                    fetch(API_URL_BARBEROS),
                    fetch(API_URL_SERVICIOS)
                ]);

                if (!barberosResponse.ok) throw new Error("Error al cargar la lista de barberos.");
                if (!serviciosResponse.ok) throw new Error("Error al cargar la lista de servicios.");

                const barberosData = await barberosResponse.json();
                const serviciosData = await serviciosResponse.json();
                setBarberos(barberosData);
                setServicios(serviciosData);

            } catch (err) {
                console.error("Error en la carga inicial:", err);
                setErrorMessage(err.message || "Error al cargar la información inicial.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Efecto para pre-llenar los campos del usuario si está autenticado
    useEffect(() => {
        if (isAuthenticated && user) {
            setNombre(user.first_name || '');
            setApellido(user.last_name || '');
            setCelular(user.telefono || '');
        } else {
            // Limpiar los campos si el usuario cierra sesión o no está autenticado
            setNombre('');
            setApellido('');
            setCelular('');
        }
    }, [isAuthenticated, user]);

    // Función para obtener los horarios disponibles
    const fetchAvailableHours = useCallback(async (date, barberoId) => {
        if (!date || !barberoId) {
            setAvailableHours([]);
            return;
        }
        setIsLoadingHours(true);
        setErrorMessage('');
        try {
            const formattedDate = moment(date).format('YYYY-MM-DD');
            const response = await fetch(`${API_URL_HORARIOS_DISPONIBLES}?barbero_id=${barberoId}&fecha=${formattedDate}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} al cargar horarios.`);
            }
            const data = await response.json();
            const horasDisponibles = data.filter(h => h.disponible).map(h => h.hora_inicio);
            setAvailableHours(horasDisponibles);
            setSelectedHour('');
        } catch (err) {
            console.error("Error fetching available hours:", err);
            setErrorMessage("No se pudieron cargar los horarios disponibles. Intenta de nuevo.");
            setAvailableHours([]);
        } finally {
            setIsLoadingHours(false);
        }
    }, []);

    // Efecto para cargar los horarios cuando cambia la fecha o el barbero
    useEffect(() => {
        if (selectedDate && selectedBarberoId) {
            fetchAvailableHours(selectedDate, selectedBarberoId);
        } else {
            setAvailableHours([]);
        }
    }, [selectedDate, selectedBarberoId, fetchAvailableHours]);

    // Manejador de la selección de barbero
    const handleSelectBarbero = (barbero) => {
        setSelectedBarberoId(barbero.usuario.id);
        setSelectedBarberoNombre(`${barbero.usuario.first_name} ${barbero.usuario.last_name}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingForm(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (!selectedBarberoId || !selectedServicioId || !selectedDate || !selectedHour) {
            setErrorMessage('Por favor, completa todos los campos para agendar tu cita.');
            setIsSubmittingForm(false);
            return;
        }

        // Validación para usuarios autenticados y no autenticados
        if (!nombre || !apellido || !celular) {
            setErrorMessage('Por favor, completa tu Nombre, Apellido y Celular para agendar un turno.');
            setIsSubmittingForm(false);
            return;
        }
        
        const turnoSolicitado = {
            barbero: selectedBarberoId,
            servicio: selectedServicioId,
            fecha: moment(selectedDate).format('YYYY-MM-DD'),
            hora: selectedHour,
        };

        // Si el usuario no está autenticado, añade los datos del cliente al payload
        if (!isAuthenticated) {
            turnoSolicitado.nombre_cliente = nombre;
            turnoSolicitado.apellido_cliente = apellido;
            turnoSolicitado.celular_cliente = celular;
        }

        const headers = {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        };

        if (isAuthenticated && token) {
            headers['Authorization'] = `Token ${token}`;
        }
        
        try {
            const response = await fetch(API_URL_RESERVAR_TURNO, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(turnoSolicitado),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const errorDetail = responseData.detail || JSON.stringify(responseData);
                throw new Error(errorDetail || 'Error al agendar el turno. Por favor, revisa tus datos o inténtalo más tarde.');
            }

            const servicioSeleccionado = servicios.find(s => s.id === selectedServicioId);

            setSuccessMessage(
                `¡Turno agendado con éxito con ${selectedBarberoNombre} para un ${servicioSeleccionado.nombre} el ${moment(selectedDate).format('DD/MM/YYYY')} a las ${selectedHour}!`
            );

            // Mostrar la notificación solo si el usuario no estaba autenticado
            if (!isAuthenticated) {
                setShowRegisterPrompt(true);
            }

            // Limpiar el formulario después del éxito
            setSelectedBarberoId(null);
            setSelectedBarberoNombre('');
            setSelectedServicioId(null);
            setSelectedDate(null);
            setSelectedHour('');
            setAvailableHours([]);

            if (!isAuthenticated) {
                setNombre('');
                setApellido('');
                setCelular('');
            }
        } catch (err) {
            console.error("Error al enviar formulario:", err);
            setErrorMessage(err.message || 'Hubo un problema al agendar tu turno.');
        } finally {
            setIsSubmittingForm(false);
        }
    };

    if (loading) {
        return (
            <section id="agendate" className="agendate-section loading-page">
                <div className="loading-container">
                    <PacmanLoader color="#ffc107" size={25} />
                    <p className="loading-message">Cargando información de la barbería...</p>
                </div>
            </section>
        );
    }

    if (!loading && barberos.length === 0) {
        return (
            <section id="agendate" className="agendate-section">
                <div className="error-container">
                    <p className="error-message">No se encontraron barberos disponibles. Por favor, inténtalo más tarde.</p>
                </div>
            </section>
        );
    }
    
    return (
        <section id="agendate" className="agendate-section">
            <div className="agendate-header">
                <h2 className="section-title">Agenda tu Cita</h2>
                <p className="section-subtitle">Selecciona el día y la hora perfectos para tu estilo</p>
            </div>
            <div className="agendate-content">
                <div className="agendate-form-container">
                    <h3 className="form-title">Agendar un Turno</h3>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="agendate-form">
                        
                        {/* SECCIÓN 1: SELECCIÓN DE BARBERO */}
                        <div className="form-group selection-group">
                            <label>Selecciona tu Barbero:</label>
                            <div className="barbero-selection-grid">
                                {barberos.map((barb) => (
                                    <div
                                        key={barb.usuario.id}
                                        className={`barbero-option ${selectedBarberoId === barb.usuario.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectBarbero(barb)}
                                    >
                                        <img
                                            src={barb.imagen || DEFAULT_BARBERO_IMAGE}
                                            alt={`${barb.usuario.first_name} ${barb.usuario.last_name}`}
                                            className="barbero-circle-image"
                                            onError={handleImageError}
                                        />
                                        <span className="barbero-name-option">
                                            {barb.usuario.first_name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECCIÓN 2: DATOS DEL CLIENTE (siempre visible) */}
                        <div className="client-fields-container">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    placeholder="Tu nombre"
                                    disabled={isAuthenticated} // Deshabilitado si el usuario está autenticado
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido">Apellido:</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    required
                                    placeholder="Tu apellido"
                                    disabled={isAuthenticated} // Deshabilitado si el usuario está autenticado
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="celular">Celular:</label>
                                <input
                                    type="tel"
                                    id="celular"
                                    value={celular}
                                    onChange={(e) => setCelular(e.target.value)}
                                    required
                                    placeholder="Ej: 09X 123 456"
                                    disabled={isAuthenticated} // Deshabilitado si el usuario está autenticado
                                />
                            </div>
                        </div>
                        
                        {/* SECCIÓN 3: SELECCIÓN DE SERVICIO */}
                        <div className="form-group selection-group">
                            <label htmlFor="servicio">Selecciona el Servicio:</label>
                            <div className="servicios-selection-grid">
                                {servicios.map((servicio) => (
                                    <div 
                                        key={servicio.id} 
                                        className={`servicio-option ${selectedServicioId === servicio.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedServicioId(servicio.id)}
                                    >
                                        <div className="servicio-content">
                                            <span className="servicio-name">{servicio.nombre}</span>
                                            <span className="servicio-price">${servicio.precio}</span>
                                            <span className="servicio-duration">{servicio.duracion_minutos} min</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* SECCIÓN 4: SELECCIÓN DE FECHA Y HORA */}
                        <div className="form-group date-hour-group">
                            <label>Fecha y Hora:</label>
                            <div className="date-picker-container">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    placeholderText={selectedBarberoId ? "Selecciona una fecha" : "Primero selecciona un barbero"}
                                    className="date-picker-input"
                                    required
                                    showDisabledMonthNavigation
                                    filterDate={(date) => date.getDay() !== 0}
                                    disabled={!selectedBarberoId}
                                />
                            </div>
                            <div className="hour-selection-container">
                                {isLoadingHours ? (
                                    <div className="loading-hours-container">
                                        <PacmanLoader color="#ffc107" size={15} />
                                    </div>
                                ) : (
                                    <div className="hour-grid">
                                        {availableHours.length > 0 ? (
                                            availableHours.map((hour) => (
                                                <div
                                                    key={hour}
                                                    className={`hour-option ${selectedHour === hour ? 'selected' : ''}`}
                                                    onClick={() => setSelectedHour(hour)}
                                                >
                                                    {hour.substring(0, 5)}
                                                </div>
                                            ))
                                        ) : (
                                            selectedDate && selectedBarberoId && (
                                                <p className="no-hours-message">No hay horarios disponibles para esta fecha.</p>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BOTÓN DE ENVÍO */}
                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={isSubmittingForm || !selectedBarberoId || !selectedServicioId || !selectedDate || !selectedHour || !nombre || !apellido || !celular}
                        >
                            {isSubmittingForm ? 'Agendando...' : 'Confirmar Cita'}
                        </button>
                    </form>
                </div>

                <div className="agendate-info-container">
                    <h3 className="info-title">Información Importante</h3>
                    <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <p><strong>Ubicación:</strong> Paysandú, Calle: Av. Italia 1234</p>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-clock"></i>
                        <p><strong>Llegada:</strong> Por favor, llega 10 minutos antes de tu turno.</p>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>
                            <strong>Cancelaciones:</strong> Para cancelar, hazlo con al menos 2 horas de antelación. Puedes contactarnos por WhatsApp,
                            mediante el formulario de la web o desde tu perfil de usuario.
                        </p>
                    </div>
                    <div className="info-item contact-whatsapp">
                        <a href="https://wa.me/+59899123456" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-whatsapp"></i> Envíanos un WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Renderizar el prompt de registro si es necesario */}
            {showRegisterPrompt && (
                <RegisterPrompt 
                    nombre={nombre}
                    apellido={apellido}
                    celular={celular}
                    navigate={navigate}
                />
            )}
        </section>
    );
};

export default Agendate;