import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './PropertyDetail.css';
import ShinyText from '../components/ShinyText';
import PropertyReviews from '../components/PropertyReviews';
import '../components/ButtonGlare.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Function to extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  // Function to get YouTube embed URL
  const getYoutubeEmbedUrl = (url) => {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  };

  // Function to generate Google Maps embed URL from latitude and longitude
  const getMapEmbedUrl = (latitude, longitude) => {
    if (!latitude || !longitude) return null;
    // URL format that shows a pin marker at the exact location
    return `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  // Handle opening video modal
  const handleOpenVideo = () => {
    if (property?.youtubeVideo || displayProperty?.videoUrl) {
      setShowVideoModal(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
  };

  // Handle closing video modal
  const handleCloseVideo = () => {
    setShowVideoModal(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Fetch property data from database
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.PROPERTY_BY_ID(id));
        
        if (!response.ok) {
          throw new Error('Property not found');
        }
        
        const data = await response.json();
        setProperty(data.property);
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Sample project data - used as fallback
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

  // Transform database property to match expected format
  const displayProperty = property ? {
    id: property._id,
    name: property.title,
    location: property.location?.city || property.location?.address || 'Location not specified',
    date: new Date(property.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    area: property.area ? `${property.area.value} ${property.area.unit}` : 'Area not specified',
    price: `₹${(property.price / 100000).toFixed(0)} Lac`,
    status: property.status === 'available' ? 'Available' : property.status.charAt(0).toUpperCase() + property.status.slice(1),
    listingType: property.listingType,
    category: property.propertyType || 'Property',
    categories: property.categories || [],
    image: property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    gallery: property.images || ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'],
    content: property.content || null,
    description: {
      intro: property.description || 'No description available.',
      location: `Located in ${property.location?.city || 'a prime location'}, this property offers excellent connectivity and amenities.`,
      layout: `This ${property.propertyType} features ${property.bedrooms || 'N/A'} bedrooms and ${property.bathrooms || 'N/A'} bathrooms, spanning ${property.area?.value || 'N/A'} ${property.area?.unit || ''}.`,
      ideal: ['Modern living', 'Prime location', 'Great investment'],
      conclusion: 'A perfect choice for your next home or investment.'
    },
    projectDetails: property.projectDetails || null,
    features: property.amenities?.map(amenity => ({ icon: <span className="material-symbols-outlined">check</span>, name: amenity })) || [],
    mapUrl: getMapEmbedUrl(property.location?.coordinates?.latitude, property.location?.coordinates?.longitude),
    videoUrl: property.youtubeVideo || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    latitude: property.location?.coordinates?.latitude,
    longitude: property.location?.coordinates?.longitude,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    uniqueId: property.uniqueId,
    investor: property.investor
  } : (projects.find(p => p.id === parseInt(id)) || projects[0]);

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
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Prepare submission data for consults
    const consultData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      property: displayProperty.name,
      message: formData.tourDate 
        ? `Tour Date: ${formData.tourDate}\n\n${formData.message}` 
        : formData.message
    };
    
    try {
      const response = await fetch(API_ENDPOINTS.CONSULTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Thank you for your interest in ${displayProperty.name}! We will contact you soon.`);
        setFormData({
          name: '',
          phone: '',
          email: '',
          tourDate: '',
          message: ''
        });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your request. Please try again or contact us at +91 98118 02157.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }

    const result = await toggleWishlist(id);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="property-detail-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Loading property details...</h2>
        </div>
      </div>
    );
  }

  if (error || !displayProperty) {
    return (
      <div className="property-detail-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Property not found</h2>
          <p>{error || 'The property you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/properties')} className="btn-glare" style={{ marginTop: '20px' }}>
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      {/* Hero Image Gallery */}
      <div className="hero-gallery">
        <div className="main-image">
          <img src={displayProperty.image} alt={displayProperty.name} />
        </div>
        <div className="thumbnail-gallery">
          {displayProperty.gallery.map((img, index) => (
            <div key={index} className="thumbnail">
              <img src={img} alt={`${displayProperty.name} ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="gallery-actions">
          <button className="gallery-btn btn-glare" onClick={handleOpenVideo}>
            <span className="icon">▶️</span> YouTube
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="property-content">
        <div className="content-left">
          {/* Property Header */}
          <div className="property-header">
            <h1>
              <ShinyText
                text={displayProperty.name}
                speed={3}
                delay={0}
                color="#333"
                shineColor="#ff0000"
                spread={120}
                direction="left"
              />
            </h1>
            <div className="property-meta">
              <span className="location"><span className="material-symbols-outlined" style={{fontSize: '20px', verticalAlign: 'middle'}}>location_on</span> {displayProperty.location}</span>
              <span className="date">📅 {displayProperty.date}</span>
            </div>
          </div>

          {/* Overview Section */}
          <div className="overview-section">
            <h2>Overview</h2>
            <div className="overview-details">
              <div className="detail-item">
                <span className="label">Last Updated:</span>
                <span className="value">{displayProperty.date}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="status-badge">{displayProperty.status}</span>
              </div>
              <div className="detail-item">
                <span className="label">Category:</span>
                <span className="value">{displayProperty.category}</span>
              </div>
              {displayProperty.listingType && (
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <span className="value">{displayProperty.listingType === 'sale' ? 'For Sale' : 'For Construction'}</span>
                </div>
              )}
              {displayProperty.bedrooms && (
                <div className="detail-item">
                  <span className="label">Bedrooms:</span>
                  <span className="value">{displayProperty.bedrooms}</span>
                </div>
              )}
              {displayProperty.bathrooms && (
                <div className="detail-item">
                  <span className="label">Bathrooms:</span>
                  <span className="value">{displayProperty.bathrooms}</span>
                </div>
              )}
              {displayProperty.area && (
                <div className="detail-item">
                  <span className="label">Area:</span>
                  <span className="value">{displayProperty.area}</span>
                </div>
              )}
              {displayProperty.uniqueId && (
                <div className="detail-item">
                  <span className="label">Property ID:</span>
                  <span className="value">{displayProperty.uniqueId}</span>
                </div>
              )}
            </div>
            
            {/* Categories Tags */}
            {displayProperty.categories && displayProperty.categories.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <span className="label" style={{ display: 'block', marginBottom: '8px' }}>Categories:</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {displayProperty.categories.map((cat, index) => (
                    <span key={index} style={{
                      padding: '4px 12px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Details Section (if available) */}
          {displayProperty.projectDetails && (
            <div className="overview-section">
              <h2>Project Details</h2>
              <div className="overview-details">
                {displayProperty.projectDetails.numberBlocks && (
                  <div className="detail-item">
                    <span className="label">Number of Blocks:</span>
                    <span className="value">{displayProperty.projectDetails.numberBlocks}</span>
                  </div>
                )}
                {displayProperty.projectDetails.numberFloors && (
                  <div className="detail-item">
                    <span className="label">Number of Floors:</span>
                    <span className="value">{displayProperty.projectDetails.numberFloors}</span>
                  </div>
                )}
                {displayProperty.projectDetails.numberFlats && (
                  <div className="detail-item">
                    <span className="label">Number of Flats:</span>
                    <span className="value">{displayProperty.projectDetails.numberFlats}</span>
                  </div>
                )}
                {displayProperty.projectDetails.lowestPrice && (
                  <div className="detail-item">
                    <span className="label">Starting Price:</span>
                    <span className="value">₹{(displayProperty.projectDetails.lowestPrice / 100000).toFixed(2)} Lac</span>
                  </div>
                )}
                {displayProperty.projectDetails.maxPrice && (
                  <div className="detail-item">
                    <span className="label">Maximum Price:</span>
                    <span className="value">₹{(displayProperty.projectDetails.maxPrice / 100000).toFixed(2)} Lac</span>
                  </div>
                )}
                {displayProperty.projectDetails.openSellDate && (
                  <div className="detail-item">
                    <span className="label">Open Sell Date:</span>
                    <span className="value">{new Date(displayProperty.projectDetails.openSellDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {displayProperty.projectDetails.finishDate && (
                  <div className="detail-item">
                    <span className="label">Expected Completion:</span>
                    <span className="value">{new Date(displayProperty.projectDetails.finishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="description-section">
            <h2>Description</h2>
            
            {/* If property has rich content from ContentEditor, display it */}
            {displayProperty.content ? (
              <div 
                className="property-content-html"
                dangerouslySetInnerHTML={{ __html: displayProperty.content }}
                style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#555',
                  marginBottom: '20px'
                }}
              />
            ) : (
              /* Otherwise, display the structured description */
              <>
                <p className="description-text">
                  <strong>{displayProperty.name}</strong> {displayProperty.description.intro}
                </p>
                <p className="description-text">
                  {displayProperty.description.location}
                </p>
                <p className="description-text">
                  {displayProperty.description.layout}
                </p>
                <p className="description-text">
                  <strong>{displayProperty.name} plots are ideal for:</strong>
                </p>
                <ul className="ideal-list">
                  {displayProperty.description.ideal.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="description-text">
                  {displayProperty.description.conclusion}
                </p>
              </>
            )}
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2>Features</h2>
            <div className="features-grid">
              {displayProperty.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon"><span className="material-symbols-outlined">check</span></span>
                  <span className="feature-name">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div className="video-section">
            <h2>Project video</h2>
            <div className="video-container">
              <img src={displayProperty.image} alt="Video thumbnail" className="video-thumbnail" />
              <button className="play-button btn-glare-radial" onClick={handleOpenVideo}>▶</button>
            </div>
            <div className="share-section">
              <p>Share this project:</p>
              <div className="social-buttons">
                <button className="social-btn facebook btn-glare-radial">f</button>
                <button className="social-btn twitter btn-glare-radial">𝕏</button>
                <button className="social-btn pinterest btn-glare-radial">P</button>
                <button className="social-btn linkedin btn-glare-radial">in</button>
                <button className="social-btn whatsapp btn-glare-radial">W</button>
                <button className="social-btn email btn-glare-radial">@</button>
              </div>
            </div>
          </div>

          {/* Map Location Section */}
          {displayProperty.mapUrl && displayProperty.latitude && displayProperty.longitude && (
            <div className="map-section">
              <h2>Map Location</h2>
              <div className="map-container">
                <iframe
                  src={displayProperty.mapUrl}
                  title="Property Location"
                  width="100%"
                  height="450"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="coordinates-info">
                <p>📍 Coordinates: {displayProperty.latitude}, {displayProperty.longitude}</p>
              </div>
            </div>
          )}
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
                <label>{displayProperty.name}</label>
                <input
                  type="text"
                  value={displayProperty.name}
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

              <button 
                type="submit" 
                className="send-message-btn btn-glare"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <PropertyReviews propertyId={id} />

      {/* Video Modal */}
      {showVideoModal && (
        <div className="video-modal-overlay" onClick={handleCloseVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={handleCloseVideo}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="video-modal-wrapper">
              {getYoutubeEmbedUrl(displayProperty.videoUrl) ? (
                <iframe
                  src={getYoutubeEmbedUrl(displayProperty.videoUrl)}
                  title="Property Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-modal-iframe"
                ></iframe>
              ) : (
                <div className="video-error">
                  <p>Video not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
