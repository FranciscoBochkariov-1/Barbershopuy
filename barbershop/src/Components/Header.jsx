import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import '../CSS/header.css';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // Nuevo estado para el menú desplegable móvil
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref para el menú desplegable de escritorio
    const mobileDropdownRef = useRef(null); // Nuevo ref para el menú desplegable móvil
    const menuRef = useRef(null); // Ref para el menú móvil
    const location = useLocation();

    const closeMenus = () => {
        setIsDropdownOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        setIsDropdownOpen(false);
        setIsMobileDropdownOpen(false);
    };

    // Unifica la función para alternar los menús desplegables
    const toggleDropdown = (e, isMobile = false) => {
        e.stopPropagation();
        if (isMobile) {
            setIsMobileDropdownOpen(prev => !prev);
            setIsDropdownOpen(false);
        } else {
            setIsDropdownOpen(prev => !prev);
            setIsMobileDropdownOpen(false);
        }
    };
    
    useEffect(() => {
        closeMenus();
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Lógica para cerrar el menú desplegable de escritorio
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.user-icon-button')) {
                setIsDropdownOpen(false);
            }
            
            // Lógica para cerrar el menú desplegable móvil
            if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target) && !event.target.closest('.user-icon-button')) {
                setIsMobileDropdownOpen(false);
            }

            // Lógica para cerrar el menú de hamburguesa
            if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.hamburger-menu')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Dependencias actualizadas para evitar re-renderizado excesivo

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo-neon" onClick={closeMenus}>
                    Barbershop
                </Link>

                {/* --- Navegación principal para escritorio --- */}
                <nav className="main-nav desktop-nav">
                    <ul className="nav-list">
                        <li><NavLink to="/" className="nav-link" onClick={closeMenus}>Inicio <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/nosotros" className="nav-link" onClick={closeMenus}>Nosotros <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/noticias" className="nav-link" onClick={closeMenus}>Noticias <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/agendate" className="nav-link" onClick={closeMenus}>Agendáte <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/ubicacion" className="nav-link" onClick={closeMenus}>Ubicación <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/contacto" className="nav-link" onClick={closeMenus}>Contacto <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                    </ul>
                </nav>

                <div className="auth-area desktop-auth-area">
                    {isAuthenticated ? (
                        <>
                            <button
                                type="button"
                                className="user-icon-button"
                                onClick={(e) => toggleDropdown(e, false)} // Llama a la función unificada
                                aria-expanded={isDropdownOpen ? "true" : "false"}
                                aria-haspopup="true"
                            >
                                <i className="fas fa-user-circle"></i>
                            </button>
                            <div className={`dropdown-menu ${isDropdownOpen ? 'is-open' : ''}`} ref={dropdownRef}>
                                {user && <p className="dropdown-email">{user.email}</p>}
                                <Link to="/mis-turnos" className="dropdown-item" onClick={closeMenus}>
                                    <i className="fas fa-calendar-alt"></i>Mis turnos
                                </Link>
                                <Link to="/perfil" className="dropdown-item" onClick={closeMenus}>
                                    <i className="fas fa-user-alt"></i> Mi Perfil
                                </Link>
                                <button
                                    onClick={() => { logout(); closeMenus(); }}
                                    className="dropdown-item logout-button"
                                >
                                    <i className="fas fa-sign-out-alt"></i>Cerrar sesión
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login" onClick={closeMenus}>
                                <i className="fas fa-sign-in-alt"></i> Login
                            </Link>
                            <Link to="/register" className="btn-register" onClick={closeMenus}>
                                <i className="fas fa-user-plus"></i> Register
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    className={`hamburger-menu ${isMenuOpen ? 'is-open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                {isMenuOpen && <div className="mobile-menu-overlay" onClick={closeMenus}></div>}
                
                <nav className={`main-nav mobile-nav ${isMenuOpen ? 'is-open' : ''}`} ref={menuRef}>
                    <ul className="nav-list">
                        <li><NavLink to="/" className="nav-link" onClick={closeMenus}>Inicio <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/nosotros" className="nav-link" onClick={closeMenus}>Nosotros <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/noticias" className="nav-link" onClick={closeMenus}>Noticias <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/agendate" className="nav-link" onClick={closeMenus}>Agendáte <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/ubicacion" className="nav-link" onClick={closeMenus}>Ubicación <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        <li><NavLink to="/contacto" className="nav-link" onClick={closeMenus}>Contacto <i className="fas fa-scissors scissors-icon"></i></NavLink></li>
                        {/* Se eliminó la duplicación del menú desplegable del perfil aquí */}
                    </ul>

                    {/* Lógica de autenticación en el menú móvil */}
                    <div className="auth-area mobile-auth-area">
                        {isAuthenticated ? (
                            <>
                                <button
                                    type="button"
                                    className="user-icon-button"
                                    onClick={(e) => toggleDropdown(e, true)} // Llama a la función unificada con la bandera móvil
                                    aria-expanded={isMobileDropdownOpen ? "true" : "false"}
                                    aria-haspopup="true"
                                >
                                    <i className="fas fa-user-circle"></i>
                                </button>
                                <div className={`dropdown-menu ${isMobileDropdownOpen ? 'is-open' : ''}`} ref={mobileDropdownRef}>
                                    {user && <p className="dropdown-email">{user.email}</p>}
                                    <Link to="/mis-turnos" className="dropdown-item" onClick={closeMenus}>
                                        <i className="fas fa-calendar-alt"></i>Mis turnos
                                    </Link>
                                    <Link to="/perfil" className="dropdown-item" onClick={closeMenus}>
                                        <i className="fas fa-user-alt"></i> Mi Perfil
                                    </Link>
                                    <button
                                        onClick={() => { logout(); closeMenus(); }}
                                        className="dropdown-item logout-button"
                                    >
                                        <i className="fas fa-sign-out-alt"></i>Cerrar sesión
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-login" onClick={closeMenus}>
                                    <i className="fas fa-sign-in-alt"></i> Login
                                </Link>
                                <Link to="/register" className="btn-register" onClick={closeMenus}>
                                    <i className="fas fa-user-plus"></i> Register
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;