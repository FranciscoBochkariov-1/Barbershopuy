    import React from 'react';
    import { Link } from 'react-router-dom';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faInstagram, faWhatsapp, faTiktok } from '@fortawesome/free-brands-svg-icons';
    import '../CSS/footer.css';

    const Footer = () => {
    return (
        <footer className="footer-section">
        <div className="footer-container">
            {/* Sección de Logo/Nombre */}
            <div className="footer-brand">
            <Link to="/" className="footer-logo">Barbershop</Link>
            <p className="footer-slogan">Más que un corte, una experiencia.</p>
            </div>

            {/* Sección de Navegación */}
            <div className="footer-nav">
            <h4>Navegación</h4>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                <li><Link to="/agendate">Agendate</Link></li>
                <li><Link to="/ubicacion">Ubicación</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
            </ul>
            </div>

            {/* Sección de Redes Sociales */}
            <div className="footer-social">
            <h4>Síguenos</h4>
            <div className="social-links">
                <a href="https://www.instagram.com/kodia.uy?igsh=bXlkcjdubWphMHRy&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} className="social-icon" />
                </a>
                <a href="https://www.tiktok.com/@kodiadev?_t=ZM-8yxeArV61QL&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FontAwesomeIcon icon={faTiktok} className="social-icon" />
                </a>
                <a href="https://api.whatsapp.com/send?phone=123456789" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} className="social-icon" />
                </a>
            </div>
            </div>

            {/* Sección de Contacto (opcional, para dispositivos pequeños) */}
            <div className="footer-contact">
            <h4>Contacto</h4>
            <p>Dirección: 18 de Julio 1250, Paysandú</p>
            <p>Email: kodiaweb@outlook.es</p>
            <p>Teléfono: +598 92 307 450</p>
            </div>
        </div>
        
        {/* Sección de Copyright */}
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Kodia. Todos los derechos reservados.</p>
        </div>
        </footer>
    );
    };

    export default Footer;
