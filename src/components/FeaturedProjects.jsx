import React, { useState } from 'react';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
  const [projects] = useState([
    {
      id: 1,
      name: 'Yamuna Sector 20',
      location: 'Greater Noida, Uttar Pradesh',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Sky Villa Residency',
      location: 'Noida Extension, Uttar Pradesh',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      isFavorite: false
    },
    {
      id: 3,
      name: 'Green Park Apartments',
      location: 'Sector 62, Noida',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
      isFavorite: false
    },
    {
      id: 4,
      name: 'Royal Heights',
      location: 'Alpha II, Greater Noida',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      isFavorite: false
    },
    {
      id: 5,
      name: 'Sunshine Towers',
      location: 'Sector 18, Noida',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      isFavorite: false
    },
    {
      id: 6,
      name: 'Lake View Villas',
      location: 'Tau Devi Lal Bio Diversity Park Area',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80',
      isFavorite: false
    }
  ]);

  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (projectId) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <section className="featured-projects">
      <div className="featured-projects-container">
        <h2 className="section-title">Featured projects</h2>
        <p className="section-description">
          We make the best choices with the hottest and most prestigious projects, 
          please visit the details below to find out more.
        </p>
        
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.name} />
                <button 
                  className={`favorite-btn ${favorites.includes(project.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(project.id)}
                >
                  ❤
                </button>
              </div>
              <div className="project-info">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-location">
                  📍 {project.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
