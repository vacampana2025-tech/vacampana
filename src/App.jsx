import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { supabase } from './supabase';
import { useEffect, useState } from 'react';
import Home from './components/Home';
import NewsSection from './components/NewsSection';
import Noticia from './components/Noticia';
import Admin from './components/Admin';
import SearchResults from './components/SearchResults';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar sesión inicial
    async function checkSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error al verificar sesión:', error.message);
        }
        setUser(session?.user || null);
      } catch (err) {
        console.error('Excepción al verificar sesión:', err.message);
      }
    }
    checkSession();

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session?.user?.email || 'null');
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
      }
      setUser(null);
    } catch (err) {
      console.error('Excepción al cerrar sesión:', err.message);
    }
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            VACampana
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/opinion">
                  Opinión
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/deporte">
                  Deporte
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/actualidad">
                  Actualidad
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/clima">
                  Clima
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/internacionales">
                  Internacionales
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/privacy">
                  Política de Privacidad
                </NavLink>
              </li>
              {!user && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Iniciar Sesión
                  </NavLink>
                </li>
              )}
              {user && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
            <div className="d-flex align-items-center">
              <SearchBar />
              {user && (
                <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:section" element={<NewsSection />} />
        <Route path="/noticia/:id" element={<Noticia />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/buscar" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
