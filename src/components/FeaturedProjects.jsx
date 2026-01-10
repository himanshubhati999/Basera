import React, { useState } from 'react';
import './FeaturedProjects.css';

const FeaturedProjects = ({ selectedCategory = 'projects' }) => {
  const [projects] = useState([
    {
      id: 1,
      name: 'Yamuna Sector 20',
      location: 'Greater Noida, Uttar Pradesh',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
      isFavorite: false,
      type: 'projects'
    },
    {
      id: 2,
      name: 'Sky Villa Residency',
      location: 'Noida Extension, Uttar Pradesh',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      isFavorite: false,
      type: 'projects'
    },
    {
      id: 3,
      name: 'Green Park Apartments',
      location: 'Sector 62, Noida',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
      isFavorite: false,
      type: 'projects'
    },
    {
      id: 4,
      name: 'Royal Heights',
      location: 'Alpha II, Greater Noida',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      isFavorite: false,
      type: 'projects'
    },
    {
      id: 5,
      name: 'Sunshine Towers',
      location: 'Sector 18, Noida',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      isFavorite: false,
      type: 'projects'
    },
    {
      id: 6,
      name: 'Lake View Villas',
      location: 'Tau Devi Lal Bio Diversity Park Area',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80',
      isFavorite: false,
      type: 'projects'
    }
  ]);

  const [saleProperties] = useState([
    {
      id: 7,
      name: '3 BHK Luxury Apartment',
      location: 'Sector 137, Noida',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
      price: '₹85 Lakhs',
      type: 'sale'
    },
    {
      id: 8,
      name: 'Premium Villa',
      location: 'Greater Noida West',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
      price: '₹1.2 Crores',
      type: 'sale'
    },
    {
      id: 9,
      name: '4 BHK Penthouse',
      location: 'Sector 50, Noida',
      image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=400&q=80',
      price: '₹1.8 Crores',
      type: 'sale'
    },
    {
      id: 10,
      name: '2 BHK Modern Apartment',
      location: 'Sector 76, Noida',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
      price: '₹55 Lakhs',
      type: 'sale'
    },
    {
      id: 11,
      name: 'Duplex Villa',
      location: 'Sector 150, Noida',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
      price: '₹95 Lakhs',
      type: 'sale'
    },
    {
      id: 12,
      name: 'Studio Apartment',
      location: 'Sector 62, Noida',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
      price: '₹35 Lakhs',
      type: 'sale'
    }
  ]);

  const [rentProperties] = useState([
    {
      id: 13,
      name: '2 BHK Furnished Apartment',
      location: 'Sector 78, Noida',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80',
      price: '₹25,000/month',
      type: 'rent'
    },
    {
      id: 14,
      name: '3 BHK Semi-Furnished',
      location: 'Sector 120, Noida',
      image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&q=80',
      price: '₹35,000/month',
      type: 'rent'
    },
    {
      id: 15,
      name: '1 BHK Compact Apartment',
      location: 'Sector 16, Noida',
      image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&q=80',
      price: '₹15,000/month',
      type: 'rent'
    },
    {
      id: 16,
      name: '4 BHK Luxury Penthouse',
      location: 'Sector 44, Noida',
      image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400&q=80',
      price: '₹75,000/month',
      type: 'rent'
    },
    {
      id: 17,
      name: '2 BHK Ready to Move',
      location: 'Sector 137, Noida',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80',
      price: '₹22,000/month',
      type: 'rent'
    },
    {
      id: 18,
      name: '3 BHK Fully Furnished',
      location: 'Greater Noida West',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&q=80',
      price: '₹40,000/month',
      type: 'rent'
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

  // Get the appropriate data based on selected category
  const getDisplayData = () => {
    switch(selectedCategory) {
      case 'sale':
        return { data: saleProperties, title: 'Apartments for Sale' };
      case 'rent':
        return { data: rentProperties, title: 'Apartments for Rent' };
      default:
        return { data: projects, title: 'Featured projects' };
    }
  };

  const { data, title } = getDisplayData();

  return (
    <section className="featured-projects">
      <div className="featured-projects-container">
        <h2 className="section-title">{title}</h2>
        <p className="section-description">
          {selectedCategory === 'projects' 
            ? 'We make the best choices with the hottest and most prestigious projects, please visit the details below to find out more.'
            : selectedCategory === 'sale'
            ? 'Browse through our exclusive collection of apartments available for sale.'
            : 'Find your perfect rental apartment from our curated selection.'
          }
        </p>
        
        <div className="projects-grid">
          {data.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.name} />
                <button 
                  className={`favorite-btn ${favorites.includes(project.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(project.id)}
                >
                  ❤
                </button>
                {project.price && (
                  <div className="price-badge">{project.price}</div>
                )}
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
