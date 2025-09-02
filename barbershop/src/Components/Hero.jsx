    import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import '../CSS/hero.css'; // ¡Importa el nuevo archivo CSS!

    // Array de rutas de imágenes para el carrusel de fondo.
    // Asegúrate de que estas rutas sean correctas para tus archivos.
    const heroImages = [
    '/hero1.jpg',
    '/hero2.jpg',
    '/hero3.jpg',
    '/hero4.jpg',
    ];

    const HeroSection = () => {
    // Estado para controlar qué imagen se muestra actualmente.
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // useEffect para manejar el cambio automático de imagen del carrusel.
    useEffect(() => {
        // Establece un temporizador que cambia la imagen cada 5 segundos.
        const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % heroImages.length
        );
        }, 5000); // Cambia la imagen cada 5000ms (5 segundos).

        // Función de limpieza para detener el temporizador cuando el componente se desmonte.
        // Esto es crucial para evitar pérdidas de memoria.
        return () => clearInterval(intervalId);
    }, []); // El array de dependencia vacío asegura que el efecto se ejecute solo una vez.

    return (
        <section id="hero" className="hero-section">
        {/* Carrusel de imágenes de fondo. Cada imagen se renderiza en un div
            con su propio estilo de fondo y su clase para la transición.
        */}
        {heroImages.map((image, index) => (
            <div
            key={image}
            className={`hero-background ${currentImageIndex === index ? 'visible' : 'hidden'}`}
            style={{ backgroundImage: `url(${image})` }}
            />
        ))}
        
        {/* Contenedor del contenido principal. Se superpone sobre las imágenes. */}
        <div className="hero-overlay">
            <div className="hero-content">
            <h1 className="hero-title">Estilo y Tradición</h1>
            <p className="hero-subtitle">
                Cortes clásicos, barbas perfectas y un ambiente único para el hombre moderno.
            </p>
            <div className="hero-buttons">
                {/* Botón para agendar un turno */}
                <Link to="/agendate" className="hero-button primary">
                Agenda tu Cita
                </Link>
                
                {/* Botón para ver los servicios */}
                <Link to="/Contacto" className="hero-button secondary">
                Contactanos
                </Link>
            </div>
            </div>
        </div>
        </section>
    );
    };

    export default HeroSection;
