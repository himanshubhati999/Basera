import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API_ENDPOINTS } from '../config/api';
import './Contact.css';
import './ContactCRM.css';
import ShinyText from '../components/ShinyText';
import '../components/ButtonGlare.css';

const Contact = () => {
  const location = useLocation();
  const propertyName = location.state?.propertyName || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: propertyName,
    message: ''
  });

  const [formState, setFormState] = useState({
    status: 'idle', // idle, submitting, success, error
    message: ''
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\d\s\-+()]{10,}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setFormState({
        status: 'error',
        message: 'Please fix the errors above'
      });
      return;
    }

    setFormState({
      status: 'submitting',
      message: 'Submitting your inquiry...'
    });

    try {
      // Submit to our backend API
      const response = await fetch(API_ENDPOINTS.CONSULTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormState({
          status: 'success',
          message: 'Thank you! Your message has been received. We will contact you shortly.'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          property: '',
          message: ''
        });

        // Show success for 5 seconds then reset
        setTimeout(() => {
          setFormState({ status: 'idle', message: '' });
        }, 5000);

      } else {
        throw new Error(result.error || 'Submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setFormState({
        status: 'error',
        message: 'Failed to submit form. Please try again or call us directly.'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Get in Touch with Basera Infra Home</title>
        <meta 
          name="description" 
          content="Contact Basera Infra Home for property inquiries. Visit our office at Vishveshwarya Group of institutions GT Road Dadri or call +91 99901 31976. Email: BHATIH981@GMAIL.COM" 
        />
        <meta property="og:title" content="Contact Us - Basera Infra Home" />
        <meta property="og:description" content="Get in touch with our real estate experts in Greater Noida for property consultation and inquiries." />
        <meta name="keywords" content="contact real estate, Greater Noida property office, Basera Infra contact, property inquiry" />
        <link rel="canonical" href="https://baserainfrahome.com/contact" />
      </Helmet>
      
      <div className="contact-page">
      <div className="contact-banner">
        <div className="banner-text">
          ← → Join Us for Exclusive Open House Events This Weekend and Find Your Perfect Home!
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>
            <ShinyText
              text="CONTACT INFORMATION"
              speed={3}
              delay={0}
              color="#333"
              shineColor="#ff0000"
              spread={120}
              direction="left"
            />
          </h2>
          <div className="info-item">
            <p><strong>Address:</strong> Vishveshwarya Group of institutions GT Road Dadri</p>
          </div>
          <div className="info-item">
            <p><strong>Hotline:</strong> <a href="tel:+919990131976">+91 99901 31976</a></p>
          </div>
          <div className="info-item">
            <p><strong>Email:</strong> <a href="mailto:BHATIH981@GMAIL.COM">BHATIH981@GMAIL.COM</a></p>
          </div>
          <div className="info-section">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>
            <ShinyText
              text="HOW WE CAN HELP YOU?"
              speed={3}
              delay={0}
              color="#333"
              shineColor="#ff0000"
              spread={120}
              direction="left"
            />
          </h2>
          
          {propertyName && (
            <p className="property-inquiry">
              Inquiring about: <strong>{propertyName}</strong>
            </p>
          )}

          {formState.status === 'success' && (
            <div className="form-message success-message">
              <span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle'}}>check_circle</span> {formState.message}
            </div>
          )}

          {formState.status === 'error' && (
            <div className="form-message error-message">
              ✗ {formState.message}
            </div>
          )}

          <form className="contact-form-crm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
                disabled={formState.status === 'submitting'}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'error' : ''}
                  disabled={formState.status === 'submitting'}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 99901 31976"
                  className={errors.phone ? 'error' : ''}
                  disabled={formState.status === 'submitting'}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="property">Property Interest</label>
              <input
                type="text"
                id="property"
                name="property"
                value={formData.property}
                onChange={handleChange}
                placeholder="Which property are you interested in?"
                disabled={formState.status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your requirements..."
                rows="5"
                disabled={formState.status === 'submitting'}
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn-crm btn-glare"
              disabled={formState.status === 'submitting'}
            >
              {formState.status === 'submitting' ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                'Send Message'
              )}
            </button>

            <p className="form-note">
              * Required fields. Your information is secure and will only be used to contact you about your inquiry.
            </p>
          </form>
        </div>
      </div>

      <div className="map-section">
        <h2>Directions</h2>
        <div className="map-container">
          <iframe
            src="https://maps.google.com/maps?q=28.47232949013374,77.514062730273&z=17&output=embed"
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
    </>
  );
};

export default Contact;
