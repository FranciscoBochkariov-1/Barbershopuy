import React from 'react';
import '../CSS/nosotros.css';

const Nosotros = () => {
    return (
        <section
            id="nosotros"
            className="nosotros-section"
            style={{
                color: 'var(--color-white)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: 'var(--spacing-xxl) var(--spacing-lg)',
            }}
        >
            <div className="container">
                <h2 className="nosotros-title animate-on-scroll">
                Sobre Barbershop
                </h2>
                <p className="nosotros-description animate-on-scroll">
                En Barbershop, combinamos la tradición del arte del afeitado y el corte con las últimas tendencias en estilo masculino. Fundada en 2020 con la visión de crear un espacio donde cada cliente se sienta renovado y confiado, nos hemos convertido en un referente en Montevideo por nuestro servicio excepcional y ambiente único. Nuestro equipo de barberos expertos está dedicado a ofrecer una experiencia personalizada, utilizando solo productos de la más alta calidad y técnicas innovadoras. Ven y descubre el arte de la barbería clásica con un toque moderno.
                </p>

                <div className="nosotros-content-grid">
                    {/* Bloque 1: Imagen redonda + Texto a su lado */}
                    <div className="nosotros-image-wrapper image-round animate-on-scroll">
                        <img src="/assets/imagen-nosotros-1.jpg" alt="Equipo de Barbería Kodia" className="nosotros-image" />
                    </div>
                    <div className="nosotros-text-block animate-on-scroll">
                        <h3>Nuestra Filosofía</h3>
                        <p>
                        Creemos que cada corte y afeitado es una oportunidad para realzar tu estilo y personalidad. Nos esforzamos por superar tus expectativas en cada visita, brindándote no solo un servicio de primera, sino también un momento de relajación y cuidado personal en un ambiente distendido y amigable.
                        </p>
                    </div>

                    {/* Bloque 2: Texto a la izquierda + Imagen cuadrada con borde a la derecha */}
                    <div className="nosotros-text-block animate-on-scroll">
                        <h3>Experiencia y Dedicación</h3>
                        <p>
                        Contamos con profesionales apasionados que se mantienen actualizados con las últimas técnicas y tendencias a nivel global. Tu satisfacción es nuestra prioridad, y eso se refleja en cada detalle de nuestro trabajo, desde el primer contacto hasta el último retoque.
                        </p>
                    </div>
                    <div className="nosotros-image-wrapper image-square-border animate-on-scroll">
                        <img src="/assets/hero1.jpg" alt="Barbero realizando un corte" className="nosotros-image" />
                    </div>

                    {/* Bloque 3: Imagen pequeña a la izquierda + Texto a su lado */}
                    <div className="nosotros-image-wrapper image-small-left animate-on-scroll">
                        <img src="/assets/herramientas1.jpg" alt="Herramientas de barbero" className="nosotros-image" />
                    </div>
                    <div className="nosotros-text-block animate-on-scroll">
                        <h3>Productos Premium</h3>
                        <p>
                        Solo utilizamos productos de alta gama de marcas reconocidas internacionalmente que nutren tu cabello y piel, asegurando resultados impecables y duraderos. Porque tu bienestar es tan importante como tu estilo.
                        </p>
                    </div>

                    {/* Bloque 4: Texto a la izquierda + Imagen pequeña a la derecha */}
                    <div className="nosotros-text-block animate-on-scroll">
                        <h3>Ambiente Inigualable</h3>
                        <p>
                        Disfruta de un ambiente cómodo y moderno, diseñado para que te relajes, te desconectes y disfrutes plenamente de tu experiencia en Barbería Kodia. Música, café y una excelente conversación te esperan.
                        </p>
                    </div>
                    <div className="nosotros-image-wrapper image-small-right animate-on-scroll">
                        <img src="/assets/barber.jpg" alt="Interior de la barbería" className="nosotros-image" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Nosotros;
