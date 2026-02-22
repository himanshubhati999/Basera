import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import AuthModal from './AuthModal';
import SearchBar from './SearchBar';
import './Header.css';
import './ButtonGlare.css';

const logo = '/IMG_6870.PNG';

const Header = () => {
  const { user, logout, wishlist } = useAuth();
  const { selectedCategory, setSelectedCategory } = useCategory();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const headlines = [
    'Join Us for Exclusive Open House Events This Weekend and Find Your Perfect Home!',
    'Discover Your Dream Home with Our Latest Listings and Personalized Services!',
    'Take Advantage of Limited-Time Offers on Luxury Homes with Stunning Features!',
    'Explore Our Exciting New Property Listings Now Available in Prime Locations!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % headlines.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [headlines.length]);

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

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    closeMobileMenu();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + headlines.length) % headlines.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % headlines.length);
  };

  return (
    <div className="header-component">
      <header className={`header ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="header-top">
          <div className="header-top-content">
            <div className="header-nav-arrows">
              <button className="nav-arrow btn-glare" onClick={handlePrevSlide}>←</button>
              <button className="nav-arrow btn-glare" onClick={handleNextSlide}>→</button>
              <div className="header-headline">{headlines[currentSlide]}</div>
            {user ? (
              <div className="user-menu-container ">
                <button 
                  className="user-btn btn-glare" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  👤 {user.name}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                      👤 Profile
                    </Link>
                    <Link to="/wishlist" onClick={() => setShowUserMenu(false)}>
                      <span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle'}}>favorite</span> My Wishlist
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={() => setShowUserMenu(false)}>
                        🔐 Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout}>
                      🚪 Logout
                    </button>
                    
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"  className="login-btn btn-glare ">🔓 Login</Link>
            )}
          </div>
          <div className="header-top-right">
            <Link to="/wishlist" className="wishlist-btn btn-glare">
              <span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle'}}>favorite</span> Wishlist({wishlist?.length || 0})
            </Link>
            
          </div>
        </div>
      </div>
      
      <div className="header-main">
        <div className="header-main-content">
          <Link to="/" className="logo">
            <img src={logo} alt="Basera Infra Home" />
          </Link>
          
          {isHomePage && (
            <div className="header-search-wrapper">
              <SearchBar 
                compact={true} 
                onCategoryChange={setSelectedCategory} 
                selectedCategory={selectedCategory}
                onHomePage={true}
              />
            </div>
          )}
          
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
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/properties">Properties</Link>
            <Link to="/maps">Maps</Link>
            <Link to="/news">News</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={closeMobileMenu}></div>
          <div className="mobile-menu-panel">
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button className="close-btn btn-glare" onClick={closeMobileMenu}><span className="material-symbols-outlined">close</span></button>
            </div>
            <nav className="mobile-nav">
              <Link to="/" onClick={closeMobileMenu}>Home</Link>
              <Link to="/projects" onClick={closeMobileMenu}>Projects</Link>
              <Link to="/properties" onClick={closeMobileMenu}>Properties</Link>
              <Link to="/maps" onClick={closeMobileMenu}>Maps</Link>
              <Link to="/news" onClick={closeMobileMenu}>News</Link>
              <Link to="/careers" onClick={closeMobileMenu}>Careers</Link>
              <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
              <div className="mobile-divider"></div>
              {user ? (
                <>
                  <Link to="/wishlist" onClick={closeMobileMenu}>❤️ Wishlist ({wishlist?.length || 0})</Link>
                  {/* <Link to="/profile" onClick={closeMobileMenu}>👤 Profile</Link> */}
                  {/* <Link to="/my-properties" onClick={closeMobileMenu}>🏠 My Properties</Link> */}
                  {/* <Link to="/post-property" onClick={closeMobileMenu}>➕ Post Property</Link> */}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={closeMobileMenu}>🔐 Admin Dashboard</Link>
                  )}
                  {/* <Link to="/settings" onClick={closeMobileMenu}>⚙️ Settings</Link> */}
                  <button className="mobile-logout-btn" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/wishlist" onClick={closeMobileMenu}>❤️ Wishlist ({wishlist?.length || 0})</Link>
                  <Link to="/login" onClick={closeMobileMenu}>🔓 Login</Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </header>
    </div>
  );
};

export default Header;
