import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './DynamicPage.css';

const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.PAGE_BY_SLUG(slug));
      
      if (response.ok) {
        const data = await response.json();
        
        // Only show published pages to public
        if (data.page.status === 'Published') {
          setPage(data.page);
          // Debug: Log content to check for images
          console.log('Page content:', data.page.content);
          console.log('Has images:', data.page.content?.includes('<img'));
        } else {
          setError('This page is not available.');
        }
      } else if (response.status === 404) {
        setError('Page not found');
      } else {
        setError('Failed to load page');
      }
    } catch (err) {
      console.error('Error fetching page:', err);
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  if (loading) {
    return (
      <div className="dynamic-page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p style={{ fontSize: '18px', fontWeight: '500' }}>Loading page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dynamic-page-container">
        <div className="error-container">
          <span className="material-symbols-outlined error-icon">error</span>
          <h2>{error}</h2>
          <p>The page you're looking for doesn't exist or is not currently available.</p>
          <button 
            className="back-home-btn"
            onClick={() => navigate('/')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>home</span>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="dynamic-page-container">
      {/* Hero Section with Title */}
      <div className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">{page.name}</h1>
          {page.description && (
            <p className="page-subtitle">{page.description}</p>
          )}
          
          {/* Tags under title in hero */}
          {page.tags && page.tags.length > 0 && (
            <div className="page-tags">
              {page.tags.map((tag, index) => (
                <span key={index} className="page-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="page-content-wrapper">
        <div className="page-content">
          {page.featuredImage && (
            <div className="featured-image">
              <img src={page.featuredImage} alt={page.name} />
            </div>
          )}
          
          <div className="page-body">
            {page.content ? (
              <div 
                className="page-text"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="no-content">
                <p>This page is under construction.</p>
                <p style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
                  Content will be added soon.
                </p>
              </div>
            )}
          </div>

          {/* Page Meta Info */}
          <div className="page-meta">
            <div className="meta-item">
              <span className="material-symbols-outlined">calendar_today</span>
              <span>Published on {new Date(page.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            {page.updatedAt !== page.createdAt && (
              <div className="meta-item">
                <span className="material-symbols-outlined">update</span>
                <span>Last updated {new Date(page.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
