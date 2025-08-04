import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function PrivacyPolicy() {
  return (
    <div className="container mt-5">
      <h2>Política de Privacidad</h2>
      <p>
        En VACampana, nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información cuando visitas nuestro sitio web <a href="https://vacampana.vercel.app">https://vacampana.vercel.app</a>.
      </p>
      <h4>Recopilación de Datos</h4>
      <p>
        Usamos servicios de terceros como Supabase para autenticación y almacenamiento de datos (noticias e imágenes). También usamos Google AdSense para mostrar anuncios personalizados. Google puede recopilar datos a través de cookies para mejorar tu experiencia publicitaria. Consulta <a href="https://policies.google.com/technologies/partner-sites">Cómo usa Google los datos</a> para más información.
      </p>
      <h4>Uso de Cookies</h4>
      <p>
        Nuestro sitio utiliza cookies de terceros (como Google AdSense) para mostrar anuncios relevantes. Puedes optar por no participar en la personalización de anuncios a través de la <a href="https://www.networkadvertising.org">Network Advertising Initiative</a>.
      </p>
      <h4>Contacto</h4>
      <p>
        Si tenes preguntas sobre esta política, contáctanos en <a href="mailto:admin@vacampana.com">vacampana2025@gmail.com</a>.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
