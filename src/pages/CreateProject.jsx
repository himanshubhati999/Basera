import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentEditor from '../components/ContentEditor';
import { API_ENDPOINTS } from '../config/api';
import './CreateProject.css';

const CreateProject = ({ embedded, onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    content: '',
    location: '',
    price: '',
    isFeatured: false,
    isPublished: false,
    status: '',
    categories: [],
    images: [],
    amenities: [],
    specifications: {
      totalUnits: '',
      completionDate: '',
      area: '',
      bedrooms: '',
      bathrooms: ''
    },
    country: 'India',
    state: '',
    city: '',
    latitude: '',
    longitude: '',
    numberBlocks: '',
    numberFloors: '',
    numberFlats: '',
    lowestPrice: '',
    maxPrice: '',
    currency: 'INR',
    privateNotes: '',
    features: [],
    youtubeThumbnail: '',
    youtubeVideoUrl: '',
    seoTitle: '',
    seoDescription: '',
    openSellDate: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    account: ''
  });
  const [imageUrls, setImageUrls] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSeoModal, setShowSeoModal] = useState(false);
  const contentEditorRef = useRef(null);

  // Function to get content from editor
  const getEditorContent = () => {
    if (contentEditorRef.current) {
      const editorElement = contentEditorRef.current.querySelector('.editor-content');
      return editorElement?.innerHTML || '';
    }
    return formData.content;
  };

  const availableCategories = ['Apartment', 'Villa', 'Condo', 'House', 'Land', 'Commercial property'];
  const availableFeatures = [
    'Wifi', 'Parking', 'Swimming pool', 'Balcony', 'Garden', 'Security',
    'Fitness center', 'Air Conditioning', 'Central Heating', 'Laundry Room',
    'Pets Allow', 'Spa & Massage'
  ];
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  const generatePermalink = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUrlsChange = (e) => {
    setImageUrls(e.target.value);
    
    // Clear images error when user starts typing
    if (fieldErrors.images) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleAmenityAdd = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleAmenityRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    console.log('=== VALIDATION DEBUG ===');
    console.log('Title:', formData.title, '| Empty?', !formData.title.trim());
    console.log('Status:', formData.status, '| Empty?', !formData.status);
    console.log('Location:', formData.location, '| Empty?', !formData.location.trim());
    console.log('Price:', formData.price, '| Invalid?', !formData.price || parseFloat(formData.price) <= 0);
    console.log('ImageUrls:', imageUrls, '| Empty?', !imageUrls.trim());
    
    if (!formData.title.trim()) {
      errors.title = 'Project name is required';
    }
    
    if (!formData.status) {
      errors.status = 'Please select a status';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location address is required';
    }
    
    // Check price - handle both empty string and zero/negative values
    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Valid price is required';
    }
    
    // Check imageUrls textarea, not formData.images array
    if (!imageUrls.trim()) {
      errors.images = 'At least one image is required';
    }
    
    console.log('Validation Errors:', errors);
    console.log('Has Errors?', Object.keys(errors).length > 0);
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (exitAfter = false) => {
    console.log('=== SAVE CLICKED ===');
    console.log('Current formData:', {
      title: formData.title,
      status: formData.status,
      location: formData.location,
      price: formData.price,
    });
    console.log('Current imageUrls:', imageUrls);
    
    setError('');
    setFieldErrors({});
    
    // Validate form first
    const isValid = validateForm();
    console.log('Form valid?', isValid);
    
    if (!isValid) {
      setError('Please fill all required fields marked with *');
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
        if (firstError) {
          console.log('Scrolling to error field:', firstError);
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }, 100);
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a project');
        setLoading(false);
        return;
      }

      // Process image URLs
      const imageArray = imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url);

      // Get content from rich text editor
      const editorContent = getEditorContent();

      const projectData = {
        title: formData.title,
        description: editorContent || formData.shortDescription || formData.description,
        propertyType: 'project', // Backend expects propertyType, not type
        listingType: 'sale',
        price: parseFloat(formData.price) || 0,
        location: {
          address: formData.location,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          coordinates: {
            latitude: formData.latitude,
            longitude: formData.longitude
          }
        },
        area: formData.specifications.area ? {
          value: parseFloat(formData.specifications.area),
          unit: 'sqft'
        } : undefined,
        bedrooms: formData.specifications.bedrooms ? parseInt(formData.specifications.bedrooms) : undefined,
        bathrooms: formData.specifications.bathrooms ? parseInt(formData.specifications.bathrooms) : undefined,
        images: imageArray,
        amenities: formData.amenities,
        status: formData.status.toLowerCase(),
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
        categories: formData.categories,
        content: editorContent || formData.shortDescription,
        projectDetails: {
          numberBlocks: formData.numberBlocks ? parseInt(formData.numberBlocks) : undefined,
          numberFloors: formData.numberFloors ? parseInt(formData.numberFloors) : undefined,
          numberFlats: formData.numberFlats ? parseInt(formData.numberFlats) : undefined,
          lowestPrice: formData.lowestPrice ? parseFloat(formData.lowestPrice) : undefined,
          maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : undefined,
          openSellDate: formData.openSellDate || undefined
        },
        seo: {
          title: formData.seoTitle,
          description: formData.seoDescription
        },
        youtubeVideo: formData.youtubeVideoUrl,
        privateNotes: formData.privateNotes,
        // Required fields for backend
        ownerPhone: formData.ownerPhone || 'N/A',
        ownerEmail: formData.ownerEmail || 'admin@sunshinerealestate.com'
      };

      console.log('Sending projectData:', projectData);

      const response = await fetch(API_ENDPOINTS.PROPERTIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Backend error response:', data);
        throw new Error(data.message || 'Failed to create project');
      }

      const result = await response.json();
      console.log('Success response:', result);

      const statusMessage = formData.isPublished 
        ? 'Project published successfully!' 
        : 'Project saved as draft successfully!';
      alert(statusMessage);
      if (exitAfter) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Create project error:', err);
      setError(err.message || 'An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  const permalink = generatePermalink(formData.title);

  return (
    <>
    <div className={`create-project-container${embedded ? ' embedded' : ''}`}>
      <div className="create-project-header">
        <div className="breadcrumb">
          <span onClick={() => embedded && onBack ? onBack() : navigate('/admin/dashboard')}>DASHBOARD</span>
          <span>/</span>
          <span>REAL ESTATE</span>
          <span>/</span>
          <span onClick={() => embedded && onBack ? onBack() : null} style={{ cursor: embedded ? 'pointer' : 'default' }}>PROJECTS</span>
          <span>/</span>
          <span className="active">NEW PROJECT</span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="create-project-content">
        <div className="main-form">
          <div className="form-section">
            <label className="form-label">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${fieldErrors.title ? 'error' : ''}`}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            {fieldErrors.title && <div className="field-error-message">{fieldErrors.title}</div>}
          </div>

          <div className="form-section">
            <label className="form-label">
              Permalink <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input permalink-input"
              value={`https://sunshinerealestatepvtltd.com/projects/${permalink}`}
              readOnly
            />
            <div className="permalink-preview">
              Preview: https://sunshinerealestatepvtltd.com/projects/{permalink || ''}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Short description"
              rows="3"
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              />
              <span style={{ marginLeft: '8px' }}>Is featured?</span>
            </label>
          </div>

          <div className="form-section content-editor-section" ref={contentEditorRef}>
            <ContentEditor />
          </div>

          <div className="form-section">
            <h3 className="section-heading">Location Details</h3>
            <div className="location-grid">
              <div>
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="India">India</option>
                </select>
              </div>
              <div>
                <label className="form-label">State</label>
                <select
                  className="form-select"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select state...</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Select city..."
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Location Address <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${fieldErrors.location ? 'error' : ''}`}
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
            />
            {fieldErrors.location && <div className="field-error-message">{fieldErrors.location}</div>}
          </div>

          <div className="form-section">
            <div className="location-grid">
              <div>
                <label className="form-label">Latitude</label>
                <input
                  type="text"
                  className="form-input"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Ex: 1.462260"
                />
                <small className="form-hint">Go here to get Latitude from address.</small>
              </div>
              <div>
                <label className="form-label">Longitude</label>
                <input
                  type="text"
                  className="form-input"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Ex: 103.812530"
                />
                <small className="form-hint">Go here to get Longitude from address.</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Property Details</label>
            <div className="specs-grid">
              <input
                type="text"
                className="form-input"
                name="numberBlocks"
                value={formData.numberBlocks}
                onChange={handleChange}
                placeholder="Number blocks"
              />
              <input
                type="text"
                className="form-input"
                name="numberFloors"
                value={formData.numberFloors}
                onChange={handleChange}
                placeholder="Number floors"
              />
              <input
                type="text"
                className="form-input"
                name="numberFlats"
                value={formData.numberFlats}
                onChange={handleChange}
                placeholder="Number flats"
              />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Specifications</label>
            <div className="specs-grid">
              <input
                type="number"
                className="form-input"
                name="specifications.totalUnits"
                value={formData.specifications.totalUnits}
                onChange={handleChange}
                placeholder="Total Units"
              />
              <input
                type="number"
                className="form-input"
                name="specifications.area"
                value={formData.specifications.area}
                onChange={handleChange}
                placeholder="Area (sq ft)"
              />
              <input
                type="text"
                className="form-input"
                name="specifications.completionDate"
                value={formData.specifications.completionDate}
                onChange={handleChange}
                placeholder="Completion Date"
              />
              <input
                type="text"
                className="form-input"
                name="specifications.bedrooms"
                value={formData.specifications.bedrooms}
                onChange={handleChange}
                placeholder="Bedrooms"
              />
              <input
                type="text"
                className="form-input"
                name="specifications.bathrooms"
                value={formData.specifications.bathrooms}
                onChange={handleChange}
                placeholder="Bathrooms"
              />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Price Range <span className="required">*</span>
            </label>
            <div className="specs-grid">
              <input
                type="number"
                className={`form-input ${fieldErrors.price ? 'error' : ''}`}
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price (₹)"
              />
              <input
                type="text"
                className="form-input"
                name="lowestPrice"
                value={formData.lowestPrice}
                onChange={handleChange}
                placeholder="Lowest price"
              />
              <input
                type="text"
                className="form-input"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
                placeholder="Max price"
              />
              <select
                className="form-select"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            {fieldErrors.price && <div className="field-error-message">{fieldErrors.price}</div>}
          </div>

          <div className="form-section">
            <label className="form-label">Private notes</label>
            <textarea
              className="form-textarea"
              name="privateNotes"
              value={formData.privateNotes}
              onChange={handleChange}
              placeholder="Private notes"
              rows="4"
            />
            <small className="form-hint">Private notes are only visible to owner. It won't be shown on the frontend.</small>
          </div>

          <div className="form-section">
            <h3 className="section-heading">Amenities</h3>
            <div className="amenity-input-group">
              <input
                type="text"
                className="form-input"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add an amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAmenityAdd())}
              />
              <button type="button" onClick={handleAmenityAdd} className="add-btn">
                Add
              </button>
            </div>
            <div className="amenities-list">
              {formData.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">
                  {amenity}
                  <button type="button" onClick={() => handleAmenityRemove(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-heading">Distance key between facilities</h3>
            <button type="button" className="add-new-btn">Add new</button>
          </div>

          <div className="form-section">
            <h3 className="section-heading">Custom Fields</h3>
          </div>

          <div className="form-section">
            <h3 className="section-heading">Features</h3>
            <div className="features-grid">
              {availableFeatures.map((feature) => (
                <label key={feature} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-heading">Addition Information</h3>
            
            <label className="form-label">
              Property Images (one URL per line) <span className="required">*</span>
            </label>
            <textarea
              className={`form-textarea ${fieldErrors.images ? 'error' : ''}`}
              value={imageUrls}
              onChange={handleImageUrlsChange}
              rows="4"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
            {fieldErrors.images && <div className="field-error-message">{fieldErrors.images}</div>}
            
            <label className="form-label" style={{ marginTop: '20px' }}>YouTube Video Thumbnail</label>
            <div className="thumbnail-upload">
              <div className="thumbnail-placeholder">
                <div className="thumbnail-icon">🖼️</div>
              </div>
              <div className="upload-actions">
                <button type="button" className="upload-btn">Choose Image</button>
                <span>or</span>
                <button type="button" className="url-btn">Add from URL</button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">YouTube Video URL</label>
            <input
              type="text"
              className="form-input"
              name="youtubeVideoUrl"
              value={formData.youtubeVideoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="form-section">
            <div className="seo-header">
              <h3 className="section-heading">Search Engine Optimize</h3>
              <button type="button" className="edit-seo-btn" onClick={() => setShowSeoModal(true)}>Edit SEO meta</button>
            </div>
            <p className="seo-description">
              Setup meta title & description to make your site easy to discovered on search engines such as Google
            </p>
            {(formData.seoTitle || formData.seoDescription) && (
              <div className="seo-preview">
                {formData.seoTitle && (
                  <div className="seo-preview-item">
                    <strong>Title:</strong> {formData.seoTitle}
                  </div>
                )}
                {formData.seoDescription && (
                  <div className="seo-preview-item">
                    <strong>Description:</strong> {formData.seoDescription}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-section publish-section">
            <h3>Publish</h3>
            
            <div className="publish-status">
              <label className="publish-toggle">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="publish-checkbox"
                />
                <span className="toggle-label">
                  {formData.isPublished ? '🟢 Published' : '🔴 Draft'}
                </span>
              </label>
              <small className="publish-hint">
                {formData.isPublished 
                  ? 'This project will be visible to users' 
                  : 'This project will be saved as draft'}
              </small>
            </div>
            
            <button 
              onClick={() => handleSave(false)} 
              className="save-btn"
              disabled={loading}
            >
              💾 {loading ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={() => handleSave(true)} 
              className="save-exit-btn"
              disabled={loading}
            >
              ↗ Save & Exit
            </button>
          </div>

          <div className="sidebar-section">
            <h3>
              Status <span className="required">*</span>
            </h3>
            <select
              className={`form-select ${fieldErrors.status ? 'error' : ''}`}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            {fieldErrors.status && <div className="field-error-message">{fieldErrors.status}</div>}
          </div>

          <div className="sidebar-section">
            <h3>Categories</h3>
            <div className="categories-list">
              {availableCategories.map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Investor</h3>
            <input
              type="text"
              className="form-input"
              placeholder="Investor name"
            />
          </div>
        </div>
      </div>
    </div>

    {/* SEO Modal */}
    {showSeoModal && (
      <div className="modal-overlay" onClick={() => setShowSeoModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Edit SEO Meta</h2>
            <button className="modal-close" onClick={() => setShowSeoModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="modal-form-group">
              <label className="form-label">SEO Title</label>
              <input
                type="text"
                className="form-input"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Enter SEO title for search engines"
                maxLength="60"
              />
              <small className="form-hint">{formData.seoTitle.length}/60 characters</small>
            </div>
            <div className="modal-form-group">
              <label className="form-label">SEO Description</label>
              <textarea
                className="form-textarea"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                placeholder="Enter meta description for search engines"
                rows="4"
                maxLength="160"
              />
              <small className="form-hint">{formData.seoDescription.length}/160 characters</small>
            </div>
            <div className="seo-preview-box">
              <h4>Search Preview</h4>
              <div className="search-preview">
                <div className="preview-title">{formData.seoTitle || formData.title || 'Your Page Title'}</div>
                <div className="preview-url">https://sunshinerealestatepvtltd.com/projects/{generatePermalink(formData.title) || 'project-name'}</div>
                <div className="preview-description">{formData.seoDescription || formData.shortDescription || 'Your meta description will appear here...'}</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-btn-cancel" onClick={() => setShowSeoModal(false)}>Cancel</button>
            <button className="modal-btn-save" onClick={() => setShowSeoModal(false)}>Save Changes</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default CreateProject;
