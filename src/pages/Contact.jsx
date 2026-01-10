import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const location = useLocation();
  const propertyName = location.state?.propertyName || 'General Inquiry';

  useEffect(() => {
    // Clear any existing form content first
    const formContainer = document.getElementById('hubspot-form-container');
    if (formContainer) {
      formContainer.innerHTML = '';
    }

    // Load HubSpot form script
    const script = document.createElement('script');
    script.src = 'https://js-na2.hsforms.net/forms/embed/244826787.js';
    script.defer = true;
    script.onload = () => {
      // Create HubSpot form with property name
      if (window.hbspt) {
        // Generate unique submission ID
        const submissionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        window.hbspt.forms.create({
          region: "na2",
          portalId: "244826787",
          formId: "1dc60e00-39fd-403e-b865-4cc88a315b03",
          target: "#hubspot-form-container",
          onFormReady: function($form) {
            // Set the property name in a hidden field or custom field
            // You'll need to create a custom property in HubSpot called "property_inquiry" or similar
            const propertyField = $form.find('input[name="property_inquiry"]');
            if (propertyField.length) {
              propertyField.val(propertyName);
            }
            
            // Add submission ID to help track individual submissions
            const submissionIdField = $form.find('input[name="submission_id"]');
            if (submissionIdField.length) {
              submissionIdField.val(submissionId);
            }
          },
          onFormSubmit: function($form) {
            // Capture the name at submission time
            const nameField = $form.find('input[name="firstname"]');
            const lastNameField = $form.find('input[name="lastname"]');
            const submittedNameField = $form.find('input[name="submitted_name"]');
            
            if (nameField.length && submittedNameField.length) {
              const fullName = nameField.val() + (lastNameField.length ? ' ' + lastNameField.val() : '');
              submittedNameField.val(fullName);
            }
            
            console.log('Form submitted for property:', propertyName);
            // Reset form after a short delay
            setTimeout(() => {
              if ($form && $form.length) {
                const formElement = $form[0];
                if (formElement && typeof formElement.reset === 'function') {
                  formElement.reset();
                }
              }
            }, 1000);
          },
          onFormSubmitted: function() {
            // Additional cleanup after submission is complete
            console.log('Form submission complete');
          }
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup: Clear form container and remove script
      const container = document.getElementById('hubspot-form-container');
      if (container) {
        container.innerHTML = '';
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
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
