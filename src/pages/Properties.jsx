import React, { useState } from 'react';
import './Properties.css';

const Properties = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const [propertiesList] = useState([
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

  const [filteredProperties, setFilteredProperties] = useState(propertiesList);

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
    setBedrooms('');
    setPriceRange('');
    setFilteredProperties(propertiesList);
  };

  return (
    <div className="properties-page">
      <div className="properties-hero">
        <h1>PROPERTIES FOR SALE</h1>
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
            <span className="icon">📍</span>
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

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
        <button className="reset-btn" onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>

      <div className="properties-controls">
        <div className="showing">
          <p>Showing {filteredProperties.length} of {propertiesList.length} properties</p>
        </div>
        <div className="sort-by">
          <button className="dropdown-btn">Sort by ▼</button>
        </div>
      </div>

      <div className="properties-grid">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <div key={property.id} className="property-card">
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
            </div>
          ))
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
