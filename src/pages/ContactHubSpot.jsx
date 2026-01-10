import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';

const ContactHubSpot = () => {
  const location = useLocation();
  const propertyName = location.state?.propertyName || '';
  const formContainerRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const [formStatus, setFormStatus] = useState('loading');

  useEffect(() => {
    const containerElement = formContainerRef.current;
    
    // Prevent multiple script loads
    if (scriptLoadedRef.current && window.hbspt) {
      createForm();
      return;
    }

    // Load HubSpot embed script
    const loadHubSpotScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="hsforms.net/forms/embed/244826787.js"]');
      if (existingScript && window.hbspt) {
        scriptLoadedRef.current = true;
        createForm();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js-na2.hsforms.net/forms/embed/244826787.js';
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ HubSpot embed script loaded');
        scriptLoadedRef.current = true;
        
        // Wait for hbspt to be available
        const checkHbspt = setInterval(() => {
          if (window.hbspt) {
            clearInterval(checkHbspt);
            setFormStatus('ready');
            createForm();
          }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkHbspt);
          if (!window.hbspt) {
            setFormStatus('error');
            console.error('❌ HubSpot object not available');
          }
        }, 5000);
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load HubSpot script');
        setFormStatus('error');
      };

      document.body.appendChild(script);
    };

    // Create form function
    const createForm = () => {
      if (!window.hbspt || !window.hbspt.forms || !formContainerRef.current) {
        setTimeout(createForm, 100);
        return;
      }

      // Clear container
      formContainerRef.current.innerHTML = '';

      try {
        window.hbspt.forms.create({
          region: "na2",
          portalId: "244826787",
          formId: "1dc60e00-39fd-403e-b865-4cc88a315b03",
          target: "#hubspot-form-direct",
          onFormReady: function($form) {
            console.log('✅ HubSpot form ready and rendered');
            setFormStatus('loaded');
            
            // Pre-fill property field if available
            if (propertyName) {
              setTimeout(() => {
                const propertyField = $form.find('input[name="property_inquiry"]');
                if (propertyField.length) {
                  propertyField.val(propertyName);
                  console.log('Pre-filled property:', propertyName);
                }
              }, 100);
            }
          },
          onFormSubmit: function($form, formData) {
            console.log('🚀 Form is being submitted to HubSpot');
            setFormStatus('submitting');
            
            // Send to our backend for local tracking
            const submissionData = {};
            formData.forEach(field => {
              submissionData[field.name] = field.value;
            });
            
            // Track locally (non-blocking)
            fetch('/api/track-submission', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...submissionData,
                property: propertyName || submissionData.property_inquiry,
                source: 'hubspot-form',
                timestamp: new Date().toISOString()
              })
            }).catch(err => console.warn('Local tracking failed:', err));
          },
          onFormSubmitted: function() {
            console.log('✅ Form submitted successfully to HubSpot');
            setFormStatus('success');
            
            // Show success message
            setTimeout(() => {
              alert('✅ Thank you! Your inquiry has been received. We will contact you shortly.');
              setFormStatus('loaded');
            }, 100);
          },
          onFormSubmitError: function(error) {
            console.error('❌ Form submission error:', error);
            setFormStatus('error');
            alert('❌ There was an error submitting the form. Please try again or call us directly.');
          }
        });
      } catch (error) {
        console.error('❌ Error creating HubSpot form:', error);
        setFormStatus('error');
      }
    };

    loadHubSpotScript();

    return () => {
      // Cleanup
      if (containerElement) {
        containerElement.innerHTML = '';
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
            <p className="property-inquiry">
              Inquiring about: <strong>{propertyName}</strong>
            </p>
          )}

          {formStatus === 'loading' && (
            <div className="form-loading">
              <div className="loading-spinner"></div>
              <p>Loading form...</p>
            </div>
          )}

          {formStatus === 'error' && (
            <div className="form-error">
              <p>⚠️ Form failed to load. Please call us directly at <a href="tel:9720444418">9720444418</a></p>
            </div>
          )}
          
          <div 
            id="hubspot-form-direct"
            ref={formContainerRef}
            className="hs-form-container"
            style={{ display: formStatus === 'loading' || formStatus === 'error' ? 'none' : 'block' }}
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

export default ContactHubSpot;
