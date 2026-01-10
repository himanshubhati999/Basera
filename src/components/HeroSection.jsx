import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection = ({ onCategoryChange, selectedCategory }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [category, setCategory] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const handleTabClick = (tab) => {
    if (onCategoryChange) {
      onCategoryChange(tab);
    }
  };

  const handleSearch = () => {
    console.log('Searching...', { 
      activeTab: selectedCategory, 
      keyword, 
      location, 
      category, 
      priceFrom, 
      priceTo 
    });
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="search-container">
          <div className="search-tabs">
            <button 
              className={`search-tab ${selectedCategory === 'projects' ? 'active' : ''}`}
              onClick={() => handleTabClick('projects')}
            >
              Projects
            </button>
            <button 
              className={`search-tab ${selectedCategory === 'sale' ? 'active' : ''}`}
              onClick={() => handleTabClick('sale')}
            >
              Sale
            </button>
            <button 
              className={`search-tab ${selectedCategory === 'rent' ? 'active' : ''}`}
              onClick={() => handleTabClick('rent')}
            >
              Rent
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
                className="search-input"
              />
            </div>
            
            <div className="search-divider"></div>
            
            <div className="search-input-group">
              <span className="location-icon">📍</span>
              <input 
                type="text" 
                placeholder="City, State" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                  <option value="office">Office</option>
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
    </section>
  );
};

export default HeroSection;
