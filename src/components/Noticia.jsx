import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { supabase } from '../supabase';

function Noticia() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [noticiasRelacionadas, setNoticiasRelacionadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Asegurar que el id sea un número
      const noticiaId = parseInt(id, 10);

      // Cargar la noticia actual
      const { data: noticiaData, error: noticiaError } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', noticiaId)
        .single();
      if (noticiaError) {
        console.error('Error al cargar la noticia:', noticiaError);
        setLoading(false);
        return;
      }
      setNoticia(noticiaData);

      // Cargar 3 noticias relacionadas (recientes, simulando aleatoriedad)
      const { data: allNoticias, error: relacionadasError } = await supabase
        .from('noticias')
        .select('*')
        .neq('id', noticiaId)
        .order('created_at', { ascending: false });
      if (relacionadasError) {
        console.error('Error al cargar noticias relacionadas:', relacionadasError);
        setNoticiasRelacionadas([]);
      } else {
        // Simular aleatoriedad seleccionando 3 noticias al azar
        const shuffled = allNoticias.sort(() => 0.5 - Math.random());
        setNoticiasRelacionadas(shuffled.slice(0, 3));
      }

      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Cargando noticia...</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="container mt-5">
        <p>Noticia no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{noticia.titulo}</h1>
      {noticia.imagen_url ? (
        <img
          src={noticia.imagen_url}
          className="img-fluid mb-4"
          alt={noticia.titulo}
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      ) : (
        <div
          className="bg-secondary mb-4"
          style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="text-white">Sin imagen</span>
        </div>
      )}
      <p className="text-muted mb-3">
        Publicado el {new Date(noticia.created_at).toLocaleDateString()} | Sección:{' '}
        <span className="text-capitalize">{noticia.seccion}</span>
      </p>
      <div className="card mb-4">
        <div className="card-body">
          <p className="card-text">{noticia.contenido}</p>
        </div>
      </div>

      <h3 className="mb-4">Noticias Relacionadas</h3>
      {noticiasRelacionadas.length === 0 ? (
        <p>No hay noticias relacionadas disponibles.</p>
      ) : (
        <div className="row">
          {noticiasRelacionadas.map((relacionada) => (
            <div className="col-md-4 mb-4" key={relacionada.id}>
              <NavLink to={`/noticia/${relacionada.id}`} className="text-decoration-none">
                <div className="card h-100">
                  {relacionada.imagen_url ? (
                    <img
                      src={relacionada.imagen_url}
                      className="card-img-top"
                      alt={relacionada.titulo}
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
                    <h5 className="card-title">{relacionada.titulo}</h5>
                    <p className="card-text">
                      {relacionada.contenido.substring(0, 100)}...
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        Publicado el {new Date(relacionada.created_at).toLocaleDateString()}
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

export default Noticia;
