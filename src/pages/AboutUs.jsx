import React from 'react';
import './LegalPages.css';

const AboutUs = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">About Us</h1>
        <p className="legal-subtitle">Basera Infra Home – Your Trusted Real Estate Partner</p>

        <div className="legal-content">
          <section className="legal-section">
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong>Basera Infra Home</strong> is a trusted real estate company with years of experience in the 
              property market of Greater Noida. We specialize in residential and investment properties, offering 
              transparent, reliable, and customer-centric real estate solutions.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              Our goal is simple — to help people find the right home and the right investment with complete peace 
              of mind. Whether you are buying your first home or planning a secure investment for the future, 
              Basera Infra Home is committed to guiding you at every step.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              We strongly believe in honesty, legal clarity, and long-term relationships. All our projects are 
              carefully selected to ensure proper documentation, clear titles, and genuine value for our clients. 
              This approach has helped us earn the trust of numerous satisfied customers over the years.
            </p>
          </section>

          <section className="legal-section">
            <h2>Our Services</h2>
            <ul style={{ fontSize: '17px', lineHeight: '1.9' }}>
              <li>Residential Plots & Flats</li>
              <li>Affordable Housing Projects</li>
              <li>Real Estate Investment Opportunities</li>
              <li>Property Buying & Selling Assistance</li>
              <li>Complete Documentation & Legal Support</li>
            </ul>
          </section>

          <section className="legal-section">
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              With deep local market knowledge and a customer-first approach, our experienced team provides expert 
              guidance based on current market trends and future growth potential.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.8', fontWeight: '600', color: '#3b82f6' }}>
              At Basera Infra Home, we don't just sell properties — we help build secure futures and happy homes.
            </p>
          </section>

          <section className="legal-section">
            <h2>Why Choose Us?</h2>
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>verified</span>
                  Transparency & Trust
                </h3>
                <p>We believe in complete transparency with proper documentation and clear titles for all properties.</p>
              </div>
              <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>support_agent</span>
                  Expert Guidance
                </h3>
                <p>Our experienced team provides personalized guidance based on market trends and your specific needs.</p>
              </div>
              <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>balance</span>
                  Legal Support
                </h3>
                <p>Complete documentation and legal assistance to ensure your investment is secure and hassle-free.</p>
              </div>
              <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>handshake</span>
                  Customer-Centric Approach
                </h3>
                <p>We prioritize long-term relationships and customer satisfaction over quick sales.</p>
              </div>
            </div>
          </section>

          <section className="legal-section" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '15px' }}>Ready to Find Your Dream Home?</h2>
            <p style={{ fontSize: '17px', marginBottom: '25px' }}>
              Contact us today and let our experts guide you to the perfect property.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" style={{ 
                padding: '12px 30px', 
                background: '#3b82f6', 
                color: '#fff', 
                borderRadius: '6px', 
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="material-symbols-outlined">call</span>
                Contact Us
              </a>
              <a href="/properties" style={{ 
                padding: '12px 30px', 
                background: '#fff', 
                color: '#3b82f6', 
                border: '2px solid #3b82f6',
                borderRadius: '6px', 
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="material-symbols-outlined">home</span>
                View Properties
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
