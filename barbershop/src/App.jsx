// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Importa componentes de Components
import Header from './Components/Header.jsx';
import Hero from './Components/Hero.jsx';
import Nosotros from './Components/Nosotros.jsx';
import Agendate from './Components/Agendate.jsx';
import Noticias from './Components/Noticias.jsx';
import Ubicacion from './Components/Ubicacion.jsx';
import Contacto from './Components/Contacto.jsx';
import Footer from './Components/Footer.jsx';

// Importa componentes de Pages
import LoginPage from './Pages/Login.jsx';
import RegisterPage from './Pages/Register.jsx';
import ResetPasswordConfirmPage from './Pages/ResetPasswordConfirmPage.jsx';
import MisTurnosPage from './Pages/MisTurnos.jsx'; // Importa la página de Mis Turnos
import Perfil from './Pages/Perfil.jsx'; // Importa la página de Perfil


// Importa el AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';


/**
 * Componente Wrapper para aplicar animaciones de scroll-reveal a los elementos hijos.
 * Los elementos que deben animarse necesitan las clases 'scroll-reveal' y 'animate-on-scroll'.
 * Cuando entran en el viewport, se les añade la clase 'is-visible'.
 */
const ScrollRevealWrapper = ({ children }) => {
    const location = useLocation(); // Hook para detectar cambios de ruta

    useEffect(() => {
        const checkVisibility = () => {
            // Selecciona solo los elementos dentro del scroll-reveal que tienen la clase de animación
            const elements = document.querySelectorAll('.scroll-reveal .animate-on-scroll');
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

                if (rect.top <= viewportHeight * 0.85 && rect.bottom >= 0) {
                    element.classList.add('is-visible');
                } else {
                    // Opcional: remover la clase si el elemento sale del viewport.
                    // element.classList.remove('is-visible');
                }
            });
        };

        const resetAnimations = () => {
            const elements = document.querySelectorAll('.scroll-reveal .animate-on-scroll');
            elements.forEach(element => {
                element.classList.remove('is-visible'); // Quita la clase de visibilidad
            });
            // Vuelve a verificar y aplica animaciones a los que ya estén visibles
            checkVisibility();
        };

        window.addEventListener('scroll', checkVisibility);
        const timer = setTimeout(resetAnimations, 100);

        return () => {
            window.removeEventListener('scroll', checkVisibility);
            clearTimeout(timer);
        };
    }, [location]);

    return <div className="scroll-reveal">{children}</div>;
};


const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <main>
                    <Routes>
                        {/* La ruta de inicio que renderizará el componente Home
                            Incluye todas las secciones de la página principal dentro del wrapper de animación. */}
                        <Route path="/" element={
                            <ScrollRevealWrapper>
                                <Hero />
                                <Nosotros />
                                <Agendate />
                                <Noticias />
                                <Ubicacion />
                                <Contacto />
                            </ScrollRevealWrapper>
                        } />
                        
                        {/* Rutas para páginas dedicadas que no usan el wrapper de scroll-reveal */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirmPage />} />
                        
                        {/* Rutas para las páginas de Mis Turnos, Perfil y Agendar */}
                        <Route path="/mis-turnos" element={<MisTurnosPage />} />
                        <Route path="/perfil" element={<Perfil />} />
                        
                        
                        {/* Rutas individuales para cada sección con su propio ScrollRevealWrapper */}
                        <Route path="/nosotros" element={<ScrollRevealWrapper><Nosotros /></ScrollRevealWrapper>} />
                        <Route path="/agendate" element={<ScrollRevealWrapper><Agendate /></ScrollRevealWrapper>} />
                        <Route path="/noticias" element={<ScrollRevealWrapper><Noticias /></ScrollRevealWrapper>} />
                        <Route path="/ubicacion" element={<ScrollRevealWrapper><Ubicacion /></ScrollRevealWrapper>} />
                        <Route path="/contacto" element={<ScrollRevealWrapper><Contacto /></ScrollRevealWrapper>} />
                    </Routes>
                </main>
                <Footer />
            </AuthProvider>
        </Router>
    );
};

export default App;
