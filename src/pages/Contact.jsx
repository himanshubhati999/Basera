import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the Terms and Privacy Policy');
      return;
    }
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

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
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Message *"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            ></textarea>
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="agree">
                I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>
              </label>
            </div>
            <button type="submit" className="submit-btn">Send message</button>
          </form>
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
