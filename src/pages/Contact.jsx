import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const location = useLocation();
  const propertyName = location.state?.propertyName || 'General Inquiry';

  useEffect(() => {
    // Load HubSpot forms embed script
    const script = document.createElement('script');
    script.src = 'https://js-na2.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log('HubSpot script loaded successfully');
      
      // Initialize the form using the embedded approach
      if (window.hbspt) {
        console.log('Creating HubSpot form...');
        window.hbspt.forms.create({
          region: "na2",
          portalId: "244826787",
          formId: "1dc60e00-39fd-403e-b865-4cc88a315b03",
          target: "#hubspot-form-container",
          onFormReady: function($form) {
            console.log('HubSpot form is ready');
            
            // Set the property name if available
            if (propertyName !== 'General Inquiry') {
              const propertyField = $form.find('input[name="property_inquiry"]');
              if (propertyField.length) {
                propertyField.val(propertyName);
              }
            }
          },
          onFormSubmit: function() {
            console.log('Form submitted for property:', propertyName);
          },
          onFormSubmitted: function() {
            console.log('Form submission complete');
          }
        });
      } else {
        console.error('HubSpot object not found');
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load HubSpot script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const container = document.getElementById('hubspot-form-container');
      if (container) {
        container.innerHTML = '';
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [propertyName]);

  return (
    <div className="contact-page">
      <div className="contact-banner">
        <div className="banner-text">
          ← → Join Us for Exclusive Open House Events This Weekend and Find Your Perfect Home!
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>CONTACT INFORMATION</h2>
          <div className="info-item">
            <p><strong>Address:</strong> 2A,54/13 Awas Vikas 1st DM Road</p>
          </div>
          <div className="info-item">
            <p><strong>Hotline:</strong> <a href="tel:9720444418">9720444418</a></p>
          </div>
          <div className="info-item">
            <p><strong>Email:</strong> <a href="mailto:harshsingh08.hs@gmail.com">harshsingh08.hs@gmail.com</a></p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>HOW WE CAN HELP YOU?</h2>
          {propertyName !== 'General Inquiry' && (
            <p className="property-inquiry">Inquiring about: <strong>{propertyName}</strong></p>
          )}
          <div 
            id="hubspot-form-container"
            className="hs-form-frame"
          ></div>
        </div>
      </div>

      <div className="map-section">
        <h2>Directions</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.9999999999995!2d77.4832!3d28.4746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc1f3c78fffff%3A0xfffffff!2sParasnath%20Bibhab%20Plaza%2C%20Alpha%20I%2C%20Greater%20Noida%2C%20Uttar%20Pradesh%20201310!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>
      </div>

     
    </div>
  );
};

export default Contact;
