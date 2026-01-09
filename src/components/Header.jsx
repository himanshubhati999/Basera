import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [wishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      setIsMobileMenuOpen(true);
      setIsClosing(false);
    }
  };

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

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
          
          <button className="hamburger-btn" onClick={toggleMobileMenu}>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>

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

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
            <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
            <div className="mobile-menu-content">
              <button className="close-mobile-menu" onClick={closeMobileMenu}>✕</button>
              <nav className="mobile-nav">
                <Link to="/projects" onClick={closeMobileMenu}>Projects</Link>
                <a href="#properties" onClick={closeMobileMenu}>Properties</a>
                <a href="#agents" onClick={closeMobileMenu}>Agents</a>
                <a href="#news" onClick={closeMobileMenu}>News</a>
                <a href="#careers" onClick={closeMobileMenu}>Careers</a>
                <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
                <button className="mobile-add-property-btn">
                  <span className="plus-icon">+</span> Add Property
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
