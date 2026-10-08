import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const leave = () => { logout(); closeMenu(); navigate('/'); };

  // Never render the legacy global navbar or footer on login, register, or farmer dashboard
  const isAuthOrDashboard = location.pathname.startsWith('/dashboard') || 
                            location.pathname === '/login' || 
                            location.pathname === '/register' || 
                            user?.role === 'farmer';
  if (isAuthOrDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark agro-nav">
        <div className="container">
          <Link className="navbar-brand auth-logo" to="/" onClick={closeMenu}>
            <span className="auth-logo-yellow">Agri</span><span className="auth-logo-white">Connect</span>
          </Link>
          <button className="navbar-toggler" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <div className="navbar-nav ms-auto">
              <NavLink className="nav-link" to="/fertilizers" onClick={closeMenu}>Fertilizer Prices</NavLink>
              <NavLink className="nav-link" to="/schemes" onClick={closeMenu}>Govt Schemes</NavLink>
              {user ? (
                <>
                  {user.role === 'admin' && <NavLink className="nav-link" to="/admin" onClick={closeMenu}>Admin</NavLink>}
                  <NavLink className="nav-link" to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
                  <span className="nav-link d-none d-lg-inline text-white-50">Hi, {user.name}</span>
                  <button className="btn btn-sm btn-light ms-lg-2" onClick={leave}>Log out</button>
                </>
              ) : (
                <>
                  <NavLink className="nav-link" to="/login" onClick={closeMenu}>Sign in</NavLink>
                  <NavLink className="btn btn-sm btn-warning ms-lg-2" to="/register" onClick={closeMenu}>Get started</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {children}
      <footer>© 2026 AgriConnect — Integrated Agriculture Platform</footer>
    </>
  );
}
