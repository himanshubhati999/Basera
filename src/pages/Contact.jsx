import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const location = useLocation();
  const propertyName = location.state?.propertyName || 'General Inquiry';

  useEffect(() => {
    // Clear any existing form first
    const container = document.getElementById('hubspot-form-container');
    if (container) {
      container.innerHTML = '';
    }

    // Load HubSpot forms embed script - using the exact script from your embed code
    const script = document.createElement('script');
    script.src = 'https://js-na2.hsforms.net/forms/embed/244826787.js';
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ HubSpot script loaded successfully');
      console.log('Window.hbspt available:', !!window.hbspt);
      
      // Give HubSpot a moment to initialize
      setTimeout(() => {
        if (window.hbspt && window.hbspt.forms) {
          console.log('✅ Creating HubSpot form with ID: 1dc60e00-39fd-403e-b865-4cc88a315b03');
          
          try {
            window.hbspt.forms.create({
              region: "na2",
              portalId: "244826787",
              formId: "1dc60e00-39fd-403e-b865-4cc88a315b03",
              target: "#hubspot-form-container",
              onFormReady: function($form) {
                console.log('✅ HubSpot form is ready and visible!');
                console.log('Form element:', $form);
                
                // Set the property name if available
                if (propertyName !== 'General Inquiry') {
                  const propertyField = $form.find('input[name="property_inquiry"]');
                  if (propertyField.length) {
                    propertyField.val(propertyName);
                    console.log('Set property inquiry to:', propertyName);
                  }
                }
              },
              onFormSubmit: function($form, data) {
                console.log('🚀 Form is being submitted...');
                console.log('Form data:', data);
                console.log('Property:', propertyName);
              },
              onFormSubmitted: function($form, data) {
                console.log('✅ Form submission SUCCESSFUL!');
                console.log('Submitted data:', data);
                alert('Thank you! Your message has been sent to our CRM.');
              },
              onFormSubmitError: function(error) {
                console.error('❌ Form submission ERROR:', error);
                alert('There was an error submitting the form. Please try again.');
              }
            });
          } catch (error) {
            console.error('❌ Error creating form:', error);
          }
        } else {
          console.error('❌ HubSpot object not available after script load');
        }
      }, 500);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load HubSpot script:', error);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      const cleanContainer = document.getElementById('hubspot-form-container');
      if (cleanContainer) {
        cleanContainer.innerHTML = '';
      }
      if (script && script.parentNode) {
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
