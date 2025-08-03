import { useState } from 'react';
        import { supabase } from '../supabase';
        import { useNavigate } from 'react-router-dom';

        function Login() {
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');
          const [error, setError] = useState(null);
          const [loading, setLoading] = useState(false);
          const navigate = useNavigate();

          const handleLogin = async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              if (error) {
                console.error('Error al iniciar sesión:', error.message);
                setError(error.message);
              } else {
                console.log('Inicio de sesión exitoso:', data.user.email);
                navigate('/admin');
              }
            } catch (err) {
              console.error('Excepción al iniciar sesión:', err.message);
              setError('Error inesperado al iniciar sesión');
            }
            setLoading(false);
          };

          return (
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <h2>Iniciar Sesión</h2>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {loading && <div className="alert alert-info">Iniciando sesión...</div>}
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        }

        export default Login;
        