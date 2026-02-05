import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);

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
    generateActivityLogs();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch stats
      const statsResponse = await fetch(API_ENDPOINTS.ADMIN_STATS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Fetch properties
      const propsResponse = await fetch(API_ENDPOINTS.ADMIN_PROPERTIES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (propsResponse.ok) {
        const propsData = await propsResponse.json();
        setProperties(propsData.properties);
      }

      // Fetch users
      const usersResponse = await fetch(API_ENDPOINTS.ADMIN_USERS, {
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

  const generateActivityLogs = () => {
    const logs = [
      {
        type: 'login',
        user: user?.name || 'Shresth Sharma',
        message: 'logged in to the system',
        time: '1 minute ago',
        ip: '106.219.147.69'
      },
      {
        type: 'login',
        user: user?.name || 'Shresth Sharma',
        message: 'logged in to the system',
        time: '1 hour ago',
        ip: '106.211.58.178'
      },
      {
        type: 'login',
        user: user?.name || 'Shresth Sharma',
        message: 'logged in to the system',
        time: '3 hours ago',
        ip: '122.161.53.204'
      },
      {
        type: 'contact',
        user: 'System',
        message: 'created contact "Cheung Eric"',
        time: '1 day ago',
        ip: '146.70.45.85'
      },
      {
        type: 'login',
        user: user?.name || 'Shresth Sharma',
        message: 'logged in to the system',
        time: '2 days ago',
        ip: '103.225.205.126'
      },
      {
        type: 'post',
        user: user?.name || 'Shresth Sharma',
        message: 'updated post "YEIDA- India\'s Next development hub"',
        time: '4 days ago',
        ip: '122.161.49.230'
      }
    ];
    setActivityLogs(logs);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_PROPERTY_BY_ID(propertyId), {
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
      const response = await fetch(API_ENDPOINTS.ADMIN_USER_BY_ID(userId), {
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
      const response = await fetch(API_ENDPOINTS.ADMIN_PROPERTY_STATUS(propertyId), {
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
      const response = await fetch(API_ENDPOINTS.ADMIN_PROPERTY_FEATURED(propertyId), {
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
      <div className="admin-dashboard-modern">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-modern">
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
    <div className="admin-dashboard-modern">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>
          <h2 className="sidebar-brand">Sunshine Real Estate</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'real-estate' ? 'active' : ''}`}
            onClick={() => setActiveTab('real-estate')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Real Estate</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'pages' ? 'active' : ''}`}
            onClick={() => setActiveTab('pages')}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-text">Pages</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('blog')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Blog</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">💳</span>
            <span className="nav-text">Payments</span>
            <span className="badge">2</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">💼</span>
            <span className="nav-text">Careers</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">💬</span>
            <span className="nav-text">Consults</span>
            <span className="badge">2</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">📢</span>
            <span className="nav-text">Ads</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">📣</span>
            <span className="nav-text">Announcements</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">🎫</span>
            <span className="nav-text">Coupons</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Accounts</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">📦</span>
            <span className="nav-text">Packages</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">📧</span>
            <span className="nav-text">Contact</span>
            <span className="badge">2</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">📰</span>
            <span className="nav-text">Newsletters</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">📍</span>
            <span className="nav-text">Locations</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">🖼️</span>
            <span className="nav-text">Media</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">🎨</span>
            <span className="nav-text">Appearance</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">🔌</span>
            <span className="nav-text">Plugins</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">🔧</span>
            <span className="nav-text">Tools</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Header */}
        <header className="admin-header-modern">
          <div className="header-search">
            <input 
              type="text" 
              placeholder="Search"
              className="search-input-modern"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-shortcut">ctrl/cmd + k</span>
          </div>

          <div className="header-actions">
            <button className="header-btn" onClick={() => navigate('/')}>
              🌐 View website
            </button>
            <button className="header-icon-btn">
              <span className="theme-toggle">🌙</span>
            </button>
            <button className="header-icon-btn notification-btn">
              🔔
              <span className="notification-badge">0</span>
            </button>
            <button className="header-icon-btn notification-btn">
              💬
              <span className="notification-badge red">2</span>
            </button>
            <button className="header-icon-btn notification-btn">
              🎁
              <span className="notification-badge red">2</span>
            </button>
            <button className="user-profile-btn">
              <span className="user-avatar">S</span>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Shresth Sharma'}</span>
                <span className="user-email">{user?.email || 'info@sunshinerealstatepvtltd.com'}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="dashboard-header-row">
              <h1 className="dashboard-title">DASHBOARD</h1>
              <button className="manage-widgets-btn">
                🗂️ Manage Widgets
              </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards-modern">
              <div className="stat-card-modern purple">
                <div className="stat-card-content">
                  <h3>Active properties</h3>
                  <div className="stat-number-modern">
                    {stats?.availableProperties || 0}
                  </div>
                </div>
                <div className="stat-icon-bg">💼</div>
              </div>

              <div className="stat-card-modern cyan">
                <div className="stat-card-content">
                  <h3>Pending properties</h3>
                  <div className="stat-number-modern">0</div>
                </div>
                <div className="stat-icon-bg">📋</div>
              </div>

              <div className="stat-card-modern red">
                <div className="stat-card-content">
                  <h3>Expired properties</h3>
                  <div className="stat-number-modern">0</div>
                </div>
                <div className="stat-icon-bg">⏰</div>
              </div>

              <div className="stat-card-modern blue">
                <div className="stat-card-content">
                  <h3>Agents</h3>
                  <div className="stat-number-modern">
                    {stats?.totalUsers || 3}
                  </div>
                </div>
                <div className="stat-icon-bg">👥</div>
              </div>
            </div>

            {/* Recent Posts & Activity Logs */}
            <div className="dashboard-grid">
              <div className="recent-posts-section">
                <h2>Recent Posts</h2>
                <div className="posts-table-wrapper">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>NAME</th>
                        <th>CREATED AT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentProperties?.slice(0, 4).map((property, index) => (
                        <tr key={property._id}>
                          <td>{index + 1}</td>
                          <td>
                            <a href={`/properties/${property._id}`} className="post-link">
                              {property.title}
                            </a>
                          </td>
                          <td>{formatDate(property.createdAt)}</td>
                        </tr>
                      )) || (
                        <>
                          <tr>
                            <td>1</td>
                            <td>
                              <a href="#" className="post-link">
                                YEIDA- India's Next development hub
                              </a>
                            </td>
                            <td>2026-01-31</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>
                              <a href="#" className="post-link">
                                Complete Guide to Buying Residential Plots in Sector 20, Yamuna Expressway 2026
                              </a>
                            </td>
                            <td>2026-01-17</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>
                              <a href="#" className="post-link">
                                residential plots near Jewar Airport for investment
                              </a>
                            </td>
                            <td>2026-01-13</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>
                              <a href="#" className="post-link">
                                4000-meter Plots in Greater Noida
                              </a>
                            </td>
                            <td>2026-01-12</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="activity-logs-section">
                <h2>Activity Logs</h2>
                <div className="activity-logs-list">
                  {activityLogs.map((log, index) => (
                    <div key={index} className="activity-log-item">
                      <div className="activity-avatar">S</div>
                      <div className="activity-content">
                        <p>
                          <strong>{log.user}</strong> {log.message}
                        </p>
                        <span className="activity-time">
                          {log.time} ({log.ip})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real Estate Tab */}
        {activeTab === 'real-estate' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>All Properties</h2>
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

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Pages Management</h2>
            </div>
            <div className="no-data">Pages management coming soon...</div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Blog Management</h2>
            </div>
            <div className="no-data">Blog management coming soon...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
