import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContentEditor from '../components/ContentEditor';
import { API_ENDPOINTS } from '../config/api';
import './PostProperty.css';

const PostProperty = ({ embedded, onBack }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get property ID if editing
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSeoModal, setShowSeoModal] = useState(false);
  const contentEditorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    content: '',
    propertyType: 'residential',
    listingType: 'sale',
    price: '',
    location: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    latitude: '',
    longitude: '',
    area: '',
    areaUnit: 'sqft',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    features: [],
    images: [],
    isFeatured: false,
    isPublished: false,
    status: 'available',
    categories: [],
    ownerPhone: '',
    ownerEmail: user?.email || '',
    youtubeThumbnail: '',
    youtubeVideoUrl: '',
    seoTitle: '',
    seoDescription: '',
    privateNotes: '',
    currency: 'INR'
  });

  const [imageUrls, setImageUrls] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch property data if in edit mode
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.PROPERTIES}/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property data');
        }
        const data = await response.json();

        const property = data.property || data.data || null;
        if (property) {
          const normalizedImages = (property.images || []).map((img) => (
            typeof img === 'string'
              ? { url: img, filename: img.split('/').pop() || '' }
              : img
          ));

          setFormData({
            title: property.title || '',
            description: property.description || '',
            shortDescription: property.shortDescription || '',
            content: property.content || '',
            propertyType: property.propertyType || 'residential',
            listingType: property.listingType || 'sale',
            price: property.price || '',
            location: property.location?.address || '',
            city: property.location?.city || '',
            state: property.location?.state || '',
            country: property.location?.country || 'India',
            zipCode: property.location?.zipCode || '',
            latitude: property.location?.coordinates?.latitude || property.location?.latitude || '',
            longitude: property.location?.coordinates?.longitude || property.location?.longitude || '',
            area: property.area?.value || property.area || '',
            areaUnit: property.area?.unit || property.areaUnit || 'sqft',
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            amenities: property.amenities || [],
            features: property.features || [],
            images: property.images || [],
            isFeatured: property.isFeatured || false,
            isPublished: property.isPublished || false,
            status: property.status || 'available',
            categories: property.categories || [],
            ownerPhone: property.ownerPhone || '',
            ownerEmail: property.ownerEmail || user?.email || '',
            youtubeThumbnail: property.youtubeThumbnail || '',
            youtubeVideoUrl: property.youtubeVideo || property.youtubeVideoUrl || '',
            seoTitle: property.seo?.title || property.seoTitle || '',
            seoDescription: property.seo?.description || property.seoDescription || '',
            privateNotes: property.privateNotes || '',
            currency: property.currency || 'INR'
          });
          setUploadedImages(normalizedImages);
          setImageUrls((property.images || []).join('\n'));
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property data');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id, isEditMode, user]);

  useEffect(() => {
    if (!isEditMode || !formData.content) return;

    const timer = setTimeout(() => {
      if (contentEditorRef.current) {
        const editorElement = contentEditorRef.current.querySelector('.editor-content');
        if (editorElement) {
          editorElement.innerHTML = formData.content;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isEditMode, formData.content]);

  // Function to get content from editor
  const getEditorContent = () => {
    if (contentEditorRef.current) {
      const editorElement = contentEditorRef.current.querySelector('.editor-content');
      return editorElement?.innerHTML || '';
    }
    return formData.content;
  };

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
    
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(API_ENDPOINTS.UPLOAD_MULTIPLE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const result = await response.json();
      const newUrls = result.images.map(img => img.url);
      
      // Add uploaded URLs to the image URLs textarea
      setImageUrls(prev => {
        const existing = prev.trim();
        return existing ? `${existing}\n${newUrls.join('\n')}` : newUrls.join('\n');
      });

      setUploadedImages(prev => [...prev, ...result.images]);
      
      // Clear images error if it exists
      if (fieldErrors.images) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }

      alert(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveUploadedImage = (filename, url) => {
    // Remove from uploaded images list
    setUploadedImages(prev => prev.filter(img => img.filename !== filename));
    
    // Remove from image URLs textarea
    setImageUrls(prev => {
      const urls = prev.split('\n').filter(u => u.trim() !== url);
      return urls.join('\n');
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Property name is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location address is required';
    }
    
    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Valid price is required';
    }
    
    if (!imageUrls.trim()) {
      errors.images = 'At least one image is required';
    }
    
    if (!formData.ownerPhone.trim()) {
      errors.ownerPhone = 'Contact phone is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (exitAfter = false) => {
    setError('');
    setFieldErrors({});
    
    // Validate form first
    const isValid = validateForm();
    
    if (!isValid) {
      setError('Please fill all required fields marked with *');
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
        if (firstError) {
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
        setError('You must be logged in to post a property');
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

      const propertyData = {
        title: formData.title,
        description: editorContent || formData.shortDescription || formData.description,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        price: parseFloat(formData.price) || 0,
        location: {
          address: formData.location,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          coordinates: {
            latitude: formData.latitude,
            longitude: formData.longitude
          }
        },
        area: formData.area ? {
          value: parseFloat(formData.area),
          unit: formData.areaUnit
        } : undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        images: imageArray,
        amenities: formData.amenities,
        status: formData.status.toLowerCase(),
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
        categories: formData.categories,
        content: editorContent || formData.shortDescription,
        seo: {
          title: formData.seoTitle,
          description: formData.seoDescription
        },
        youtubeVideo: formData.youtubeVideoUrl,
        privateNotes: formData.privateNotes,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail
      };

      const response = await fetch(isEditMode ? `${API_ENDPOINTS.PROPERTIES}/${id}` : API_ENDPOINTS.PROPERTIES, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'post'} property`);
      }

      const result = await response.json();
      const statusMessage = isEditMode 
        ? 'Property updated successfully!'
        : formData.isPublished 
          ? 'Property published successfully!' 
          : 'Property saved as draft successfully!';
      alert(statusMessage);
      
      if (exitAfter) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Post property error:', err);
      setError(err.message || 'An error occurred while posting the property');
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
          <span onClick={() => embedded && onBack ? onBack() : null} style={{ cursor: embedded ? 'pointer' : 'default' }}>PROPERTIES</span>
          <span>/</span>
          <span className="active">{isEditMode ? 'EDIT PROPERTY' : 'NEW PROPERTY'}</span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="create-project-content">
        <div className="main-form">
          <div className="form-section">
            <label className="form-label">
              Property Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${fieldErrors.title ? 'error' : ''}`}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Property Name"
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
              value={`https://baserainfrahome.com/properties/${permalink}`}
              readOnly
            />
            <div className="permalink-preview">
              Preview: https://baserainfrahome.com/properties/{permalink || ''}
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
            <label className="form-label">ZIP Code</label>
            <input
              type="text"
              className="form-input"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="ZIP Code"
            />
          </div>

          <div className="form-section">
            <label className="form-label">Property Details</label>
            <div className="specs-grid">
              <div>
                <input
                  type="number"
                  className="form-input"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area"
                />
              </div>
              <div>
                <select
                  className="form-select"
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                >
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
              <input
                type="text"
                className="form-input"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Bedrooms"
              />
              <input
                type="text"
                className="form-input"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="Bathrooms"
              />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Price <span className="required">*</span>
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
              Property Images <span className="required">*</span>
            </label>
            
            {/* File Upload Section */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="file"
                id="imageFileInput"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => document.getElementById('imageFileInput').click()}
                disabled={uploadingImages}
                style={{
                  padding: '10px 20px',
                  backgroundColor: uploadingImages ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: uploadingImages ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {uploadingImages ? 'Uploading...' : '📤 Upload Images from Computer'}
              </button>
              {uploadedImages.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  {uploadedImages.length} image(s) uploaded to Cloudinary
                </div>
              )}
            </div>

            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                {uploadedImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                    <img src={img.url} alt={`Uploaded ${index + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveUploadedImage(img.filename, img.url)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'rgba(255, 0, 0, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <label className="form-label" style={{ marginTop: uploadedImages.length > 0 ? '15px' : '0' }}>
              Or enter image URLs (one per line)
            </label>
            <textarea
              className={`form-textarea ${fieldErrors.images ? 'error' : ''}`}
              value={imageUrls}
              onChange={handleImageUrlsChange}
              rows="4"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
            {fieldErrors.images && <div className="field-error-message">{fieldErrors.images}</div>}
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

          <div className="form-section">
            <h3 className="section-heading">Contact Information</h3>
            <p className="form-hint" style={{ marginBottom: '15px' }}>
              This information will not be displayed publicly and will only be used when someone enquires about your property.
            </p>
            
            <div className="specs-grid">
              <div>
                <label className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-input ${fieldErrors.ownerPhone ? 'error' : ''}`}
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  placeholder="e.g., +1234567890"
                  required
                />
                {fieldErrors.ownerPhone && <div className="field-error-message">{fieldErrors.ownerPhone}</div>}
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>
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
                  ? 'This property will be visible to users' 
                  : 'This property will be saved as draft'}
              </small>
            </div>
            
            <button 
              onClick={() => handleSave(false)} 
              className="save-btn"
              disabled={loading}
            >
              💾 {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save')}
            </button>
            <button 
              onClick={() => handleSave(true)} 
              className="save-exit-btn"
              disabled={loading}
            >
              ↗ {isEditMode ? 'Update & Exit' : 'Save & Exit'}
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Property Type</h3>
            <select
              className="form-select"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div className="sidebar-section">
            <h3>Listing Type</h3>
            <select
              className="form-select"
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
            >
              <option value="sale">For Sale</option>
              <option value="construction">For Construction</option>
            </select>
          </div>

          <div className="sidebar-section">
            <h3>Status</h3>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
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
                <div className="preview-url">https://baserainfrahome.com/properties/{generatePermalink(formData.title) || 'property-name'}</div>
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

export default PostProperty;
