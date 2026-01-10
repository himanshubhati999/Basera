import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  // Sample project data - in a real app, this would come from an API or context
  const projects = [
    {
      id: 1,
      name: 'Yamuna Sector 20',
      location: 'Greater Noida, Uttar Pradesh',
      date: 'Dec 14, 2025',
      area: '800 sqm to 2000 sqm',
      price: '₹45 Lac Onwards',
      status: 'Selling',
      category: 'Plots',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80'
      ],
      description: {
        intro: 'offers premium residential plots in one of the fastest-growing real estate destinations near the Noida International Airport (Jewar Airport). This well-planned plotted development is designed for both smart investors and homebuyers looking for long-term growth and peaceful living.',
        location: 'Strategically located near the Yamuna Expressway, Jewar Green City enjoys excellent connectivity to Greater Noida, Noida, Delhi, and Agra, making it a highly desirable investment location. With massive infrastructure developments like the international airport, proposed metro connectivity, Film City, and industrial corridors, the area promises strong appreciation in the coming years.',
        layout: 'The project features a gated community layout with wide internal roads, green parks, street lighting, and essential infrastructure such as water and electricity provisions. The surroundings offer a clean, green environment away from city congestion while remaining well-connected to upcoming commercial and employment hubs.',
        ideal: [
          'Building your dream home',
          'Long-term investment',
          'Securing property near a future global airport hub'
        ],
        conclusion: 'With rising demand and limited availability of quality plotted developments in the Jewar region, Jewar Green City stands out as a safe, future-ready, and value-driven investment opportunity.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🏊', name: 'Swimming pool' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🌳', name: 'Garden' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🧺', name: 'Laundry Room' },
        { icon: '🐕', name: 'Pets Allow' },
        { icon: '🔒', name: 'Security' },
        { icon: '🔥', name: 'Central Heating' },
        { icon: '💆', name: 'Spa & Massage' },
        { icon: '🏡', name: 'Balcony' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 2,
      name: 'Sky Villa Residency',
      location: 'Noida Extension, Uttar Pradesh',
      date: 'Jan 10, 2026',
      area: '1200 sqm to 3000 sqm',
      price: '₹75 Lac Onwards',
      status: 'Selling',
      category: 'Villas',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'
      ],
      description: {
        intro: 'offers premium luxury villas in the heart of Noida Extension. These spacious villas are designed for modern families seeking comfort and elegance.',
        location: 'Located in a prime area with excellent connectivity to Delhi, Greater Noida, and Noida city center.',
        layout: 'Modern architecture with large open spaces, landscaped gardens, and state-of-the-art amenities.',
        ideal: [
          'Luxury living',
          'Premium investment',
          'Family homes'
        ],
        conclusion: 'Experience luxury living at its finest with Sky Villa Residency.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🏊', name: 'Swimming pool' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🌳', name: 'Garden' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🔒', name: 'Security' },
        { icon: '🔥', name: 'Central Heating' },
        { icon: '💆', name: 'Spa & Massage' },
        { icon: '🏡', name: 'Balcony' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 3,
      name: 'Green Park Apartments',
      location: 'Sector 62, Noida',
      date: 'Nov 20, 2025',
      area: '600 sqm to 1500 sqm',
      price: '₹35 Lac Onwards',
      status: 'Selling',
      category: 'Apartments',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'
      ],
      description: {
        intro: 'presents affordable and modern apartments in the heart of Noida. Ideal for first-time homebuyers and young families.',
        location: 'Conveniently located in Sector 62 with easy access to major IT hubs, shopping centers, and metro stations.',
        layout: 'Well-designed apartments with modern amenities, green spaces, and excellent ventilation.',
        ideal: [
          'First-time homebuyers',
          'Modern family living',
          'Investment opportunity'
        ],
        conclusion: 'Green Park Apartments offers an excellent blend of affordability and modern living.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🌳', name: 'Garden' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🔒', name: 'Security' },
        { icon: '🏡', name: 'Balcony' },
        { icon: '🔥', name: 'Central Heating' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 4,
      name: 'Royal Heights',
      location: 'Alpha II, Greater Noida',
      date: 'Oct 15, 2025',
      area: '1000 sqm to 2500 sqm',
      price: '₹60 Lac Onwards',
      status: 'Selling',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'
      ],
      description: {
        intro: 'offers premium residential properties in Alpha II, Greater Noida. Perfect for families looking for spacious homes.',
        location: 'Strategically located with excellent connectivity to Delhi-NCR and upcoming infrastructure projects.',
        layout: 'Spacious layouts with modern architecture, landscaped gardens, and premium amenities.',
        ideal: [
          'Growing families',
          'Premium lifestyle',
          'Long-term investment'
        ],
        conclusion: 'Royal Heights provides an ideal setting for premium family living.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🏊', name: 'Swimming pool' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🌳', name: 'Garden' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🔒', name: 'Security' },
        { icon: '🏡', name: 'Balcony' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 5,
      name: 'Tech Park Commercial Hub',
      location: 'Sector 18, Noida',
      date: 'Sep 10, 2025',
      area: '500 sqm to 5000 sqm',
      price: '₹1.2 Cr Onwards',
      status: 'Selling',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'
      ],
      description: {
        intro: 'is a state-of-the-art commercial complex in the heart of Noida. Perfect for businesses seeking prime office spaces.',
        location: 'Located in Sector 18, the commercial hub of Noida with excellent metro connectivity.',
        layout: 'Modern office spaces with cutting-edge facilities, high-speed elevators, and ample parking.',
        ideal: [
          'Corporate offices',
          'Retail businesses',
          'Commercial investment'
        ],
        conclusion: 'Tech Park Commercial Hub offers unmatched opportunities for business growth.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🔒', name: 'Security' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🔥', name: 'Central Heating' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 6,
      name: 'Lake View Villas',
      location: 'Tau Devi Lal Park Area, Greater Noida',
      date: 'Aug 25, 2025',
      area: '1500 sqm to 4000 sqm',
      price: '₹95 Lac Onwards',
      status: 'Selling',
      category: 'Luxury Villas',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80'
      ],
      description: {
        intro: 'offers ultra-luxury villas with breathtaking lake views. Perfect for those seeking an elite lifestyle.',
        location: 'Situated near Tau Devi Lal Park with serene lake views and lush green surroundings.',
        layout: 'Expansive villas with private gardens, premium interiors, and world-class amenities.',
        ideal: [
          'Ultra-luxury living',
          'High-net-worth individuals',
          'Premium investment'
        ],
        conclusion: 'Lake View Villas redefines luxury living with unparalleled elegance and comfort.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🏊', name: 'Swimming pool' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🌳', name: 'Garden' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🧺', name: 'Laundry Room' },
        { icon: '🐕', name: 'Pets Allow' },
        { icon: '🔒', name: 'Security' },
        { icon: '🔥', name: 'Central Heating' },
        { icon: '💆', name: 'Spa & Massage' },
        { icon: '🏡', name: 'Balcony' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 7,
      name: 'Urban Square Apartments',
      location: 'Sector 137, Noida',
      date: 'Jul 18, 2025',
      area: '700 sqm to 1800 sqm',
      price: '₹42 Lac Onwards',
      status: 'Selling',
      category: 'Apartments',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'
      ],
      description: {
        intro: 'brings contemporary urban living to Sector 137, Noida. Designed for modern professionals and families.',
        location: 'Prime location in Sector 137 with proximity to Noida-Greater Noida Expressway.',
        layout: 'Smart apartments with modern amenities, 24/7 security, and green spaces.',
        ideal: [
          'Young professionals',
          'Modern families',
          'Smart investment'
        ],
        conclusion: 'Urban Square Apartments offers the perfect blend of urban convenience and comfort.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🏊', name: 'Swimming pool' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🌳', name: 'Garden' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🔒', name: 'Security' },
        { icon: '🏡', name: 'Balcony' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 8,
      name: 'Prime Land Plots',
      location: 'Yamuna Expressway, Greater Noida',
      date: 'Jun 5, 2025',
      area: '1000 sqm to 10000 sqm',
      price: '₹25 Lac Onwards',
      status: 'Selling',
      category: 'Land',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80'
      ],
      description: {
        intro: 'offers prime land plots along the Yamuna Expressway. Ideal for investors and builders.',
        location: 'Strategic location on Yamuna Expressway with excellent appreciation potential.',
        layout: 'Clear title plots with proper documentation and easy access to major highways.',
        ideal: [
          'Real estate investment',
          'Future development',
          'Long-term returns'
        ],
        conclusion: 'Prime Land Plots presents a golden opportunity for smart investors.'
      },
      features: [
        { icon: '🌳', name: 'Garden' },
        { icon: '🔒', name: 'Security' },
        { icon: '🅿️', name: 'Parking' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 9,
      name: 'Sunrise Towers',
      location: 'Sector 76, Noida',
      date: 'May 12, 2025',
      area: '900 sqm to 2200 sqm',
      price: '₹52 Lac Onwards',
      status: 'Selling',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80'
      ],
      description: {
        intro: 'offers premium residential towers in Sector 76, Noida. Perfect for families seeking modern living.',
        location: 'Well-connected location in Sector 76 with easy access to schools, hospitals, and shopping centers.',
        layout: 'High-rise towers with spacious apartments, modern amenities, and panoramic city views.',
        ideal: [
          'Modern families',
          'Premium lifestyle',
          'Investment opportunity'
        ],
        conclusion: 'Sunrise Towers provides an elevated living experience with world-class amenities.'
      },
      features: [
        { icon: '📶', name: 'Wifi' },
        { icon: '🅿️', name: 'Parking' },
        { icon: '🏊', name: 'Swimming pool' },
        { icon: '🏋️', name: 'Fitness center' },
        { icon: '🌳', name: 'Garden' },
        { icon: '❄️', name: 'Air Conditioning' },
        { icon: '🔒', name: 'Security' },
        { icon: '🔥', name: 'Central Heating' },
        { icon: '🏡', name: 'Balcony' }
      ],
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  // Find the current project
  const project = projects.find(p => p.id === parseInt(id)) || projects[0];

  useEffect(() => {
    // Load HubSpot form script
    const script = document.createElement('script');
    script.src = 'https://js-na2.hsforms.net/forms/embed/244826787.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tourDate: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data with property name
    const submissionData = {
      fields: [
        { name: 'firstname', value: formData.name },
        { name: 'phone', value: formData.phone },
        { name: 'email', value: formData.email },
        { name: 'property_inquiry', value: project.name },
        { name: 'message', value: `Property: ${project.name}\nLocation: ${project.location}\nPrice: ${project.price}\nTour Date: ${formData.tourDate || 'Not specified'}\n\nMessage:\n${formData.message}` }
      ],
      context: {
        pageUri: window.location.href,
        pageName: `Property Detail - ${project.name}`
      }
    };
    
    try {
      // Submit to HubSpot via API
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/244826787/1dc60e00-39fd-403e-b865-4cc88a315b03`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        }
      );
      
      if (response.ok) {
        alert(`Thank you for your interest in ${project.name}! We will contact you soon.`);
        setFormData({
          name: '',
          phone: '',
          email: '',
          tourDate: '',
          message: ''
        });
      } else {
        console.error('Form submission failed:', await response.text());
        alert('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your request. Please try again.');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', { rating, review });
    alert('Please log in to write review!');
  };

  return (
    <div className="property-detail-page">
      {/* Hero Image Gallery */}
      <div className="hero-gallery">
        <div className="main-image">
          <img src={project.image} alt={project.name} />
        </div>
        <div className="thumbnail-gallery">
          {project.gallery.map((img, index) => (
            <div key={index} className="thumbnail">
              <img src={img} alt={`${project.name} ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="gallery-actions">
          <button className="gallery-btn">
            <span className="icon">▶️</span> YouTube
          </button>
          <button className="gallery-btn">
            <span className="icon">🖼️</span> Gallery
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="property-content">
        <div className="content-left">
          {/* Property Header */}
          <div className="property-header">
            <h1>{project.name}</h1>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="star">☆</span>
              ))}
            </div>
            <div className="property-meta">
              <span className="location">📍 {project.location}</span>
              <span className="date">📅 {project.date}</span>
            </div>
          </div>

          {/* Overview Section */}
          <div className="overview-section">
            <h2>Overview</h2>
            <div className="overview-details">
              <div className="detail-item">
                <span className="label">Last Updated:</span>
                <span className="value">{project.date}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="status-badge">{project.status}</span>
              </div>
              <div className="detail-item">
                <span className="label">Category:</span>
                <span className="value">{project.category}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <h2>Description</h2>
            <p className="description-text">
              <strong>{project.name}</strong> {project.description.intro}
            </p>
            <p className="description-text">
              {project.description.location}
            </p>
            <p className="description-text">
              {project.description.layout}
            </p>
            <p className="description-text">
              <strong>{project.name} plots are ideal for:</strong>
            </p>
            <ul className="ideal-list">
              {project.description.ideal.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="description-text">
              {project.description.conclusion}
            </p>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2>Features</h2>
            <div className="features-grid">
              {project.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-name">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <iframe
              src={project.mapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Property Location"
            ></iframe>
          </div>

          {/* Video Section */}
          <div className="video-section">
            <h2>Project video</h2>
            <div className="video-container">
              <img src={project.image} alt="Video thumbnail" className="video-thumbnail" />
              <button className="play-button">▶</button>
            </div>
            <div className="share-section">
              <p>Share this project:</p>
              <div className="social-buttons">
                <button className="social-btn facebook">f</button>
                <button className="social-btn twitter">𝕏</button>
                <button className="social-btn pinterest">P</button>
                <button className="social-btn linkedin">in</button>
                <button className="social-btn whatsapp">W</button>
                <button className="social-btn email">@</button>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="review-section">
            <h2>Write a review</h2>
            <div className="review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`review-star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <form onSubmit={handleReviewSubmit}>
              <textarea
                placeholder="Enter your message"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="5"
              ></textarea>
              <p className="login-message">Please log in to write review!</p>
              <button type="submit" className="submit-review-btn">Submit review</button>
            </form>
          </div>
        </div>

        {/* Contact Form (Right Side) */}
        <div className="content-right">
          <div className="contact-form-card">
            <h3>Contact</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Johny Dane"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Ex 0123456789"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Schedule a Tour (optional)</label>
                <input
                  type="date"
                  name="tourDate"
                  value={formData.tourDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>{project.name}</label>
                <input
                  type="text"
                  value={project.name}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>
                  Message <span className="required">*</span>
                </label>
                <textarea
                  name="message"
                  placeholder="Enter your message..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className="send-message-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
