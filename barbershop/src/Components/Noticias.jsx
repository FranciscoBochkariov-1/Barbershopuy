import React, { useState, useEffect, useCallback } from 'react';
import '../CSS/noticias.css'; // Importa el CSS para esta sección

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Usamos useCallback para memoizar la función y evitar su recreación innecesaria
    const fetchNoticias = useCallback(async () => {
        setLoading(true);
        setError(null);
        setIsRefreshing(true);

        // API_URL actualizada para el despliegue
        const API_URL = 'https://barberia-backend-tl1f.onrender.com/api/noticias/'; 

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNoticias(data);
            console.log("Datos de noticias recibidos:", data);
        } catch (err) {
            setError(err);
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNoticias();
    }, [fetchNoticias]);

    const formatDate = (dateString) => {
        try {
            if (!dateString) {
                return "Fecha no disponible";
            }
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Fecha inválida";
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('es-ES', options);
        } catch (e) {
            console.error("Error al formatear la fecha:", e);
            return "Fecha desconocida";
        }
    };

    const handleRefresh = () => {
        fetchNoticias();
    };

    return (
        <section id="noticias" className="noticias-section">
            <div className="noticias-header">
                <h2 className="section-title">Últimas Noticias y Promociones</h2>
                <p className="section-subtitle">Mantente al día con Barbershop</p>
                {/* Botón de actualizar */}
                <button
                    className="refresh-button"
                    onClick={handleRefresh}
                    disabled={loading || isRefreshing}
                >
                    {isRefreshing ? 'Actualizando...' : <><i className="fas fa-sync-alt"></i> Actualizar Noticias</>}
                </button>
            </div>

            <div className="noticias-main-content">
                {loading && !isRefreshing ? (
                    <div className="noticias-loading">Cargando noticias...</div>
                ) : error ? (
                    <div className="noticias-error">Error al cargar las noticias: {error.message}</div>
                ) : noticias.length > 0 ? (
                    <div className="noticias-grid">
                        {noticias.map((noticia) => (
                            <article key={noticia.id} className="noticia-card">
                                <div className="noticia-image-container">
                                    {noticia.imagen ? (
                                        <img
                                            src={noticia.imagen}
                                            alt={noticia.titulo}
                                            className="noticia-image"
                                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/333333?text=Imagen+no+disponible" }}
                                        />
                                    ) : (
                                        <div className="noticia-no-image">No hay contenido multimedia</div>
                                    )}
                                </div>
                                <div className="noticia-content">
                                    <h3 className="noticia-title">{noticia.titulo}</h3>
                                    {noticia.descripcion_breve && (
                                        <p className="noticia-description-card">{noticia.descripcion_breve}</p>
                                    )}
                                    <p className="noticia-date">
                                        <i className="fas fa-calendar-alt"></i> {formatDate(noticia.fecha_creacion)}
                                    </p>
                                    {noticia.enlace && (
                                        <a href={noticia.enlace} target="_blank" rel="noopener noreferrer" className="noticia-read-more">
                                            Ver más <i className="fas fa-arrow-right"></i>
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="noticias-no-content">No hay noticias disponibles en este momento.</div>
                )}
            </div>
        </section>
    );
};

export default Noticias;