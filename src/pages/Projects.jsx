import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [choices, setChoices] = useState('');
  const [floors, setFloors] = useState('');
  const [flatRange, setFlatRange] = useState('');

  const [projectsList] = useState([
    {
      id: 1,
      name: 'Yamuna Sector 20',
      location: 'Greater Noida, Uttar Pradesh',
      area: '800 sqm to 2000 sqm',
      price: '₹45 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      badge: 'BEST',
      type: 'residential',
      bhk: '2bhk',
      floors: '3'
    },
    {
      id: 2,
      name: 'Sky Villa Residency',
      location: 'Noida Extension, Uttar Pradesh',
      area: '1200 sqm to 3000 sqm',
      price: '₹75 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      badge: 'PREMIUM',
      type: 'villa',
      bhk: '3bhk',
      floors: '2'
    },
    {
      id: 3,
      name: 'Green Park Apartments',
      location: 'Sector 62, Noida',
      area: '600 sqm to 1500 sqm',
      price: '₹35 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
      badge: 'FEATURED',
      type: 'apartment',
      bhk: '2bhk',
      floors: '4+'
    },
    {
      id: 4,
      name: 'Royal Heights',
      location: 'Alpha II, Greater Noida',
      area: '1000 sqm to 2500 sqm',
      price: '₹60 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      badge: 'NEW',
      type: 'residential',
      bhk: '3bhk',
      floors: '3'
    },
    {
      id: 5,
      name: 'Tech Park Commercial Hub',
      location: 'Sector 18, Noida',
      area: '500 sqm to 5000 sqm',
      price: '₹1.2 Cr Onwards',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
      badge: 'COMMERCIAL',
      type: 'commercial',
      bhk: '',
      floors: '4+'
    },
    {
      id: 6,
      name: 'Lake View Villas',
      location: 'Tau Devi Lal Park Area, Greater Noida',
      area: '1500 sqm to 4000 sqm',
      price: '₹95 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80',
      badge: 'LUXURY',
      type: 'villa',
      bhk: '4bhk',
      floors: '2'
    },
    {
      id: 7,
      name: 'Urban Square Apartments',
      location: 'Sector 137, Noida',
      area: '700 sqm to 1800 sqm',
      price: '₹42 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
      badge: 'FEATURED',
      type: 'apartment',
      bhk: '2bhk',
      floors: '3'
    },
    {
      id: 8,
      name: 'Prime Land Plots',
      location: 'Yamuna Expressway, Greater Noida',
      area: '1000 sqm to 10000 sqm',
      price: '₹25 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
      badge: 'INVESTMENT',
      type: 'land',
      bhk: '',
      floors: ''
    },
    {
      id: 9,
      name: 'Sunrise Towers',
      location: 'Sector 76, Noida',
      area: '900 sqm to 2200 sqm',
      price: '₹52 Lac Onwards',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      badge: 'BEST',
      type: 'residential',
      bhk: '3bhk',
      floors: '4+'
    }
  ]);

  const [filteredProjects, setFilteredProjects] = useState(projectsList);

  const handleSearch = () => {
    let filtered = [...projectsList];

    // Filter by keyword (searches in name and location)
    if (keyword.trim()) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(keyword.toLowerCase()) ||
        project.location.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Filter by location
    if (location.trim()) {
      filtered = filtered.filter(project => 
        project.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by choices (type/category)
    if (choices) {
      filtered = filtered.filter(project => 
        project.type === choices
      );
    }

    // Filter by floors (you can add floors property to projects if needed)
    if (floors) {
      filtered = filtered.filter(project => 
        project.floors === floors
      );
    }

    // Filter by flat range (BHK)
    if (flatRange) {
      filtered = filtered.filter(project => 
        project.bhk === flatRange
      );
    }

    setFilteredProjects(filtered);
    console.log('Search results:', filtered.length, 'projects found');
  };

  // Reset filters
  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setChoices('');
    setFloors('');
    setFlatRange('');
    setFilteredProjects(projectsList);
  };

  return (
    <div className="projects-page">
      <div className="projects-hero">
        <h1>DISCOVER OUR PROJECTS</h1>
        <p>We make the best choices with the hottest and most prestigious projects, please visit the details below to find out more</p>
        <div className="breadcrumb">
          <a href="/">Home</a> / <span>Projects</span>
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
              placeholder="City, State" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <span className="icon">📍</span>
          </div>
        </div>

        <div className="filter-group">
          <label>Choices</label>
          <select value={choices} onChange={(e) => setChoices(e.target.value)}>
            <option value="">Type, category...</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Floors</label>
          <select value={floors} onChange={(e) => setFloors(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Flat range</label>
          <select value={flatRange} onChange={(e) => setFlatRange(e.target.value)}>
            <option value="">All flats</option>
            <option value="1bhk">1 BHK</option>
            <option value="2bhk">2 BHK</option>
            <option value="3bhk">3 BHK</option>
            <option value="4bhk">4 BHK</option>
          </select>
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
        <button className="reset-btn" onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>

      <div className="projects-controls">
        <div className="showing">
          <p>Showing {filteredProjects.length} of {projectsList.length} projects</p>
        </div>
        <div className="sort-by">
          <button className="dropdown-btn">Sort by ▼</button>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} className="project-card-link">
              <div className="project-card">
                <div className="project-badge">{project.badge}</div>
                <img src={project.image} alt={project.name} />
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>📍 {project.location}</p>
                  <p>Area: {project.area}</p>
                  <p>Starting price: {project.price}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <h3>No projects found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
