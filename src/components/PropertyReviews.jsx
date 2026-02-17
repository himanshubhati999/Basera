import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './PropertyReviews.css';

const PropertyReviews = ({ propertyId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.PROPERTY_REVIEWS(propertyId));
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews || []);
        setStats(data.stats || {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem('token');
      const url = editingReview
        ? API_ENDPOINTS.UPDATE_REVIEW(editingReview._id)
        : API_ENDPOINTS.CREATE_REVIEW(propertyId);

      const response = await fetch(url, {
        method: editingReview ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (data.success) {
        await fetchReviews();
        setShowReviewForm(false);
        setEditingReview(null);
        setRating(5);
        setComment('');
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.DELETE_REVIEW(reviewId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchReviews();
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const renderStars = (count, interactive = false, size = 'medium') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= (interactive && hoveredRating ? hoveredRating : count);
      stars.push(
        <span
          key={i}
          className={`star ${filled ? 'filled' : ''} ${size} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => setRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getRatingPercentage = (ratingValue) => {
    if (stats.totalReviews === 0) return 0;
    return Math.round((stats.ratingDistribution[ratingValue] / stats.totalReviews) * 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const userHasReviewed = reviews.some(review => review.user?._id === user?._id);

  return (
    <div className="property-reviews">
      <h2 className="reviews-title">Customer Reviews & Ratings</h2>

      {/* Overall Rating Summary */}
      <div className="rating-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <span className="rating-number">{stats.averageRating}</span>
            <div className="rating-stars">
              {renderStars(Math.round(parseFloat(stats.averageRating)), false, 'large')}
            </div>
            <span className="total-reviews">{stats.totalReviews} {stats.totalReviews === 1 ? 'Review' : 'Reviews'}</span>
          </div>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="rating-bar-row">
              <span className="star-label">{star} ★</span>
              <div className="rating-bar">
                <div
                  className="rating-bar-fill"
                  style={{ width: `${getRatingPercentage(star)}%` }}
                />
              </div>
              <span className="rating-percentage">{getRatingPercentage(star)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Button */}
      {isAuthenticated && !userHasReviewed && !showReviewForm && (
        <button className="btn-write-review" onClick={() => setShowReviewForm(true)}>
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <h3>{editingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>Your Rating</label>
              <div className="star-rating">
                {renderStars(rating, true, 'large')}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this property..."
                rows="5"
                required
                maxLength="1000"
              />
              <span className="char-count">{comment.length}/1000</span>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setRating(5);
                  setComment('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <p className="loading-text">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this property!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">{review.user?.name || 'Anonymous'}</h4>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating, false, 'small')}
                </div>
              </div>

              <div className="review-content">
                <p>{review.comment}</p>
              </div>

              {user?._id === review.user?._id && (
                <div className="review-actions">
                  <button className="btn-edit" onClick={() => handleEditReview(review)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteReview(review._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyReviews;
