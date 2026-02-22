import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Projects.css';
import '../components/ButtonGlare.css';
import ShinyText from '../components/ShinyText';

const Projects = () => {
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [choices, setChoices] = useState('');
  const [floors, setFloors] = useState('');
  const [flatRange, setFlatRange] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize search params from URL
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlLocation = searchParams.get('location') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlPriceFrom = searchParams.get('priceFrom') || '';
    const urlPriceTo = searchParams.get('priceTo') || '';
    
    setKeyword(urlKeyword);
    setLocation(urlLocation);
    if (urlCategory) setChoices(urlCategory);
    if (urlPriceFrom) setPriceFrom(urlPriceFrom);
    if (urlPriceTo) setPriceTo(urlPriceTo);
  }, [searchParams]);

  // Fetch properties from database
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.PROPERTIES);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      
      // Transform backend data to match frontend format and filter only published projects
      const transformedProjects = data.properties
        .filter(prop => prop.propertyType === 'project' && prop.isPublished === true) // Only show published projects
        .map(prop => ({
          id: prop._id,
          name: prop.title?.trim() || 'Untitled Project',
          location: prop.location?.city || prop.location?.address || 'Location not specified',
          area: prop.area?.value ? `${prop.area.value} ${prop.area.unit || 'sqm'}` : 'Area not specified',
          price: `₹${prop.price.toLocaleString('en-IN')}`,
          image: prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
          badge: prop.status === 'available' ? 'AVAILABLE' : 'SOLD',
          type: prop.propertyType?.toLowerCase() || 'residential',
          bhk: prop.bedrooms ? `${prop.bedrooms}bhk` : '',
          floors: '3',
          status: 'sale'
        }));
      
      setProjectsList(transformedProjects);
      setFilteredProjects(transformedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      // Keep empty array if fetch fails
      setProjectsList([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when projects are loaded and search params exist
  useEffect(() => {
    if (projectsList.length > 0 && (keyword || location || choices || floors || flatRange || priceFrom || priceTo)) {
      handleSearch();
    }
  }, [projectsList, keyword, location, choices, floors, flatRange, priceFrom, priceTo]);

  const [oldProjectsList] = useState([
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
      floors: '3',
      status: 'sale'
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
      floors: '2',
      status: 'sale'
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
      floors: '4+',
      status: 'construction'
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
      floors: '3',
      status: 'sale'
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
      floors: '4+',
      status: 'construction'
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
      floors: '2',
      status: 'sale'
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
      floors: '3',
      status: 'construction'
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
      floors: '',
      status: 'sale'
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
      floors: '4+',
      status: 'construction'
    }
  ]);

  const [filteredProjects, setFilteredProjects] = useState([]);

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
    
    // Filter by custom price from/to (from search bar)
    if (priceFrom || priceTo) {
      filtered = filtered.filter(project => {
        // Extract numeric price from string like "₹45 Lac Onwards" or "₹1.2 Cr"
        const priceStr = project.price.replace(/[^\d.]/g, '');
        let price = parseFloat(priceStr);
        
        // Convert to lakhs for comparison
        if (project.price.includes('Cr')) {
          price = price * 100; // Convert crores to lakhs
        }
        
        const from = priceFrom ? parseFloat(priceFrom) : 0;
        const to = priceTo ? parseFloat(priceTo) : Infinity;
        return price >= from && price <= to;
      });
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
    setPriceFrom('');
    setPriceTo('');
    setFilteredProjects(projectsList);
  };

  const handleWishlistToggle = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/projects' } });
      return;
    }

    const result = await toggleWishlist(projectId);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="projects-page">
      <Helmet>
        <title>Our Projects - Residential & Commercial Properties | Basera Infra Home</title>
        <meta 
          name="description" 
          content="Explore premium residential and commercial property projects in Greater Noida. Find your dream plot, apartment, or investment opportunity with Basera Infra Home." 
        />
        <meta property="og:title" content="Our Projects - Basera Infra Home" />
        <meta property="og:description" content="Explore premium residential and commercial property projects in Greater Noida." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="real estate projects, Greater Noida properties, residential plots, commercial properties, property investment" />
        <link rel="canonical" href="https://baserainfrahome.com/projects" />
      </Helmet>
      
      <div className="projects-hero">
        <h1>
          <ShinyText
            text="DISCOVER OUR PROJECTS"
            speed={3}
            delay={0}
            color="#ffffff"
            shineColor="#ff0000"
            spread={120}
            direction="left"
          />
        </h1>
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
            <span className="icon"><span className="material-symbols-outlined">location_on</span></span>
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

        <button className="search-btn btn-glare" onClick={handleSearch}>
          Search
        </button>
        <button className="reset-btn btn-glare" onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>

      <div className="projects-controls">
        <div className="showing">
          <p>Showing {filteredProjects.length} of {projectsList.length} projects</p>
        </div>
      </div>

      <div className="projects-grid">
        {loading ? (
          <div className="loading-state">
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <h3>Error loading projects</h3>
            <p>{error}</p>
            <button onClick={fetchProjects} className="btn-glare">Retry</button>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} className="project-card-link">
              <div className="project-card">
                <div className="project-badge">{project.badge}</div>
                <button 
                  className={`wishlist-heart ${isInWishlist(project.id) ? 'active' : ''}`}
                  onClick={(e) => handleWishlistToggle(e, project.id)}
                  title={isInWishlist(project.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <span className="material-symbols-outlined">{isInWishlist(project.id) ? 'favorite' : 'favorite_border'}</span>
                </button>
                <img src={project.image} alt={project.name} />
                <div className="project-info">
                  <h3 style={{ display: 'block', minHeight: '20px' }}>{project.name || 'Project Name'}</h3>
                  <p><span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle'}}>location_on</span> {project.location}</p>
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
