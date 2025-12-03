import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          UCU Innovators Hub
        </Link>
        <div className="navbar-menu">
          <Link to="/projects" className="navbar-link">Projects</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              {user.role === 'student' && (
                <Link to="/submit-project" className="navbar-link">Submit Project</Link>
              )}
              {(user.role === 'admin' || user.role === 'supervisor') && (
                <Link to="/analytics" className="navbar-link">Analytics</Link>
              )}
              <Link to="/profile" className="navbar-link">Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

