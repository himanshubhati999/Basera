import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import './Maps.css';

const Maps = () => {
  const [searchParams] = useSearchParams();
  const selectedMap = searchParams.get('map');

  const mapImages = [
    {
      id: 2,
      key: 'yamuna-expressway',
      type: 'pdf',
      url: '/Yamuna Maps (1).pdf',
      title: 'Yamuna Expressway Map (PDF)',
      description: 'Yamuna Expressway map preview. Click to open the full PDF.'
    },
    {
      id: 3,
      key: 'greater-noida',
      type: 'pdf',
      url: '/Greater Noida Map Book_03092010_FINAL.pdf',
      title: 'Greater Noida Map (PDF)',
      description: 'Official Greater Noida map book preview. Click to open the full PDF.'
    }
  ];

  const filteredMaps = selectedMap
    ? mapImages.filter((map) => map.key === selectedMap)
    : mapImages;
  const visibleMaps = filteredMaps.length > 0 ? filteredMaps : mapImages;

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
          {visibleMaps.map((map) => (
            <div key={map.id} className="map-card">
              <div className="map-image-wrapper">
                {map.type === 'pdf' ? (
                  <a
                    href={map.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${map.title}`}
                  >
                    <iframe
                      src={`${map.url}#toolbar=0&navpanes=0&scrollbar=0`}
                      title={map.title}
                      className="map-pdf-preview"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <img
                    src={map.url}
                    alt={map.title}
                    className="map-image"
                    loading="lazy"
                  />
                )}
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
                  {map.type === 'pdf' ? 'Open PDF' : 'View Full Size'}
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
