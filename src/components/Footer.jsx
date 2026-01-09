import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="footer-logo">
            <img src="/logo.svg" alt="Sunshine Real Estate" />
            <div className="footer-logo-text">
              <span className="footer-logo-sunshine">SUNSHINE</span>
              <span className="footer-logo-real-estate">REAL ESTATE</span>
            </div>
          </div>
          <div className="footer-contact">
            <p className="footer-address">
              📍 2A,54/13 Awas Vikas 1st DM Road
            </p>
            <p className="footer-phone">
              📞 Hotline: <a href="tel:9720444418">9720444418</a>
            </p>
            <p className="footer-email">
              ✉ Email:{' '}
              <a href="mailto:harshsingh08.hs@gmail.com">
                harshsingh08.hs@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">ABOUT</h3>
          <ul className="footer-links">
            <li><a href="#about">About us</a></li>
            <li><a href="#contact">Contact us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">MORE INFORMATION</h3>
          <ul className="footer-links">
            <li><a href="#projects">All projects</a></li>
            <li><a href="#properties">All properties</a></li>
            <li><a href="#sale">Houses for sale</a></li>
            <li><a href="#rent">Houses for rent</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">NEWS</h3>
          <ul className="footer-links">
            <li><a href="#news">Latest news</a></li>
            <li><a href="#architecture">House architecture</a></li>
            <li><a href="#design">House design</a></li>
            <li><a href="#materials">Building materials</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Sunshine Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
