import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [wishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      // Only apply scroll behavior on desktop (width > 768px)
      if (window.innerWidth <= 768) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      
      // Show navbar when at top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    window.addEventListener('resize', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
      window.removeEventListener('resize', controlNavbar);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isVisible ? 'visible' : 'hidden'}`}>
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
          
          <button 
            className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className="main-nav">
            <Link to="/projects">Projects</Link>
            <Link to="/properties">Properties</Link>
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={closeMobileMenu}></div>
          <div className="mobile-menu-panel">
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button className="close-btn" onClick={closeMobileMenu}>✕</button>
            </div>
            <nav className="mobile-nav">
              <Link to="/projects" onClick={closeMobileMenu}>Projects</Link>
              <Link to="/properties" onClick={closeMobileMenu}>Properties</Link>
              <a href="#agents" onClick={closeMobileMenu}>Agents</a>
              <a href="#news" onClick={closeMobileMenu}>News</a>
              <a href="#careers" onClick={closeMobileMenu}>Careers</a>
              <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
            </nav>
            <button className="mobile-add-property-btn" onClick={closeMobileMenu}>
              <span className="plus-icon">+</span> Add Property
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
