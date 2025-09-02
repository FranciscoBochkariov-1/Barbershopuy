    import React from 'react';
    import '../CSS/contacto.css';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faInstagram, faWhatsapp, faTiktok } from '@fortawesome/free-brands-svg-icons';
    import { faCut } from '@fortawesome/free-solid-svg-icons';

    const Contacto = () => {
    return (
        <section id="contacto" className="contacto-section">
        <div className="contacto-header">
            <h2 className="section-title">Contáctanos <FontAwesomeIcon icon={faCut} className="tijera-icon" /></h2>
            <p className="section-subtitle">¡Agenda tu cita o escríbenos!</p>
        </div>
        
        <div className="contacto-container">
            
            <div className="redes-sociales-container">
            <h3>Síguenos y Conéctate</h3>
            <p>Estamos en todas las redes para que no te pierdas nada. ¡Echa un vistazo a nuestro trabajo!</p>
            <div className="social-icons">
                <a href="https://www.instagram.com/kodia.uy?igsh=bXlkcjdubWphMHRy&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} className="icon-instagram" />
                </a>
                <a href="https://www.tiktok.com/@kodiadev?_t=ZM-8yxeArV61QL&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FontAwesomeIcon icon={faTiktok} className="icon-tiktok" />
                </a>
                <a href="https://api.whatsapp.com/send?phone=123456789" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} className="icon-whatsapp" />
                </a>
            </div>
            </div>

            <div className="formulario-container">
            <h3>Envíanos un Mensaje</h3>
            <form action="https://getform.io/f/ajjogova" method="POST" className="contacto-form">
                <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" required />
                </div>
                <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea id="mensaje" name="mensaje" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-btn">Enviar Mensaje</button>
            </form>
            </div>

        </div>
        </section>
    );
    };

    export default Contacto;
