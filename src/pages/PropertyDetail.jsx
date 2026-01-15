import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PropertyDetail.css';
import ShinyText from '../components/ShinyText';
import '../components/ButtonGlare.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch property data from database
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        
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
    status: property.status === 'available' ? 'Available' : 'Sold',
    category: property.propertyType || 'Property',
    image: property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    gallery: property.images || ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'],
    description: {
      intro: property.description || 'No description available.',
      location: `Located in ${property.location?.city || 'a prime location'}, this property offers excellent connectivity and amenities.`,
      layout: `This ${property.propertyType} features ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, spanning ${property.area?.value} ${property.area?.unit}.`,
      ideal: ['Modern living', 'Prime location', 'Great investment'],
      conclusion: 'A perfect choice for your next home or investment.'
    },
    features: property.amenities?.map(amenity => ({ icon: '✓', name: amenity })) || [],
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.123456789!2d77.7123456!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwNDInNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
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
    
    // Check if we're in dev mode
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDev) {
      // In dev mode, simulate success
      console.log('Dev mode - Form data:', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        property: displayProperty.name,
        tourDate: formData.tourDate,
        message: formData.message
      });
      
      setTimeout(() => {
        alert(`[DEV MODE] Form submitted successfully!\n\nThis will work on Vercel. Your data:\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nProperty: ${displayProperty.name}`);
        setFormData({
          name: '',
          phone: '',
          email: '',
          tourDate: '',
          message: ''
        });
        setIsSubmitting(false);
      }, 1000);
      return;
    }
    
    // Prepare submission data for production
    const submissionData = {
      fields: [
        { name: 'firstname', value: formData.name },
        { name: 'phone', value: formData.phone },
        { name: 'email', value: formData.email },
        { name: 'property_inquiry', value: displayProperty.name },
        { name: 'message', value: `Property: ${displayProperty.name}\nLocation: ${displayProperty.location}\nPrice: ${displayProperty.price}\nTour Date: ${formData.tourDate || 'Not specified'}\n\nMessage:\n${formData.message}` }
      ],
      context: {
        pageUri: window.location.href,
        pageName: `Property Detail - ${displayProperty.name}`
      }
    };
    
    try {
      // Submit via serverless API (production only)
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
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
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your request. Please try again or contact us at 9720444418.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', { rating, review });
    alert('Please log in to write review!');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }

    const result = toggleWishlist(parseInt(id));
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
          <button className="gallery-btn btn-glare">
            <span className="icon">▶️</span> YouTube
          </button>
          <button className="gallery-btn btn-glare">
            <span className="icon">🖼️</span> Gallery
          </button>
          <button 
            className={`gallery-btn btn-glare wishlist-toggle ${isInWishlist(parseInt(id)) ? 'active' : ''}`}
            onClick={handleWishlistToggle}
          >
            <span className="icon">{isInWishlist(parseInt(id)) ? '❤️' : '🤍'}</span>
            {isInWishlist(parseInt(id)) ? 'In Wishlist' : 'Add to Wishlist'}
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
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="star">☆</span>
              ))}
            </div>
            <div className="property-meta">
              <span className="location">📍 {displayProperty.location}</span>
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
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <h2>Description</h2>
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
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2>Features</h2>
            <div className="features-grid">
              {displayProperty.features.map((feature, index) => (
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
              src={displayProperty.mapUrl}
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
              <img src={displayProperty.image} alt="Video thumbnail" className="video-thumbnail" />
              <button className="play-button btn-glare-radial">▶</button>
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
              <button type="submit" className="submit-review-btn btn-glare">Submit review</button>
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
    </div>
  );
};

export default PropertyDetail;
