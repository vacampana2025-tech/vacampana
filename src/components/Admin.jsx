import { useState, useEffect } from 'react';
        import { supabase } from '../supabase';
        import { useNavigate } from 'react-router-dom';
        import 'bootstrap/dist/css/bootstrap.min.css';

        function Admin() {
          const [titulo, setTitulo] = useState('');
          const [contenido, setContenido] = useState('');
          const [imagen, setImagen] = useState(null);
          const [seccion, setSeccion] = useState('actualidad');
          const [noticias, setNoticias] = useState([]);
          const [error, setError] = useState(null);
          const [loading, setLoading] = useState(false);
          const navigate = useNavigate();

          useEffect(() => {
            // Verificar autenticación
            const checkAuth = async () => {
              const { data: { session }, error } = await supabase.auth.getSession();
              if (error || !session) {
                console.log('No autenticado:', error?.message || 'No session');
                navigate('/login');
              }
            };
            checkAuth();

            // Cargar noticias
            const fetchNoticias = async () => {
              const { data, error } = await supabase
                .from('noticias')
                .select('id, titulo, contenido, seccion, created_at, imagen_url')
                .order('created_at', { ascending: false });
              if (error) {
                console.log('Error al cargar noticias:', error.message);
                setError(error.message);
              } else {
                setNoticias(data || []);
              }
            };
            fetchNoticias();
          }, [navigate]);

          const handleSubmit = async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);

            let imagenUrl = null;
            if (imagen) {
              const fileExt = imagen.name.split('.').pop();
              const fileName = `noticia-${Date.now()}.${fileExt}`;
              const { error: uploadError } = await supabase.storage
                .from('noticias-imagenes')
                .upload(fileName, imagen, {
                  cacheControl: '3600',
                  upsert: false,
                });
              if (uploadError) {
                console.log('Error al subir imagen:', uploadError.message);
                setError(`No se pudo subir la imagen: ${uploadError.message}`);
                setLoading(false);
                return;
              }
              const { data: urlData } = supabase.storage
                .from('noticias-imagenes')
                .getPublicUrl(fileName);
              if (!urlData.publicUrl) {
                console.log('Error: No se pudo obtener la URL de la imagen');
                setError('No se pudo obtener la URL de la imagen');
                setLoading(false);
                return;
              }
              imagenUrl = urlData.publicUrl;
            }

            const { error } = await supabase.from('noticias').insert([
              {
                titulo,
                contenido,
                seccion,
                created_at: new Date().toISOString(),
                imagen_url: imagenUrl,
              },
            ]);
            if (error) {
              console.log('Error al publicar noticia:', error.message);
              setError(`No se pudo publicar la noticia: ${error.message}`);
            } else {
              console.log('Noticia publicada con éxito');
              alert('Noticia publicada con éxito');
              setTitulo('');
              setContenido('');
              setImagen(null);
              setSeccion('actualidad');
              document.getElementById('imagen').value = '';
              const { data } = await supabase
                .from('noticias')
                .select('id, titulo, contenido, seccion, created_at, imagen_url')
                .order('created_at', { ascending: false });
              setNoticias(data || []);
            }
            setLoading(false);
          };

          const handleDelete = async (id) => {
            setError(null);
            setLoading(true);
            const { error } = await supabase.from('noticias').delete().eq('id', id);
            if (error) {
              console.log('Error al eliminar noticia:', error.message);
              setError(`No se pudo eliminar la noticia: ${error.message}`);
            } else {
              console.log('Noticia eliminada con éxito');
              alert('Noticia eliminada con éxito');
              const { data } = await supabase
                .from('noticias')
                .select('id, titulo, contenido, seccion, created_at, imagen_url')
                .order('created_at', { ascending: false });
              setNoticias(data || []);
            }
            setLoading(false);
          };

          return (
            <div className="container mt-5">
              <h2>Panel de Administración</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {loading && <div className="alert alert-info">Procesando...</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="titulo" className="form-label">
                    Título
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contenido" className="form-label">
                    Contenido
                  </label>
                  <textarea
                    className="form-control"
                    id="contenido"
                    rows="5"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                    disabled={loading}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="imagen" className="form-label">
                    Imagen (opcional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imagen"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="seccion" className="form-label">
                    Sección
                  </label>
                  <select
                    className="form-select"
                    id="seccion"
                    value={seccion}
                    onChange={(e) => setSeccion(e.target.value)}
                    disabled={loading}
                  >
                    <option value="actualidad">Actualidad</option>
                    <option value="opinion">Opinión</option>
                    <option value="deporte">Deporte</option>
                    <option value="clima">Clima</option>
                    <option value="internacionales">Internacionales</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar Noticia'}
                </button>
              </form>
              <h3 className="mt-5">Noticias Publicadas</h3>
              {noticias.length === 0 ? (
                <p>No hay noticias publicadas.</p>
              ) : (
                <div className="row">
                  {noticias.map((noticia) => (
                    <div className="col-md-4 mb-4" key={noticia.id}>
                      <div className="card h-100">
                        {noticia.imagen_url && (
                          <img
                            src={noticia.imagen_url}
                            className="card-img-top"
                            alt={noticia.titulo || 'Noticia'}
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body">
                          <h5 className="card-title">{noticia.titulo || 'Sin título'}</h5>
                          <p className="card-text">
                            {noticia.contenido ? noticia.contenido.substring(0, 100) + '...' : 'Sin contenido'}
                          </p>
                          <p className="card-text">
                            <small className="text-muted">
                              Publicado el{' '}
                              {noticia.created_at
                                ? new Date(noticia.created_at).toLocaleDateString()
                                : 'Sin fecha'}
                            </small>
                          </p>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(noticia.id)}
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        export default Admin;
        