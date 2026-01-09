import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [wishlistCount] = useState(0);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-top-content">
          <div className="header-nav-arrows">
            <button className="nav-arrow">←</button>
            <button className="nav-arrow">→</button>
          </div>
          <div className="header-top-right">
            <button className="wishlist-btn">
              ❤️ Wishlist({wishlistCount})
            </button>
            <button className="login-btn">🔓 Login</button>
          </div>
        </div>
      </div>
      
      <div className="header-main">
        <div className="header-main-content">
          <Link to="/" className="logo">
            <img src="/logo.svg" alt="Sunshine Real Estate" />
            <div className="logo-text">
              <span className="logo-sunshine">Sanjeev</span>
              <span className="logo-real-estate">REAL ESTATE</span>
            </div>
          </Link>
          
          <nav className="main-nav">
            <Link to="/projects">Projects</Link>
            <a href="#properties">Properties</a>
            <a href="#agents">Agents</a>
            <a href="#news">News</a>
            <a href="#careers">Careers</a>
            <Link to="/contact">Contact</Link>
          </nav>
          
          <button className="add-property-btn">
            <span className="plus-icon">+</span> Add Property
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
