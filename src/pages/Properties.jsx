import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Properties.css';
import './PropertyCardEnhancements.css';
import '../components/ButtonGlare.css';
import ShinyText from '../components/ShinyText';

const Properties = () => {
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [listingType, setListingType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize search params from URL
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlLocation = searchParams.get('location') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlListingType = searchParams.get('listingType') || '';
    const urlPriceFrom = searchParams.get('priceFrom') || '';
    const urlPriceTo = searchParams.get('priceTo') || '';
    
    setKeyword(urlKeyword);
    setLocation(urlLocation);
    if (urlCategory) setPropertyType(urlCategory);
    if (urlListingType) setListingType(urlListingType);
    
    // Convert price range to our format
    if (urlPriceFrom || urlPriceTo) {
      const from = parseFloat(urlPriceFrom) || 0;
      const to = parseFloat(urlPriceTo) || Infinity;
      
      if (to < 50) setPriceRange('under-50');
      else if (from >= 50 && to < 100) setPriceRange('50-100');
      else if (from >= 100 && to < 200) setPriceRange('100-200');
      else if (from >= 200) setPriceRange('above-200');
    }
  }, [searchParams]);

  // Fetch properties from database
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.PROPERTIES);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      
      console.log('=== FETCHED PROPERTIES ===');
      console.log('Total properties:', data.properties?.length);
      console.log('Sample property data:', data.properties?.slice(0, 3).map(p => ({ 
        _id: p._id, 
        title: p.title,
        area: p.area,
        location: p.location
      })));
      
      // Transform backend data to match frontend format and show only published properties (exclude projects)
      const transformedProperties = data.properties
        .filter(prop => prop.propertyType !== 'project' && prop.isPublished === true) // Only published properties, exclude projects
        .map(prop => {
          console.log('Transforming property:', {
            title: prop.title,
            _id: prop._id,
            area: prop.area,
            areaValue: prop.area?.value,
            areaUnit: prop.area?.unit
          });
          return {
            id: prop._id,
            name: prop.title?.trim() || 'Untitled Property',
            location: prop.location?.city || prop.location?.address || 'Location not specified',
            area: prop.area?.value ? `${prop.area.value} ${prop.area.unit || 'sqft'}` : 'N/A',
            price: `₹${prop.price.toLocaleString('en-IN')}`,
            image: prop.images?.[0] || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80',
            badge: prop.status === 'available' ? 'AVAILABLE' : 'SOLD',
            type: prop.propertyType?.toLowerCase() || 'apartment',
            listingType: prop.listingType || 'sale',
            bedrooms: prop.bedrooms?.toString() || '',
            bathrooms: prop.bathrooms?.toString() || '',
            status: prop.status || 'ready-to-move'
          };
        });
      
      console.log('Transformed properties count:', transformedProperties.length);
      console.log('Sample transformed data:', transformedProperties.slice(0, 3).map(p => ({ id: p.id, name: p.name, area: p.area })));
      
      setPropertiesList(transformedProperties);
      setFilteredProperties(transformedProperties);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
      // Keep empty array if fetch fails
      setPropertiesList([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when properties are loaded and search params exist
  useEffect(() => {
    if (propertiesList.length > 0 && (keyword || location || propertyType || listingType || bedrooms || priceRange)) {
      handleSearch();
    }
  }, [propertiesList, keyword, location, propertyType, listingType, bedrooms, priceRange]);

  const [oldPropertiesList] = useState([
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
  ]);

  const [filteredProperties, setFilteredProperties] = useState([]);

  const handleSearch = () => {
    let filtered = [...propertiesList];

    // Filter by keyword (searches in name and location)
    if (keyword.trim()) {
      filtered = filtered.filter(property => 
        property.name.toLowerCase().includes(keyword.toLowerCase()) ||
        property.location.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Filter by location
    if (location.trim()) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by property type
    if (propertyType) {
      filtered = filtered.filter(property => 
        property.type === propertyType
      );
    }

    // Filter by listing type (sale/rent)
    if (listingType) {
      filtered = filtered.filter(property => 
        property.listingType === listingType
      );
    }

    // Filter by bedrooms
    if (bedrooms) {
      filtered = filtered.filter(property => 
        property.bedrooms === bedrooms
      );
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(property => {
        const price = parseFloat(property.price.replace(/[^\d.]/g, ''));
        
        switch(priceRange) {
          case 'under-50':
            return price < 50;
          case '50-100':
            return price >= 50 && price < 100;
          case '100-200':
            return price >= 100 && price < 200;
          case 'above-200':
            return price >= 200;
          default:
            return true;
        }
      });
    }

    setFilteredProperties(filtered);
    console.log('Search results:', filtered.length, 'properties found');
  };

  // Reset filters
  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setPropertyType('');
    setListingType('');
    setBedrooms('');
    setPriceRange('');
    setFilteredProperties(propertiesList);
  };

  const handleWishlistToggle = async (e, propertyId) => {
    e.preventDefault(); // Prevent navigation to property detail
    e.stopPropagation();
    
    console.log('=== WISHLIST TOGGLE CLICKED ===');
    console.log('Property ID:', propertyId);
    console.log('Property ID type:', typeof propertyId);
    console.log('Property ID length:', propertyId?.length);
    console.log('Is valid ObjectId format:', /^[0-9a-fA-F]{24}$/.test(propertyId));
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/properties' } });
      return;
    }

    const result = await toggleWishlist(propertyId);
    console.log('Toggle result:', result);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="properties-page">
      <div className="properties-hero">
        <h1>
          <ShinyText
            text="PROPERTIES FOR SALE"
            speed={3}
            delay={0}
            color="#ffffff"
            shineColor="#ff0000"
            spread={120}
            direction="left"
          />
        </h1>
        <p>Find your dream home from our extensive collection of premium properties across prime locations</p>
        <div className="breadcrumb">
          <a href="/">Home</a> / <span>Properties</span>
        </div>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label>Keyword</label>
          <div className="input-with-icon">
            <input 
              type="text" 
              placeholder="Enter keyword..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <span className="icon">🔍</span>
          </div>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <div className="input-with-icon">
            <input 
              type="text" 
              placeholder="City, Sector..." 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <span className="icon"><span className="material-symbols-outlined">location_on</span></span>
          </div>
        </div>

        <div className="filter-group">
          <label>Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="penthouse">Penthouse</option>
            <option value="builder-floor">Builder Floor</option>
            <option value="farmhouse">Farmhouse</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Listing Type</label>
          <select value={listingType} onChange={(e) => setListingType(e.target.value)}>
            <option value="">All</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5+ BHK</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">All Prices</option>
            <option value="under-50">Under ₹50 Lac</option>
            <option value="50-100">₹50 Lac - ₹1 Cr</option>
            <option value="100-200">₹1 Cr - ₹2 Cr</option>
            <option value="above-200">Above ₹2 Cr</option>
          </select>
        </div>

        <button className="search-btn btn-glare" onClick={handleSearch}>
          Search
        </button>
        <button className="reset-btn btn-glare" onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>

      <div className="properties-controls">
        <div className="showing">
          <p>Showing {filteredProperties.length} of {propertiesList.length} properties</p>
        </div>
      </div>

      <div className="properties-grid">
        {loading ? (
          <div className="loading-state">
            <p>Loading properties...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <h3>Error loading properties</h3>
            <p>{error}</p>
            <button onClick={fetchProperties} className="btn-glare">Retry</button>
          </div>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map(property => {
            console.log('Rendering property:', { id: property.id, name: property.name, idType: typeof property.id, idLength: property.id?.length });
            return (
            <Link to={`/properties/${property.id}`} key={property.id} className="property-card-link">
              <div className="property-card">
                <div className="property-badge">{property.badge}</div>
                <div className={`listing-type-badge ${property.listingType}`}>
                  {property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                </div>
                <button 
                  className={`wishlist-heart ${isInWishlist(property.id) ? 'active' : ''}`}
                  onClick={(e) => handleWishlistToggle(e, property.id)}
                  title={isInWishlist(property.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <span className="material-symbols-outlined">{isInWishlist(property.id) ? 'favorite' : 'favorite_border'}</span>
                </button>
                <img src={property.image} alt={property.name} />
                <div className="property-info">
                  <h3 style={{ display: 'block', minHeight: '20px' }}>{property.name || 'Property Name'}</h3>
                  <p>📍 {property.location}</p>
                  {property.bedrooms && <p>🛏️ {property.bedrooms} BHK • {property.area} • 🚿 {property.bathrooms} Bath</p>}
                  <p className="property-price">{property.price}</p>
                  <span className={`status-badge ${property.status}`}>
                    {property.status === 'ready-to-move' ? 'Ready to Move' : 'Under Construction'}
                  </span>
                </div>
              </div>
            </Link>
          )})
        ) : (
          <div className="no-results">
            <h3>No properties found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
