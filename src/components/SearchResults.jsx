import { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { supabase } from '../supabase';

function SearchResults() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .or(`titulo.ilike.%${query}%,contenido.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error al buscar noticias:', error);
        setNoticias([]);
      } else {
        setNoticias(data);
      }
      setLoading(false);
    }
    if (query) {
      fetchSearchResults();
    } else {
      setNoticias([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="container mt-5">
      <h2>Resultados de búsqueda para "{query}"</h2>
      {loading ? (
        <p>Cargando resultados...</p>
      ) : noticias.length === 0 ? (
        <p>No se encontraron noticias.</p>
      ) : (
        <div className="row">
          {noticias.map((noticia) => (
            <div className="col-md-4 mb-4" key={noticia.id}>
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
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
