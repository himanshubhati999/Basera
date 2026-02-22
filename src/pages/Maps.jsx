import React from 'react';
import { Helmet } from 'react-helmet-async';
import './Maps.css';

const Maps = () => {
  const mapImages = [
    {
      id: 1,
      url: 'https://res.cloudinary.com/dxxsh8aha/image/upload/v1771740392/WhatsApp_Image_2026-02-19_at_01.20.45_bpf4eb.jpg',
      title: 'Location Map 1',
      description: 'Detailed area map showing key landmarks and connectivity'
    },
    {
      id: 2,
      url: 'https://res.cloudinary.com/dxxsh8aha/image/upload/v1771740378/WhatsApp_Image_2026-02-19_at_01.19.41_xtayvb.jpg',
      title: 'Location Map 2',
      description: 'Comprehensive location overview with nearby facilities'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Location Maps - Properties in Greater Noida | Basera Infra Home</title>
        <meta 
          name="description" 
          content="Explore detailed location maps of our premium properties in Greater Noida. View connectivity, nearby landmarks and strategic locations." 
        />
        <meta property="og:title" content="Location Maps - Basera Infra Home" />
        <meta name="keywords" content="property location maps, Greater Noida property maps, location connectivity, property landmarks" />
        <link rel="canonical" href="https://baserainfrahome.com/maps" />
      </Helmet>
      
      <div className="maps-page">
      {/* Hero Section */}
      <div className="maps-hero">
        <div className="maps-hero-content">
          <h1>Location Maps</h1>
          <p>Explore our prime locations and strategic connectivity</p>
        </div>
      </div>

      {/* Maps Grid */}
      <div className="maps-container">
        <div className="maps-grid">
          {mapImages.map((map) => (
            <div key={map.id} className="map-card">
              <div className="map-image-wrapper">
                <img 
                  src={map.url} 
                  alt={map.title}
                  className="map-image"
                  loading="lazy"
                />
              </div>
              <div className="map-info">
                <h3>{map.title}</h3>
                <p>{map.description}</p>
                <a 
                  href={map.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-full-btn"
                >
                  <span className="material-symbols-outlined">zoom_in</span>
                  View Full Size
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Maps;
