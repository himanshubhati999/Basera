import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PostProperty.css';

const PostProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [listingType, setListingType] = useState(null); // 'property' or 'project'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'residential',
    listingType: 'sale',
    price: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    area: '',
    areaUnit: 'sqft',
    bedrooms: '',
    bathrooms: '',
    amenities: '',
    ownerPhone: '',
    ownerEmail: user?.email || '',
    images: ''
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleListingTypeSelect = (type) => {
    setListingType(type);
    // Set propertyType based on listing type
    if (type === 'project') {
      setFormData(prev => ({
        ...prev,
        propertyType: 'project'
      }));
    }
  };

  const handleBack = () => {
    setListingType(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ 
          type: 'error', 
          text: 'Please login to post a property' 
        });
        setLoading(false);
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
      
      // Prepare data for submission
      const propertyData = {
        title: formData.title,
        description: formData.description,
        propertyType: listingType === 'project' ? 'project' : formData.propertyType,
        listingType: formData.listingType,
        price: Number(formData.price),
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode
        },
        area: {
          value: Number(formData.area),
          unit: formData.areaUnit
        },
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail
      };

      console.log('Submitting property data:', propertyData);

      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        const successMessage = listingType === 'project' 
          ? 'Project posted successfully! Redirecting...' 
          : 'Property posted successfully! Redirecting...';
        setMessage({ 
          type: 'success', 
          text: successMessage
        });
        setTimeout(() => {
          navigate('/properties');
        }, 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Failed to post property' 
        });
      }
    } catch (error) {
      console.error('Error posting property:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check if backend is running.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-property-container">
      {!listingType ? (
        // Selection Screen
        <div className="listing-type-selection">
          <div className="post-property-header">
            <h1>Choose Listing Type</h1>
            <p>Select whether you want to post a property or a project</p>
          </div>
          
          <div className="listing-type-cards">
            <div className="listing-type-card" onClick={() => handleListingTypeSelect('property')}>
              <div className="card-icon">🏠</div>
              <h3>Post Property</h3>
              <p>List individual properties like apartments, houses, commercial spaces, or land for sale or rent</p>
              <button className="select-btn">Select Property</button>
            </div>
            
            <div className="listing-type-card" onClick={() => handleListingTypeSelect('project')}>
              <div className="card-icon">🏗️</div>
              <h3>Post Project</h3>
              <p>List real estate development projects, residential complexes, or commercial developments</p>
              <button className="select-btn">Select Project</button>
            </div>
          </div>
        </div>
      ) : (
        // Form Screen
        <>
          <div className="post-property-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Post Your {listingType === 'project' ? 'Project' : 'Property'}</h1>
            <p>Fill in the details below to list your {listingType === 'project' ? 'project' : 'property'}</p>
          </div>

          {message.text && (
            <div className={`${message.type}-message`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="property-form">
            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="title">{listingType === 'project' ? 'Project' : 'Property'} Title <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={listingType === 'project' ? 'e.g., Luxury Residential Complex' : 'e.g., Luxury 3BHK Apartment in Downtown'}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description <span className="required">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={`Describe your ${listingType === 'project' ? 'project' : 'property'} in detail...`}
                  required
                />
              </div>

              <div className="form-row">
                {listingType === 'property' && (
                  <div className="form-group">
                    <label htmlFor="propertyType">Property Type <span className="required">*</span></label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="listingType">Listing Type <span className="required">*</span></label>
                  <select
                    id="listingType"
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleChange}
                    required
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price <span className="required">*</span></label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="form-section">
              <h2>Location Details</h2>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                />
              </div>

              <div className="location-grid">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="form-section">
              <h2>{listingType === 'project' ? 'Project' : 'Property'} Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="area">Area</label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g., 1500"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="areaUnit">Area Unit</label>
                  <select
                    id="areaUnit"
                    name="areaUnit"
                    value={formData.areaUnit}
                    onChange={handleChange}
                  >
                    <option value="sqft">Square Feet</option>
                    <option value="sqm">Square Meters</option>
                    <option value="acres">Acres</option>
                  </select>
                </div>

                {listingType === 'property' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="bedrooms">Bedrooms</label>
                      <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        placeholder="e.g., 3"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="bathrooms">Bathrooms</label>
                      <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        placeholder="e.g., 2"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="amenities">Amenities</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="e.g., Swimming Pool, Gym, Parking"
                />
                <small>Separate multiple amenities with commas</small>
              </div>

              <div className="form-group">
                <label htmlFor="images">Image URLs</label>
                <input
                  type="text"
                  id="images"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
                <small>Separate multiple image URLs with commas</small>
              </div>
            </div>

            {/* Contact Information (Private) */}
            <div className="form-section">
              <h2>Contact Information</h2>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '15px' }}>
                This information will not be displayed publicly and will only be used when someone enquires about your {listingType === 'project' ? 'project' : 'property'}.
              </p>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ownerPhone">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="ownerPhone"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    placeholder="e.g., +1234567890"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ownerEmail">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="ownerEmail"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/properties')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Posting...' : `Post ${listingType === 'project' ? 'Project' : 'Property'}`}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default PostProperty;
