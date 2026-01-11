import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const location = useLocation();
  const propertyName = location.state?.propertyName || '';
  const formRef = useRef(null);
  const [formLoaded, setFormLoaded] = useState(false);

  const createForm = useCallback(() => {
    if (!window.hbspt || !window.hbspt.forms || !formRef.current) {
      console.error('❌ Cannot create form - hbspt not ready or ref not available');
      return;
    }

    // Prevent double form creation
    if (formLoaded) {
      console.log('⚠️ Form already loaded, skipping...');
      return;
    }

    try {
      // Clear any existing form
      formRef.current.innerHTML = '';

      window.hbspt.forms.create({
        region: "na2",
        portalId: "244826787",
        formId: "1dc60e00-39fd-403e-b865-4cc88a315b03",
        target: "#hubspot-form-container",
        onFormReady: function($form) {
          console.log('✅ HubSpot form rendered successfully');
          setFormLoaded(true);
          
          // Pre-fill property field if available
          if (propertyName) {
            setTimeout(() => {
              const propertyField = $form.find('input[name="property_inquiry"]');
              if (propertyField.length) {
                propertyField.val(propertyName);
                console.log('✅ Pre-filled property:', propertyName);
              }
            }, 100);
          }
        },
        onFormSubmit: function() {
          console.log('🚀 Form is being submitted to HubSpot');
        },
        onFormSubmitted: function() {
          console.log('✅ Form submitted successfully to HubSpot CRM');
          alert('✅ Thank you! Your message has been received. We will contact you shortly.');
        }
      });
    } catch (error) {
      console.error('❌ Error creating HubSpot form:', error);
    }
  }, [propertyName, formLoaded]);

  useEffect(() => {
    // Capture ref value when effect runs
    const currentFormRef = formRef.current;
    
    // Check if script already exists (with correct URL pattern)
    const existingScript = document.querySelector('script[src*="js-na2.hsforms.net/forms/embed/244826787.js"]');
    
    if (existingScript && window.hbspt) {
      // Script already loaded, create form immediately
      createForm();
      return;
    }

    // Load HubSpot embed script
    const script = document.createElement('script');
    script.src = 'https://js-na2.hsforms.net/forms/embed/244826787.js';
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    
    script.onload = () => {
      console.log('✅ HubSpot script loaded successfully');
      // Wait for hbspt object to be available
      const checkHbspt = setInterval(() => {
        if (window.hbspt && window.hbspt.forms) {
          clearInterval(checkHbspt);
          createForm();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkHbspt);
        if (!window.hbspt) {
          console.error('❌ HubSpot object not available after 5 seconds');
        }
      }, 5000);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load HubSpot script');
    };
    
    document.body.appendChild(script);

    return () => {
      // Use captured ref value in cleanup
      if (currentFormRef) {
        currentFormRef.innerHTML = '';
      }
    };
  }, [createForm]);

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
          <div className="info-section">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>HOW WE CAN HELP YOU?</h2>
          {propertyName && (
            <p className="property-inquiry">Inquiring about: <strong>{propertyName}</strong></p>
          )}
          
          {/* HubSpot Form Container */}
          <div 
            id="hubspot-form-container"
            ref={formRef}
            style={{ minHeight: '400px' }}
          >
            {!formLoaded && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666' 
              }}>
                Loading form...
              </div>
            )}
          </div>
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
