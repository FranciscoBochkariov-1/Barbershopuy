    import React from 'react';
    import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import '../CSS/ubicacion.css';

    // Coordenadas de la ubicación ficticia en el centro de Paysandú, Uruguay
    const LOCATION_COORDS = [-32.3171, -58.08072];
    const MAP_ZOOM = 15;

    // Configuración del icono del marcador para que se muestre correctamente
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const Ubicacion = () => {
    return (
        <section id="ubicacion" className="ubicacion-section">
        <h2 className="section-title">Nuestra Ubicación</h2>
        <p className="section-subtitle">Encuéntranos fácilmente y visita nuestra barbería.</p>
        
        <div className="ubicacion-content">
            <div className="map-container">
            <MapContainer center={LOCATION_COORDS} zoom={MAP_ZOOM} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={LOCATION_COORDS}>
                <Popup>
                    ¡Aquí estamos! Te esperamos para un corte.
                </Popup>
                </Marker>
            </MapContainer>
            </div>
            
            <div className="ubicacion-info">
            <h3>Detalles de Contacto</h3>
            <p>
                Nos encontramos en el corazón de Paysandú, en una zona de fácil acceso.
                Ven y disfruta de la mejor experiencia de barbería de la ciudad.
            </p>
            <div className="info-details">
                <p><strong>Dirección:</strong> 18 de Julio 1250</p>
                <p><strong>Ciudad:</strong> Paysandú</p>
                <p><strong>País:</strong> Uruguay</p>
            </div>
            </div>
        </div>
        </section>
    );
    };

    export default Ubicacion;