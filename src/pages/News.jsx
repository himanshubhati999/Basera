import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './News.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const response = await fetch(`${API_URL}/pages/published`);
      const data = await response.json();
      
      if (data.success) {
        // Filter for blog posts (you can adjust this filter as needed)
        const blogPosts = data.pages.filter(page => 
          page.template === 'Blog Page' || page.content
        );
        setPosts(blogPosts);
      } else {
        setError('Failed to load posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
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
