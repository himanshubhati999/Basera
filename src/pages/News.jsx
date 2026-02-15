import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './News.css';
import { API_ENDPOINTS } from '../config/api';

console.log('🔍 News.jsx - API_ENDPOINTS.PAGES_PUBLISHED:', API_ENDPOINTS.PAGES_PUBLISHED);

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = API_ENDPOINTS.PAGES_PUBLISHED;
      console.log('🌐 Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response Content-Type:', response.headers.get('content-type'));
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Expected JSON.');
      }
      
      const data = await response.json();
      console.log('✅ Data received:', data);
      
      if (data.success) {
        // List of static page names to exclude from blog/news
        const excludedPageNames = [
          'Privacy Policy',
          'Terms and Conditions', 
          'Terms & Conditions',
          'About Us',
          'About',
          'Contact',
          'Contact Us',
          'FAQ',
          'Frequently Asked Questions'
        ];
        
        // Filter for blog posts only, excluding static pages
        const blogPosts = data.pages.filter(page => {
          // Exclude pages by name
          const isExcludedPage = excludedPageNames.some(excluded => 
            page.name && page.name.toLowerCase().includes(excluded.toLowerCase())
          );
          
          if (isExcludedPage) return false;
          
          // Only include pages with Blog Page template
          return page.template === 'Blog Page';
        });
        setPosts(blogPosts);
        console.log('✅ Posts loaded:', blogPosts.length);
      } else {
        setError(data.message || 'Failed to load posts');
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      setError(`Failed to load posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return 'No description available';
    const text = content.replace(/<[^>]+>/g, ''); // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="news-page">
        <div className="news-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <div className="news-container">
          <div className="error-state">
            <span className="material-symbols-outlined">error</span>
            <p>{error}</p>
            <button onClick={fetchPosts} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-hero">
        <div className="news-hero-content">
          <h1>Latest News & Insights</h1>
          <p>Stay updated with the latest real estate trends, market insights, and property news</p>
        </div>
      </div>

      <div className="news-container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <span className="material-symbols-outlined">article</span>
            <h2>No posts yet</h2>
            <p>Check back soon for the latest news and updates</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post._id} className="post-card">
                {post.featuredImage && (
                  <div className="post-image">
                    <img src={post.featuredImage} alt={post.name} />
                  </div>
                )}
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-date">
                      <span className="material-symbols-outlined">calendar_today</span>
                      {formatDate(post.createdAt)}
                    </span>
                    {post.author && (
                      <span className="post-author">
                        <span className="material-symbols-outlined">person</span>
                        {post.author.name || post.author.email}
                      </span>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="post-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h2 className="post-title">{post.name}</h2>
                  <p className="post-excerpt">
                    {post.description || getExcerpt(post.content)}
                  </p>
                  <Link to={`/news/${post.slug}`} className="read-more">
                    Read More
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
