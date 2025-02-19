import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {isHomepage ? (
          <>
          <div className="navbar-logo">
          <Link to="/">ProjectTracker</Link>
        </div>
            <ul className="navbar-links">
              <li><a href="#about">About</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
            <div className="navbar-signup">
              <Link to="/signup-login" className="signup-btn">Sign Up / Login</Link>
            </div>
          </>
        ) : (
          <div className="navbar-home">
            <Link to="/" className="home-btn">Home</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
