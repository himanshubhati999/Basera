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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [widgetsModalOpen, setWidgetsModalOpen] = useState(false);
  const [realEstateExpanded, setRealEstateExpanded] = useState(true);
  const [widgets, setWidgets] = useState({
    activeProperties: true,
    pendingProperties: true,
    expiredProperties: true,
    agents: true,
    recentPosts: true,
    activityLogs: true
  });

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('adminTheme') || 'dark';
    setTheme(savedTheme);
    
    // Load saved widgets
    const savedWidgets = localStorage.getItem('adminWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
  };

  const toggleWidget = (widgetName) => {
    const updatedWidgets = {
      ...widgets,
      [widgetName]: !widgets[widgetName]
    };
    setWidgets(updatedWidgets);
    localStorage.setItem('adminWidgets', JSON.stringify(updatedWidgets));
  };

  const openWidgetsModal = () => {
    setWidgetsModalOpen(true);
  };

  const closeWidgetsModal = () => {
    setWidgetsModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
    <div className={`admin-dashboard-modern ${theme === 'light' ? 'light-mode' : ''}`}>
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${!mobileMenuOpen ? 'collapsed' : ''} ${sidebarCollapsed ? 'desktop-collapsed' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="sidebar-brand">Sunshine Real Estate</h2>
          <button 
            className="sidebar-close"
            onClick={closeMobileMenu}
            title="Close sidebar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); closeMobileMenu(); }}
          >
            <span className="nav-icon"><span className="material-symbols-outlined">dashboard</span></span>
            <span className="nav-text">Dashboard</span>
          </button>

          {/* Real Estate Section with Submenu */}
          <div className="nav-group">
            <button
              className={`nav-item ${(activeTab.startsWith('real-estate') || activeTab === 'properties' || activeTab === 'facilities') ? 'active' : ''} ${realEstateExpanded ? 'expanded' : ''}`}
              onClick={() => setRealEstateExpanded(!realEstateExpanded)}
            >
              <span className="nav-icon"><span className="material-symbols-outlined">home</span></span>
              <span className="nav-text">Real Estate</span>
              <span className="nav-expand-icon"><span className="material-symbols-outlined">{realEstateExpanded ? 'expand_less' : 'expand_more'}</span></span>
            </button>
            
            {realEstateExpanded && (
              <div className="nav-submenu">
                <button
                  className={`nav-subitem ${activeTab === 'real-estate' || activeTab === 'properties' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('real-estate'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Properties</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('projects'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Projects</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'features' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('features'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Features</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'facilities' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('facilities'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Facilities</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'investors' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('investors'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Investors</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'categories' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('categories'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Categories</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('reviews'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Reviews</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'invoices' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('invoices'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Invoices</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'custom-fields' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('custom-fields'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Custom Fields</span>
                </button>
              </div>
            )}
          </div>

          <button
            className={`nav-item ${activeTab === 'pages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pages'); closeMobileMenu(); }}
          >
            <span className="nav-icon"><span className="material-symbols-outlined">description</span></span>
            <span className="nav-text">Pages</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blog'); closeMobileMenu(); }}
          >
            <span className="nav-icon"><span className="material-symbols-outlined">article</span></span>
            <span className="nav-text">Blog</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">credit_card</span></span>
            <span className="nav-text">Payments</span>
            <span className="badge">2</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">work</span></span>
            <span className="nav-text">Careers</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">chat</span></span>
            <span className="nav-text">Consults</span>
            <span className="badge">2</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">campaign</span></span>
            <span className="nav-text">Ads</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">notifications</span></span>
            <span className="nav-text">Announcements</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">confirmation_number</span></span>
            <span className="nav-text">Coupons</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); closeMobileMenu(); }}
          >
            <span className="nav-icon"><span className="material-symbols-outlined">group</span></span>
            <span className="nav-text">Accounts</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">inventory_2</span></span>
            <span className="nav-text">Packages</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">mail</span></span>
            <span className="nav-text">Contact</span>
            <span className="badge">2</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">newspaper</span></span>
            <span className="nav-text">Newsletters</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">location_on</span></span>
            <span className="nav-text">Locations</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">perm_media</span></span>
            <span className="nav-text">Media</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">palette</span></span>
            <span className="nav-text">Appearance</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">extension</span></span>
            <span className="nav-text">Plugins</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">build</span></span>
            <span className="nav-text">Tools</span>
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span className="nav-icon"><span className="material-symbols-outlined">settings</span></span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Header */}
        <header className="admin-header-modern">
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
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
            <button className="header-icon-btn" onClick={toggleTheme}>
              <span className="theme-toggle">{theme === 'dark' ? '🌙' : '☀️'}</span>
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
              <button className="manage-widgets-btn" onClick={openWidgetsModal}>
                <span className="material-symbols-outlined">dashboard_customize</span>
                Manage Widgets
              </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards-modern">
              {widgets.activeProperties && (
              <div className="stat-card-modern purple">
                <div className="stat-card-content">
                  <h3>Active properties</h3>
                  <div className="stat-number-modern">
                    {stats?.availableProperties || 0}
                  </div>
                </div>
                <div className="stat-icon-bg">💼</div>
              </div>
              )}

              {widgets.pendingProperties && (
              <div className="stat-card-modern cyan">
                <div className="stat-card-content">
                  <h3>Pending properties</h3>
                  <div className="stat-number-modern">0</div>
                </div>
                <div className="stat-icon-bg"><span className="material-symbols-outlined">lists</span></div>
              </div>
              )}

              {widgets.expiredProperties && (
              <div className="stat-card-modern red">
                <div className="stat-card-content">
                  <h3>Expired properties</h3>
                  <div className="stat-number-modern">0</div>
                </div>
                <div className="stat-icon-bg">⏰</div>
              </div>
              )}

              {widgets.agents && (
              <div className="stat-card-modern blue">
                <div className="stat-card-content">
                  <h3>Agents</h3>
                  <div className="stat-number-modern">
                    {stats?.totalUsers || 3}
                  </div>
                </div>
                <div className="stat-icon-bg"><span className="material-symbols-outlined">group</span></div>
              </div>
              )}
            </div>

            {/* Recent Posts & Activity Logs */}
            <div className="dashboard-grid">
              {widgets.recentPosts && (
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
              )}

              {widgets.activityLogs && (
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
              )}
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
                              <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>phone</span> {property.ownerPhone}
                            </div>
                            <div className="contact-item">
                              <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>mail</span> {property.ownerEmail}
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
                              {property.isFeatured ? <><span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>star</span> Featured</> : <><span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>star_outline</span> Feature</>}
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

        {/* Facilities Tab */}
        {activeTab === 'facilities' && (
          <div className="admin-section">
            <div className="section-header">
              <div>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>DASHBOARD / REAL ESTATE / FACILITIES</span>
                <h2 style={{ marginTop: '10px', fontSize: '24px' }}>Facilities</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="action-btn view" style={{ padding: '8px 16px' }}>
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>filter_list</span> Filters
                </button>
                <button className="action-btn view" style={{ background: '#1e40af', color: 'white', padding: '8px 16px' }}>
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>add</span> Create
                </button>
                <button className="action-btn view" style={{ padding: '8px 16px' }}>
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>refresh</span> Reload
                </button>
              </div>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>
                      <input type="checkbox" />
                    </th>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>CREATED AT</th>
                    <th>STATUS</th>
                    <th>OPERATIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 11, name: 'Bank' },
                    { id: 10, name: 'Mall' },
                    { id: 9, name: 'Beach' },
                    { id: 8, name: 'Bus Stop' },
                    { id: 7, name: 'Railways' },
                    { id: 6, name: 'Airport' },
                    { id: 5, name: 'Pharmacy' },
                    { id: 4, name: 'Entertainment' },
                    { id: 3, name: 'School' },
                    { id: 2, name: 'Super Market' }
                  ].map((facility) => (
                    <tr key={facility.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{facility.id}</td>
                      <td style={{ color: '#3b82f6' }}>{facility.name}</td>
                      <td>2024-11-22</td>
                      <td>
                        <span style={{ 
                          background: '#10b981', 
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Published
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" style={{ background: '#3b82f6', color: 'white', padding: '6px 12px' }}>
                            <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>edit</span>
                          </button>
                          <button className="action-btn delete" style={{ background: '#ef4444', color: 'white', padding: '6px 12px' }}>
                            <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="admin-section">
            <div className="section-header">
              <div>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>DASHBOARD / REAL ESTATE / PROJECTS</span>
                <h2 style={{ marginTop: '10px', fontSize: '24px' }}>Projects</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      padding: '8px 16px 8px 40px', 
                      background: '#1a1f37', 
                      border: '1px solid #374151', 
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                      width: '200px'
                    }}
                  />
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px',
                    color: '#6b7280'
                  }}>search</span>
                </div>
                <button className="action-btn view" style={{ background: '#1e40af', color: 'white', padding: '8px 16px' }}
                  onClick={() => navigate('/admin/projects/create')}
                >
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>add</span> Create
                </button>
                <button className="action-btn view" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}
                  onClick={fetchDashboardData}
                >
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>refresh</span> Reload
                </button>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="no-data">No projects found</div>
            ) : (
              <>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>
                          <input type="checkbox" />
                        </th>
                        <th style={{ width: '80px' }}>ID</th>
                        <th style={{ width: '100px' }}>IMAGE</th>
                        <th>NAME</th>
                        <th style={{ width: '100px' }}>VIEWS</th>
                        <th style={{ width: '150px' }}>UNIQUE ID</th>
                        <th style={{ width: '150px' }}>CREATED AT</th>
                        <th style={{ width: '120px' }}>STATUS</th>
                        <th style={{ width: '150px' }}>OPERATIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((project, index) => (
                        <tr key={project._id}>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td style={{ fontWeight: '500' }}>{index + 1}</td>
                          <td>
                            <img 
                              src={project.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=70&fit=crop'} 
                              alt={project.title}
                              style={{ 
                                width: '80px', 
                                height: '50px', 
                                objectFit: 'cover', 
                                borderRadius: '6px',
                                border: '1px solid #374151'
                              }}
                            />
                          </td>
                          <td style={{ color: '#3b82f6', fontWeight: '500', cursor: 'pointer' }}
                            onClick={() => navigate(`/properties/${project._id}`)}
                          >
                            {project.title}
                          </td>
                          <td>{project.views || Math.floor(Math.random() * 100)}</td>
                          <td style={{ color: '#9ca3af', fontSize: '12px' }}>{project._id.slice(-8).toUpperCase()}</td>
                          <td>{formatDate(project.createdAt)}</td>
                          <td>
                            <span style={{ 
                              background: project.status === 'available' ? '#10b981' : 
                                         project.status === 'sold' ? '#ef4444' : 
                                         project.status === 'rented' ? '#f59e0b' : '#6b7280',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {project.status === 'available' ? 'Selling' : project.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="action-btn view" 
                                style={{ background: '#3b82f6', color: 'white', padding: '6px 12px' }}
                                onClick={() => navigate(`/properties/${project._id}`)}
                              >
                                <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>visibility</span>
                              </button>
                              <button 
                                className="action-btn delete" 
                                style={{ background: '#ef4444', color: 'white', padding: '6px 12px' }}
                                onClick={() => handleDeleteProperty(project._id)}
                              >
                                <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ 
                    padding: '15px', 
                    color: '#9ca3af', 
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderTop: '1px solid #1e2538'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>public</span>
                    Show from 1 to {filteredProperties.length} in <span style={{ 
                      background: '#3b82f6', 
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>{filteredProperties.length}</span> records
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Features</h2>
            </div>
            <div className="no-data">Features management coming soon...</div>
          </div>
        )}

        {/* Investors Tab */}
        {activeTab === 'investors' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Investors</h2>
            </div>
            <div className="no-data">Investors management coming soon...</div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Categories</h2>
            </div>
            <div className="no-data">Categories management coming soon...</div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Reviews</h2>
            </div>
            <div className="no-data">Reviews management coming soon...</div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Invoices</h2>
            </div>
            <div className="no-data">Invoices management coming soon...</div>
          </div>
        )}

        {/* Custom Fields Tab */}
        {activeTab === 'custom-fields' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Custom Fields</h2>
            </div>
            <div className="no-data">Custom fields management coming soon...</div>
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

      {/* Manage Widgets Modal */}
      {widgetsModalOpen && (
        <div className="widgets-modal-overlay" onClick={closeWidgetsModal}>
          <div className="widgets-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="widgets-modal-header">
              <h2>
                <span className="material-symbols-outlined">dashboard_customize</span>
                Manage Widgets
              </h2>
              <button className="widgets-modal-close" onClick={closeWidgetsModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="widgets-modal-body">
              <p className="widgets-modal-description">
                Toggle widgets on or off to customize your dashboard view.
              </p>
              
              <div className="widgets-list">
                <div className="widget-item">
                  <div className="widget-info">
                    <div className="widget-icon purple">💼</div>
                    <div>
                      <h3>Active Properties</h3>
                      <p>Shows count of active property listings</p>
                    </div>
                  </div>
                  <label className="widget-toggle">
                    <input 
                      type="checkbox" 
                      checked={widgets.activeProperties}
                      onChange={() => toggleWidget('activeProperties')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="widget-item">
                  <div className="widget-info">
                    <div className="widget-icon cyan">
                      <span className="material-symbols-outlined">lists</span>
                    </div>
                    <div>
                      <h3>Pending Properties</h3>
                      <p>Shows count of pending property approvals</p>
                    </div>
                  </div>
                  <label className="widget-toggle">
                    <input 
                      type="checkbox" 
                      checked={widgets.pendingProperties}
                      onChange={() => toggleWidget('pendingProperties')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="widget-item">
                  <div className="widget-info">
                    <div className="widget-icon red">⏰</div>
                    <div>
                      <h3>Expired Properties</h3>
                      <p>Shows count of expired property listings</p>
                    </div>
                  </div>
                  <label className="widget-toggle">
                    <input 
                      type="checkbox" 
                      checked={widgets.expiredProperties}
                      onChange={() => toggleWidget('expiredProperties')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="widget-item">
                  <div className="widget-info">
                    <div className="widget-icon blue">
                      <span className="material-symbols-outlined">group</span>
                    </div>
                    <div>
                      <h3>Agents</h3>
                      <p>Shows total count of registered agents</p>
                    </div>
                  </div>
                  <label className="widget-toggle">
                    <input 
                      type="checkbox" 
                      checked={widgets.agents}
                      onChange={() => toggleWidget('agents')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="widget-item">
                  <div className="widget-info">
                    <div className="widget-icon purple">
                      <span className="material-symbols-outlined">article</span>
                    </div>
                    <div>
                      <h3>Recent Posts</h3>
                      <p>Displays the latest property posts</p>
                    </div>
                  </div>
                  <label className="widget-toggle">
                    <input 
                      type="checkbox" 
                      checked={widgets.recentPosts}
                      onChange={() => toggleWidget('recentPosts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="widget-item">
                  <div className="widget-info">
                    <div className="widget-icon cyan">
                      <span className="material-symbols-outlined">history</span>
                    </div>
                    <div>
                      <h3>Activity Logs</h3>
                      <p>Shows recent system activity and user actions</p>
                    </div>
                  </div>
                  <label className="widget-toggle">
                    <input 
                      type="checkbox" 
                      checked={widgets.activityLogs}
                      onChange={() => toggleWidget('activityLogs')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="widgets-modal-footer">
              <button className="widgets-modal-btn secondary" onClick={closeWidgetsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
