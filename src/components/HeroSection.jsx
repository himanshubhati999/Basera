import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";
import "./ButtonGlare.css";

const HeroSection = ({ onCategoryChange, selectedCategory }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [category, setCategory] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const handleTabClick = (tab) => {
    if (onCategoryChange) {
      onCategoryChange(tab);
    }
  };

  const handleSearch = () => {
    // Build search params
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    if (category) params.append("category", category);
    if (priceFrom) params.append("priceFrom", priceFrom);
    if (priceTo) params.append("priceTo", priceTo);

    // Determine which page to navigate to based on selectedCategory
    let searchPath = "/properties";
    if (selectedCategory === "projects") {
      searchPath = "/projects";
    } else if (selectedCategory === "sale") {
      params.append("listingType", "sale");
    } else if (selectedCategory === "rent") {
      params.append("listingType", "rent");
    }

    // Navigate to the appropriate page with search params
    navigate(`${searchPath}?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="hero-section-component">
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          
            <button
              className={` po ${selectedCategory === "projects" ? "active" : ""}`}
              onClick={() => handleTabClick("projects")}
            >
              Projects
            </button>
      

         
            <button
              className={`po ${selectedCategory === "sale" ? "active" : ""}`}
              onClick={() => handleTabClick("sale")}
            >
              Sale
            </button>
          

          
            <button
              className={ `po ${selectedCategory === "rent" ? "active" : ""}`}
              onClick={() => handleTabClick("rent")}
            >
              Rent
            </button>
          

          <div className="search-container">
            <div className="op">
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

              <div className="search-input-group">
                <span className="location-icon">
                  <span className="material-symbols-outlined">location_on</span>
                </span>
                <input
                  type="text"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
              Advanced {showAdvanced ? "▲" : "▼"}
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
                    <option value="">-- Select --</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office</option>
                  </select>
                </div>

                <div className="advanced-field">
                  <label>Price from (₹)</label>
                  <input
                    type="number"
                    placeholder="From"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="advanced-input"
                  />
                </div>

                <div className="advanced-field">
                  <label>Price to (₹)</label>
                  <input
                    type="number"
                    placeholder="To"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="advanced-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
