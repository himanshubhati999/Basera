import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';
import ShinyText from '../components/ShinyText';

const Wishlist = () => {
  const { user, wishlist, removeFromWishlist, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // All properties data (same as in Properties.jsx)
  const allProperties = useMemo(() => [
    {
      id: 1,
      name: 'Modern Apartment in Sector 62',
      location: 'Sector 62, Noida',
      area: '1200 sqft',
      price: '₹85 Lac',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
      badge: 'FEATURED',
      type: 'apartment',
      bedrooms: '2',
      bathrooms: '2',
      status: 'ready-to-move'
    },
    {
      id: 2,
      name: 'Luxury Villa with Garden',
      location: 'Greater Noida West',
      area: '3500 sqft',
      price: '₹2.5 Cr',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
      badge: 'PREMIUM',
      type: 'villa',
      bedrooms: '4',
      bathrooms: '4',
      status: 'ready-to-move'
    },
    {
      id: 3,
      name: 'Budget-Friendly 2BHK',
      location: 'Sector 137, Noida',
      area: '950 sqft',
      price: '₹42 Lac',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
      badge: 'BEST DEAL',
      type: 'apartment',
      bedrooms: '2',
      bathrooms: '2',
      status: 'under-construction'
    },
    {
      id: 4,
      name: 'Spacious 3BHK Penthouse',
      location: 'Sector 76, Noida',
      area: '2200 sqft',
      price: '₹1.45 Cr',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      badge: 'LUXURY',
      type: 'penthouse',
      bedrooms: '3',
      bathrooms: '3',
      status: 'ready-to-move'
    },
    {
      id: 5,
      name: 'Commercial Office Space',
      location: 'Sector 18, Noida',
      area: '1800 sqft',
      price: '₹1.8 Cr',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
      badge: 'COMMERCIAL',
      type: 'commercial',
      bedrooms: '',
      bathrooms: '2',
      status: 'ready-to-move'
    },
    {
      id: 6,
      name: 'Independent House',
      location: 'Alpha II, Greater Noida',
      area: '2800 sqft',
      price: '₹1.95 Cr',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      badge: 'NEW',
      type: 'house',
      bedrooms: '4',
      bathrooms: '3',
      status: 'ready-to-move'
    },
    {
      id: 7,
      name: 'Studio Apartment',
      location: 'Sector 142, Noida',
      area: '600 sqft',
      price: '₹32 Lac',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
      badge: 'AFFORDABLE',
      type: 'apartment',
      bedrooms: '1',
      bathrooms: '1',
      status: 'ready-to-move'
    },
    {
      id: 8,
      name: 'Duplex Villa',
      location: 'Yamuna Expressway',
      area: '4200 sqft',
      price: '₹3.2 Cr',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80',
      badge: 'PREMIUM',
      type: 'villa',
      bedrooms: '5',
      bathrooms: '5',
      status: 'under-construction'
    },
    {
      id: 9,
      name: 'Builder Floor',
      location: 'Sector 50, Noida',
      area: '1650 sqft',
      price: '₹98 Lac',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      badge: 'HOT DEAL',
      type: 'builder-floor',
      bedrooms: '3',
      bathrooms: '2',
      status: 'ready-to-move'
    },
    {
      id: 10,
      name: 'Farmhouse with Pool',
      location: 'Greater Noida',
      area: '5000 sqft',
      price: '₹4.5 Cr',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
      badge: 'LUXURY',
      type: 'farmhouse',
      bedrooms: '6',
      bathrooms: '6',
      status: 'ready-to-move'
    },
    {
      id: 11,
      name: 'Compact 1BHK',
      location: 'Sector 120, Noida',
      area: '750 sqft',
      price: '₹38 Lac',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      badge: 'BEST VALUE',
      type: 'apartment',
      bedrooms: '1',
      bathrooms: '1',
      status: 'ready-to-move'
    },
    {
      id: 12,
      name: 'Corner Plot Property',
      location: 'Sector 144, Noida',
      area: '2500 sqft',
      price: '₹1.65 Cr',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
      badge: 'PRIME LOCATION',
      type: 'house',
      bedrooms: '4',
      bathrooms: '4',
      status: 'under-construction'
    }
  ], []);

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

  const handleRemove = (propertyId) => {
    removeFromWishlist(propertyId);
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
          <button 
            className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveTab('featured')}
          >
            Featured Projects
            <span className="tab-count">{categorizedWishlist.featured.length}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
            <span className="tab-count">{categorizedWishlist.projects.length}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Properties
            <span className="tab-count">{categorizedWishlist.properties.length}</span>
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
