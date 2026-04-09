import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/file_000000001b5072088ef1791356e73429.png';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-component">
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <div className="footer-logo">
              <img src={logo} alt="Basera Infra Home" />
              <div className="footer-logo-text">
                <span className="footer-logo-sunshine">BASERA</span>
                <span className="footer-logo-real-estate">INFRA HOME</span>
              </div>
            </div>
          <p className="footer-description">
            Your trusted partner in finding the perfect home. We specialize in premium residential properties and commercial projects across the region.
          </p>
          <div className="footer-contact">
            <p className="footer-address">
              <span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle'}}>location_on</span> Vishveshwarya Group of institutions GT Road Dadri
            </p>
            <p className="footer-phone">
              <span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle'}}>call</span> Hotline: <a href="tel:+919990131976">+91 99901 31976</a>
            </p>
            <p className="footer-email">
              ✉ Email:{' '}
              <a href="mailto:BHATIH981@GMAIL.COM">
                BHATIH981@GMAIL.COM
              </a>
            </p>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">QUICK LINKS</h3>
          <ul className="footer-links">
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
            <li><Link to="/news">News & Updates</Link></li>
            <li><Link to="/wishlist">My Wishlist</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">SERVICES</h3>
          <ul className="footer-links">
            <li><span className="footer-service-item">Property Consultation</span></li>
            <li><span className="footer-service-item">Site Visits</span></li>
            <li><span className="footer-service-item">Investment Advisory</span></li>
            <li><span className="footer-service-item">Legal Assistance</span></li>
            <li><span className="footer-service-item">Home Loans</span></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">BUSINESS HOURS</h3>
          <div className="footer-hours">
            <p><strong>Monday - Saturday</strong></p>
            <p className="hours-time">9:00 AM - 7:00 PM</p>
            <p><strong>Sunday</strong></p>
            <p className="hours-time">10:00 AM - 5:00 PM</p>
          </div>
          <div className="footer-social">
            <h4 className="social-heading">Follow Us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1EF8ubiHH5/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <span className="social-icon">f</span>
              </a>
              <a href="https://www.instagram.com/baserainfrahome?igsh=dXQybmV2MHpsNmY4" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
              <a
                className="youtube-link"
                href="https://youtube.com/@baserainfrahome?si=T3GNEPJ-14uQ73QK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <span className="material-symbols-outlined social-icon youtube-icon">smart_display</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2026 Basera Infra Home. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/about-us">About Us</Link>
            <span className="separator">•</span>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
      </footer>
    </div>
  );
};

export default Footer;
