import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ compact = false }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [category, setCategory] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [propertyType, setPropertyType] = useState('properties'); // properties or projects

  const handleSearch = () => {
    // Build search params
    const params = new URLSearchParams();
    
    if (keyword) params.append('keyword', keyword);
    if (locationSearch) params.append('location', locationSearch);
    if (category) params.append('category', category);
    if (priceFrom) params.append('priceFrom', priceFrom);
    if (priceTo) params.append('priceTo', priceTo);
    
    // Determine which page to navigate to
    let searchPath = propertyType === 'projects' ? '/projects' : '/properties';
    
    // Navigate to the appropriate page with search params
    navigate(`${searchPath}?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (compact) {
    return (
      <div className="search-bar-component">
        <div className="compact-search-bar">
          <div className="search-toggle-group">
            <button 
              className={`search-toggle-btn ${propertyType === 'properties' ? 'active' : ''}`}
              onClick={() => setPropertyType('properties')}
            >
              Properties
            </button>
            <button 
              className={`search-toggle-btn ${propertyType === 'projects' ? 'active' : ''}`}
              onClick={() => setPropertyType('projects')}
            >
              Projects
            </button>
          </div>
          <div className="compact-search-inputs">
          <input 
            type="text" 
            placeholder="Search keyword..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="compact-input"
          />
          <input 
            type="text" 
            placeholder="Location..." 
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="compact-input"
          />
          <button className="compact-search-btn" onClick={handleSearch}>
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
        
        {showAdvanced && (
          <div className="compact-advanced">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="compact-select"
            >
              <option value="">Category</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
            </select>
            <input 
              type="number" 
              placeholder="Min Price" 
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="compact-input-small"
            />
            <input 
              type="number" 
              placeholder="Max Price" 
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="compact-input-small"
            />
          </div>
        )}
        
        <button 
          className="advanced-toggle-compact"
          onClick={() => setShowAdvanced(!showAdvanced)}
          title="Advanced search"
        >
          <span className="material-symbols-outlined">tune</span>
        </button>
        </div>
      </div>
    );
  }

  // Full search bar (original HeroSection style)
  return (
    <div className="search-bar-component">
      <div className="full-search-bar">
        <div className="search-tabs">
          <button 
            className={`search-tab ${propertyType === 'properties' ? 'active' : ''}`}
            onClick={() => setPropertyType('properties')}
          >
            Properties
          </button>
          <button 
            className={`search-tab ${propertyType === 'projects' ? 'active' : ''}`}
            onClick={() => setPropertyType('projects')}
          >
            Projects
          </button>
        </div>
      
      <div className="search-form">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Enter keyword..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>
        
        <div className="search-divider"></div>
        
        <div className="search-input-group">
          <span className="location-icon"><span className="material-symbols-outlined">location_on</span></span>
          <input 
            type="text" 
            placeholder="City, State" 
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>
        
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      
      <button 
        className="advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        Advanced {showAdvanced ? '▲' : '▼'}
      </button>

      {showAdvanced && (
        <div className="advanced-search">
          <div className="advanced-field">
            <label>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="advanced-select"
            >
              <option value="">Select Category</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
            </select>
          </div>
          
          <div className="advanced-field">
            <label>Price From</label>
            <input 
              type="number" 
              placeholder="Min Price" 
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="advanced-input"
            />
          </div>
          
          <div className="advanced-field">
            <label>Price To</label>
            <input 
              type="number" 
              placeholder="Max Price" 
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="advanced-input"
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SearchBar;
