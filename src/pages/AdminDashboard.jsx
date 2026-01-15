import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Fetch properties
      const propsResponse = await fetch('http://localhost:5000/api/admin/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (propsResponse.ok) {
        const propsData = await propsResponse.json();
        setProperties(propsData.properties);
      }

      // Fetch users
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load admin data. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProperties(properties.filter(p => p._id !== propertyId));
        alert('Property deleted successfully');
      } else {
        alert('Failed to delete property');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Error deleting property');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user');
    }
  };

  const handleUpdatePropertyStatus = async (propertyId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(properties.map(p => 
          p._id === propertyId ? data.property : p
        ));
        alert('Property status updated successfully');
      } else {
        alert('Failed to update property status');
      }
    } catch (err) {
      console.error('Error updating property status:', err);
      alert('Error updating property status');
    }
  };

  const handleToggleFeatured = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}/featured`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(properties.map(p => 
          p._id === propertyId ? data.property : p
        ));
        alert(data.message);
      } else {
        alert('Failed to toggle featured status');
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
      alert('Error toggling featured status');
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.postedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchDashboardData} className="action-btn view">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage properties, users, and view statistics</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card properties">
              <div className="stat-card-header">
                <span className="stat-label">Total Properties</span>
                <span className="stat-icon">🏠</span>
              </div>
              <div className="stat-value">{stats.totalProperties}</div>
            </div>

            <div className="stat-card users">
              <div className="stat-card-header">
                <span className="stat-label">Total Users</span>
                <span className="stat-icon">👥</span>
              </div>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>

            <div className="stat-card available">
              <div className="stat-card-header">
                <span className="stat-label">Available</span>
                <span className="stat-icon">✅</span>
              </div>
              <div className="stat-value">{stats.availableProperties}</div>
            </div>

            <div className="stat-card sold">
              <div className="stat-card-header">
                <span className="stat-label">Sold</span>
                <span className="stat-icon">💰</span>
              </div>
              <div className="stat-value">{stats.soldProperties}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            🏠 Properties ({properties.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users ({users.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#2c3e50' }}>
              Recent Properties
            </h3>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Posted By</th>
                    <th>Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProperties.map(property => (
                    <tr key={property._id}>
                      <td>
                        <div className="property-title">{property.title}</div>
                        <div className="property-location">
                          {property.location?.city}, {property.location?.state}
                        </div>
                      </td>
                      <td>{property.postedBy?.name}</td>
                      <td className="price">{formatPrice(property.price)}</td>
                      <td>{formatDate(property.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#2c3e50' }}>
              Recent Users
            </h3>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>All Properties</h2>
              <input
                type="text"
                className="search-box"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredProperties.length === 0 ? (
              <div className="no-data">No properties found</div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Owner Contact</th>
                      <th>Posted By</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map(property => (
                      <tr key={property._id}>
                        <td>
                          <div className="property-title">{property.title}</div>
                          <div className="property-location">
                            {property.location?.address && `${property.location.address}, `}
                            {property.location?.city}, {property.location?.state}
                          </div>
                        </td>
                        <td>
                          <span className={`type-badge ${property.propertyType}`}>
                            {property.propertyType}
                          </span>
                        </td>
                        <td className="price">{formatPrice(property.price)}</td>
                        <td>
                          <div className="contact-info">
                            <div className="contact-item">
                              <span>📞</span> {property.ownerPhone}
                            </div>
                            <div className="contact-item">
                              <span>📧</span> {property.ownerEmail}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{property.postedBy?.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                            {property.postedBy?.email}
                          </div>
                        </td>
                        <td>
                          <select
                            className={`status-badge ${property.status}`}
                            value={property.status}
                            onChange={(e) => handleUpdatePropertyStatus(property._id, e.target.value)}
                          >
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                            <option value="under-contract">Under Contract</option>
                          </select>
                        </td>
                        <td>{formatDate(property.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className={`action-btn ${property.isFeatured ? 'featured' : 'feature'}`}
                              onClick={() => handleToggleFeatured(property._id)}
                              title={property.isFeatured ? 'Remove from featured' : 'Add to featured'}
                            >
                              {property.isFeatured ? '⭐ Featured' : '☆ Feature'}
                            </button>
                            <button
                              className="action-btn view"
                              onClick={() => navigate(`/properties/${property._id}`)}
                            >
                              View
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteProperty(property._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>All Users</h2>
              <input
                type="text"
                className="search-box"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredUsers.length === 0 ? (
              <div className="no-data">No users found</div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Wishlist</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.wishlist?.length || 0} items</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
