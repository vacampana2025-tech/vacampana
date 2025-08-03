import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../supabase';

function Home() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    async function fetchNoticias() {
      const { data, error } = await supabase.from('noticias').select('*').limit(12);
      if (error) {
        console.error('Error al cargar noticias:', error);
        return;
      }
      setNoticias(data);
    }
    fetchNoticias();
  }, []);

  return (
    <div className="container mt-5">
      <h1>VACampana - Voz Adolescente Campana</h1>
      <h2 className="mb-4">Últimas Noticias</h2>
      <div className="row">
        {noticias.length === 0 ? (
          <p>No hay noticias disponibles.</p>
        ) : (
          noticias.map((noticia) => (
            <div className="col-md-3 mb-4" key={noticia.id}>
              <NavLink to={`/noticia/${noticia.id}`} className="text-decoration-none">
                <div className="card h-100">
                  {noticia.imagen_url ? (
                    <img
                      src={noticia.imagen_url}
                      className="card-img-top"
                      alt={noticia.titulo}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="card-img-top bg-secondary"
                      style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <span className="text-white">Sin imagen</span>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{noticia.titulo}</h5>
                    <p className="card-text">
                      {noticia.contenido.substring(0, 100)}...
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        Publicado el {new Date(noticia.created_at).toLocaleDateString()}
                      </small>
                    </p>
                  </div>
                </div>
              </NavLink>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
