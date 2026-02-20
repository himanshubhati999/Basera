import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import './Testimonials.css';

const Testimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    rating: 5,
    comment: '',
    location: '',
    propertyType: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials/approved`);
      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Thank you! Your testimonial has been posted successfully.');
        // Refresh testimonials to show the new one
        fetchTestimonials();
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          rating: 5,
          comment: '',
          location: '',
          propertyType: ''
        });
        setShowForm(false);
      } else {
        alert(data.message || 'Failed to submit testimonial');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Failed to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="testimonial-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Clients Say</h2>
          <p className="testimonials-subtitle">
            Real experiences from people who found their dream properties with us
          </p>
        </div>

        {loading ? (
          <div className="testimonials-loading">Loading testimonials...</div>
        ) : (
          <>
            <div className="testimonials-grid">
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="testimonial-avatar">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="testimonial-info">
                        <h3 className="testimonial-name">{testimonial.name}</h3>
                        {testimonial.location && (
                          <p className="testimonial-location">📍 {testimonial.location}</p>
                        )}
                      </div>
                    </div>
                    {renderStars(testimonial.rating)}
                    <p className="testimonial-comment">"{testimonial.comment}"</p>
                    {testimonial.propertyType && (
                      <p className="testimonial-property-type">
                        Property: {testimonial.propertyType}
                      </p>
                    )}
                    <p className="testimonial-date">
                      {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="no-testimonials">
                  <p>No testimonials yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            <div className="testimonials-cta">
              {!showForm ? (
                <button
                  className="btn-write-review"
                  onClick={() => setShowForm(true)}
                >
                  ✍️ Write a Review
                </button>
              ) : (
                <div className="testimonial-form-wrapper">
                  <h3 className="form-title">Share Your Experience</h3>
                  <form onSubmit={handleSubmit} className="testimonial-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com (optional)"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Your city/area (optional)"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="propertyType">Property Type</label>
                        <select
                          id="propertyType"
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                        >
                          <option value="">Select type (optional)</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Land">Land</option>
                          <option value="Project">Project</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="rating">Rating *</label>
                      <div className="rating-select">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <label key={star} className="rating-option">
                            <input
                              type="radio"
                              name="rating"
                              value={star}
                              checked={formData.rating == star}
                              onChange={handleChange}
                            />
                            <span className="rating-stars">
                              {renderStars(star)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="comment">Your Review *</label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your experience..."
                        rows="4"
                        maxLength="500"
                      />
                      <small className="char-count">
                        {formData.comment.length}/500 characters
                      </small>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setShowForm(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-submit"
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>

                    <p className="form-note">
                      * Your review will be posted immediately
                    </p>
                  </form>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
