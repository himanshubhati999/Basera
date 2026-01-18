import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Wishlist.css';
import ShinyText from '../components/ShinyText';

const Wishlist = () => {
  const { user, wishlist, removeFromWishlist, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.PROPERTIES);
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        
        const data = await response.json();
        
        // Transform backend data to match frontend format
        const transformedProperties = data.properties.map(prop => ({
          id: prop._id,
          name: prop.title,
          location: prop.location?.city || prop.location?.address || 'Location not specified',
          area: prop.area ? `${prop.area} sqft` : 'N/A',
          price: `₹${prop.price.toLocaleString('en-IN')}`,
          image: prop.images?.[0] || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80',
          badge: prop.status === 'available' ? 'AVAILABLE' : 'SOLD',
          type: prop.propertyType?.toLowerCase() || 'apartment',
          listingType: prop.listingType || 'sale',
          bedrooms: prop.bedrooms?.toString() || '',
          bathrooms: prop.bathrooms?.toString() || '',
          status: prop.status || 'ready-to-move'
        }));
        
        setAllProperties(transformedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProperties();
    }
  }, [isAuthenticated]);

  // Compute wishlist properties based on current wishlist
  const wishlistProperties = useMemo(() => {
    return allProperties.filter(property => wishlist.includes(property.id));
  }, [wishlist, allProperties]);

  // Separate wishlist items into categories
  const categorizedWishlist = useMemo(() => {
    const featured = wishlistProperties.filter(property => 
      property.badge === 'FEATURED' || property.badge === 'PREMIUM' || property.badge === 'LUXURY'
    );
    const projects = wishlistProperties.filter(property => 
      (property.badge === 'NEW' || property.status === 'under-construction') && 
      !featured.includes(property)
    );
    const properties = wishlistProperties.filter(property => 
      !featured.includes(property) && !projects.includes(property)
    );
    
    return { featured, projects, properties };
  }, [wishlistProperties]);

  // Filter based on active tab
  const filteredWishlist = useMemo(() => {
    if (activeTab === 'all') return wishlistProperties;
    if (activeTab === 'featured') return categorizedWishlist.featured;
    if (activeTab === 'projects') return categorizedWishlist.projects;
    if (activeTab === 'properties') return categorizedWishlist.properties;
    return wishlistProperties;
  }, [activeTab, wishlistProperties, categorizedWishlist]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/wishlist' } });
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = async (propertyId) => {
    await removeFromWishlist(propertyId);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-hero">
        <h1>
          <ShinyText
            text="MY WISHLIST"
            speed={3}
            delay={0}
            color="#ffffff"
            shineColor="#ff0000"
            spread={120}
            direction="left"
          />
        </h1>
        <p>Your saved properties for future reference</p>
        <div className="breadcrumb">
          <a href="/">Home</a> / <span>Wishlist</span>
        </div>
      </div>

      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>Saved Properties ({wishlistProperties.length})</h2>
          {user && <p className="user-info">Logged in as: {user.name}</p>}
        </div>

        {/* Tab Navigation */}
        <div className="wishlist-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            My Wishlist
            <span className="tab-count">{wishlistProperties.length}</span>
          </button>
          
        </div>

        {wishlistProperties.length > 0 ? (
          <div className="wishlist-content">
            {activeTab === 'all' ? (
              <div className="wishlist-sections">
                {/* Featured Projects Section */}
                {categorizedWishlist.featured.length > 0 && (
                  <div className="wishlist-section">
                    <div className="section-header">
                      <h3>Featured Projects</h3>
                      <span className="section-count">{categorizedWishlist.featured.length} items</span>
                    </div>
                    <div className="wishlist-grid">
                      {categorizedWishlist.featured.map(property => (
                    <div key={property.id} className="wishlist-card">
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(property.id)}
                        title="Remove from wishlist"
                      >
                        ✕
                      </button>
                      <Link to={`/properties/${property.id}`} className="property-link">
                        <div className="property-badge">{property.badge}</div>
                        <img src={property.image} alt={property.name} />
                        <div className="property-info">
                          <h3>{property.name}</h3>
                          <p>📍 {property.location}</p>
                          <p>Area: {property.area}</p>
                          {property.bedrooms && <p>🛏️ {property.bedrooms} BHK | 🚿 {property.bathrooms} Bath</p>}
                          <p className="property-price">{property.price}</p>
                          <span className={`status-badge ${property.status}`}>
                            {property.status === 'ready-to-move' ? 'Ready to Move' : 'Under Construction'}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {categorizedWishlist.projects.length > 0 && (
              <div className="wishlist-section">
                <div className="section-header">
                  <h3>Projects</h3>
                  <span className="section-count">{categorizedWishlist.projects.length} items</span>
                </div>
                <div className="wishlist-grid">
                  {categorizedWishlist.projects.map(property => (
                    <div key={property.id} className="wishlist-card">
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(property.id)}
                        title="Remove from wishlist"
                      >
                        ✕
                      </button>
                      <Link to={`/properties/${property.id}`} className="property-link">
                        <div className="property-badge">{property.badge}</div>
                        <img src={property.image} alt={property.name} />
                        <div className="property-info">
                          <h3>{property.name}</h3>
                          <p>📍 {property.location}</p>
                          <p>Area: {property.area}</p>
                          {property.bedrooms && <p>🛏️ {property.bedrooms} BHK | 🚿 {property.bathrooms} Bath</p>}
                          <p className="property-price">{property.price}</p>
                          <span className={`status-badge ${property.status}`}>
                            {property.status === 'ready-to-move' ? 'Ready to Move' : 'Under Construction'}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Properties Section */}
            {categorizedWishlist.properties.length > 0 && (
              <div className="wishlist-section">
                <div className="section-header">
                  <h3>Properties</h3>
                  <span className="section-count">{categorizedWishlist.properties.length} items</span>
                </div>
                <div className="wishlist-grid">
                  {categorizedWishlist.properties.map(property => (
                    <div key={property.id} className="wishlist-card">
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(property.id)}
                        title="Remove from wishlist"
                      >
                        ✕
                      </button>
                      <Link to={`/properties/${property.id}`} className="property-link">
                        <div className="property-badge">{property.badge}</div>
                        <img src={property.image} alt={property.name} />
                        <div className="property-info">
                          <h3>{property.name}</h3>
                          <p>📍 {property.location}</p>
                          <p>Area: {property.area}</p>
                          {property.bedrooms && <p>🛏️ {property.bedrooms} BHK | 🚿 {property.bathrooms} Bath</p>}
                          <p className="property-price">{property.price}</p>
                          <span className={`status-badge ${property.status}`}>
                            {property.status === 'ready-to-move' ? 'Ready to Move' : 'Under Construction'}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </div>
            ) : (
              <div className="wishlist-grid">
                {filteredWishlist.map(property => (
                  <div key={property.id} className="wishlist-card">
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemove(property.id)}
                      title="Remove from wishlist"
                    >
                      ✕
                    </button>
                    <Link to={`/properties/${property.id}`} className="property-link">
                      <div className="property-badge">{property.badge}</div>
                      <img src={property.image} alt={property.name} />
                      <div className="property-info">
                        <h3>{property.name}</h3>
                        <p>📍 {property.location}</p>
                        <p>Area: {property.area}</p>
                        {property.bedrooms && <p>🛏️ {property.bedrooms} BHK | 🚿 {property.bathrooms} Bath</p>}
                        <p className="property-price">{property.price}</p>
                        <span className={`status-badge ${property.status}`}>
                          {property.status === 'ready-to-move' ? 'Ready to Move' : 'Under Construction'}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Start adding properties to your wishlist to keep track of your favorites</p>
            <Link to="/properties" className="browse-btn">
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
