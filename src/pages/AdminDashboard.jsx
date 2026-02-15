import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import CreateProject from './CreateProject';
import PostProperty from './PostProperty';
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
  const [consults, setConsults] = useState([]);
  const [consultFields, setConsultFields] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showPageForm, setShowPageForm] = useState(false);
  const [pageSlug, setPageSlug] = useState('');
  const [showEditor, setShowEditor] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogSlug, setBlogSlug] = useState('');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [widgetsModalOpen, setWidgetsModalOpen] = useState(false);
  const [realEstateExpanded, setRealEstateExpanded] = useState(true);
  const [consultsExpanded, setConsultsExpanded] = useState(true);
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

  useEffect(() => {
    // Set pageSlug when editing an existing page
    if (selectedPage && selectedPage.slug) {
      setPageSlug(selectedPage.slug);
    } else {
      setPageSlug('');
    }
  }, [selectedPage]);

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

      // Fetch consults
      const consultsResponse = await fetch(API_ENDPOINTS.CONSULTS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (consultsResponse.ok) {
        const consultsData = await consultsResponse.json();
        setConsults(consultsData.consults);
      }

      // Fetch consult custom fields
      const fieldsResponse = await fetch(API_ENDPOINTS.CONSULT_FIELDS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (fieldsResponse.ok) {
        const fieldsData = await fieldsResponse.json();
        setConsultFields(fieldsData.fields);
      }

      // Fetch pages
      const pagesResponse = await fetch(API_ENDPOINTS.PAGES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json();
        setPages(pagesData.pages);
        // Filter blog posts (pages with 'Blog Page' template)
        const blogs = pagesData.pages.filter(page => page.template === 'Blog Page');
        setBlogPosts(blogs);
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

  const handleTogglePublish = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_PROPERTY_PUBLISHED(propertyId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update the properties array with the updated property
        setProperties(properties.map(p => 
          p._id === propertyId ? data.property : p
        ));
        alert(data.message);
      } else {
        alert('Failed to update publish status');
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
      alert('Error updating publish status');
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

  const handleDeleteConsult = async (consultId) => {
    if (!window.confirm('Are you sure you want to delete this consultation request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CONSULT_BY_ID(consultId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setConsults(consults.filter(c => c._id !== consultId));
        alert('Consultation request deleted successfully');
      } else {
        alert('Failed to delete consultation request');
      }
    } catch (err) {
      console.error('Error deleting consult:', err);
      alert('Error deleting consultation request');
    }
  };

  const handleUpdateConsultStatus = async (consultId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CONSULT_STATUS(consultId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setConsults(consults.map(c => 
          c._id === consultId ? data.consult : c
        ));
        // Update selectedConsult if it's the one being viewed
        if (selectedConsult && selectedConsult._id === consultId) {
          setSelectedConsult(data.consult);
        }
        alert('Status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating consult status:', err);
      alert('Error updating status');
    }
  };

  const handleCreateField = async (fieldData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CONSULT_FIELDS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fieldData)
      });

      if (response.ok) {
        const data = await response.json();
        setConsultFields([...consultFields, data.field]);
        setShowFieldForm(false);
        setSelectedField(null);
        alert('Custom field created successfully');
      } else {
        alert('Failed to create custom field');
      }
    } catch (err) {
      console.error('Error creating custom field:', err);
      alert('Error creating custom field');
    }
  };

  const handleUpdateField = async (fieldId, fieldData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CONSULT_FIELD_BY_ID(fieldId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fieldData)
      });

      if (response.ok) {
        const data = await response.json();
        setConsultFields(consultFields.map(f => 
          f._id === fieldId ? data.field : f
        ));
        setShowFieldForm(false);
        setSelectedField(null);
        alert('Custom field updated successfully');
      } else {
        alert('Failed to update custom field');
      }
    } catch (err) {
      console.error('Error updating custom field:', err);
      alert('Error updating custom field');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this custom field?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CONSULT_FIELD_BY_ID(fieldId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setConsultFields(consultFields.filter(f => f._id !== fieldId));
        alert('Custom field deleted successfully');
      } else {
        alert('Failed to delete custom field');
      }
    } catch (err) {
      console.error('Error deleting custom field:', err);
      alert('Error deleting custom field');
    }
  };

  // Pages handlers
  const handleCreatePage = async (pageData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        const data = await response.json();
        setPages([data.page, ...pages]);
        setShowPageForm(false);
        setSelectedPage(null);
        setPageSlug('');
        const pageUrl = `${window.location.origin}/${data.page.slug}`;
        alert(`Page created successfully!\n\nYour page is now live at:\n${pageUrl}\n\nStatus: ${data.page.status}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create page');
      }
    } catch (err) {
      console.error('Error creating page:', err);
      alert('Error creating page');
    }
  };

  const handleUpdatePage = async (pageId, pageData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGE_BY_ID(pageId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        const data = await response.json();
        setPages(pages.map(p => 
          p._id === pageId ? data.page : p
        ));
        setShowPageForm(false);
        setSelectedPage(null);
        setPageSlug('');
        const pageUrl = `${window.location.origin}/${data.page.slug}`;
        alert(`Page updated successfully!\n\nView your page at:\n${pageUrl}\n\nStatus: ${data.page.status}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update page');
      }
    } catch (err) {
      console.error('Error updating page:', err);
      alert('Error updating page');
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGE_BY_ID(pageId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPages(pages.filter(p => p._id !== pageId));
        alert('Page deleted successfully');
      } else {
        alert('Failed to delete page');
      }
    } catch (err) {
      console.error('Error deleting page:', err);
      alert('Error deleting page');
    }
  };

  const handleUpdatePageStatus = async (pageId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGE_STATUS(pageId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setPages(pages.map(p => 
          p._id === pageId ? data.page : p
        ));
        alert('Page status updated successfully');
      } else {
        alert('Failed to update page status');
      }
    } catch (err) {
      console.error('Error updating page status:', err);
      alert('Error updating page status');
    }
  };

  // Blog Post handlers
  const handleCreateBlog = async (blogData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...blogData, template: 'Blog Page' })
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts([data.page, ...blogPosts]);
        setPages([data.page, ...pages]);
        setShowBlogForm(false);
        setSelectedBlog(null);
        setBlogSlug('');
        alert(`Blog post created successfully!\n\nStatus: ${data.page.status}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create blog post');
      }
    } catch (err) {
      console.error('Error creating blog post:', err);
      alert('Error creating blog post');
    }
  };

  const handleUpdateBlog = async (blogId, blogData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGE_BY_ID(blogId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...blogData, template: 'Blog Page' })
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts(blogPosts.map(p => 
          p._id === blogId ? data.page : p
        ));
        setPages(pages.map(p => 
          p._id === blogId ? data.page : p
        ));
        setShowBlogForm(false);
        setSelectedBlog(null);
        setBlogSlug('');
        alert(`Blog post updated successfully!\n\nStatus: ${data.page.status}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update blog post');
      }
    } catch (err) {
      console.error('Error updating blog post:', err);
      alert('Error updating blog post');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGE_BY_ID(blogId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBlogPosts(blogPosts.filter(p => p._id !== blogId));
        setPages(pages.filter(p => p._id !== blogId));
        alert('Blog post deleted successfully');
      } else {
        alert('Failed to delete blog post');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      alert('Error deleting blog post');
    }
  };

  const handleUpdateBlogStatus = async (blogId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PAGE_STATUS(blogId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts(blogPosts.map(p => 
          p._id === blogId ? data.page : p
        ));
        setPages(pages.map(p => 
          p._id === blogId ? data.page : p
        ));
        alert('Blog status updated successfully');
      } else {
        alert('Failed to update blog status');
      }
    } catch (err) {
      console.error('Error updating blog status:', err);
      alert('Error updating blog status');
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

  // Filter only non-project properties (for properties tab)
  const filteredNonProjectProperties = properties.filter(property =>
    property.propertyType !== 'project' &&
    (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     property.postedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter only projects (for projects tab)
  const filteredProjects = properties.filter(property =>
    property.propertyType === 'project' &&
    (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     property.postedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConsults = consults.filter(consult =>
    consult.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consult.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consult.phone.toLowerCase().includes(searchTerm.toLowerCase())
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

          {/* Consults Section with Submenu */}
          <div className="nav-group">
            <button
              className={`nav-item ${(activeTab === 'consults' || activeTab === 'consult-fields') ? 'active' : ''} ${consultsExpanded ? 'expanded' : ''}`}
              onClick={() => setConsultsExpanded(!consultsExpanded)}
            >
              <span className="nav-icon"><span className="material-symbols-outlined">chat</span></span>
              <span className="nav-text">Consults</span>
              {consults.filter(c => c.status === 'unread').length > 0 && (
                <span className="badge">{consults.filter(c => c.status === 'unread').length}</span>
              )}
              <span className="nav-expand-icon"><span className="material-symbols-outlined">{consultsExpanded ? 'expand_less' : 'expand_more'}</span></span>
            </button>
            
            {consultsExpanded && (
              <div className="nav-submenu">
                <button
                  className={`nav-subitem ${activeTab === 'consults' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('consults'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Consults</span>
                </button>
                <button
                  className={`nav-subitem ${activeTab === 'consult-fields' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('consult-fields'); closeMobileMenu(); }}
                >
                  <span className="subitem-dot"></span>
                  <span className="nav-text">Custom Fields</span>
                </button>
              </div>
            )}
          </div>

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
              <div>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>DASHBOARD / REAL ESTATE / PROPERTIES</span>
                <h2 style={{ marginTop: '10px', fontSize: '24px' }}>All Properties</h2>
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
                  onClick={() => setActiveTab('post-property')}
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

            {filteredNonProjectProperties.length === 0 ? (
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
                    {filteredNonProjectProperties.map(property => (
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

        {/* Consults Tab */}
        {activeTab === 'consults' && !selectedConsult && (
          <div className="admin-section">
            <div className="section-header">
              <div>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>DASHBOARD / CONSULTS</span>
                <h2 style={{ marginTop: '10px', fontSize: '24px' }}>Consults</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="action-btn view" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}>
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>tune</span> Bulk Actions
                </button>
                <button className="action-btn view" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}>
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>filter_list</span> Filters
                </button>
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
                <button 
                  className="action-btn view" 
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}
                  onClick={fetchDashboardData}
                >
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>refresh</span> Reload
                </button>
              </div>
            </div>

            <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{fontSize: '18px'}}>info</span>
              Show from 1 to {filteredConsults.length} in {filteredConsults.length} records
            </div>

            {filteredConsults.length === 0 ? (
              <div className="no-data">No consultation requests found</div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>
                        <input type="checkbox" />
                      </th>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>IP ADDRESS</th>
                      <th>CREATED AT</th>
                      <th>STATUS</th>
                      <th>OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsults.map((consult, index) => (
                      <tr key={consult._id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>{index + 1}</td>
                        <td 
                          style={{ color: '#3b82f6', fontWeight: '500', cursor: 'pointer' }}
                          onClick={() => setSelectedConsult(consult)}
                        >
                          {consult.name}
                        </td>
                        <td>{consult.email}</td>
                        <td>{consult.phone}</td>
                        <td>{consult.ipAddress || 'N/A'}</td>
                        <td>{formatDate(consult.createdAt)}</td>
                        <td>
                          <select
                            className={`status-badge ${consult.status}`}
                            value={consult.status}
                            onChange={(e) => handleUpdateConsultStatus(consult._id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              background: consult.status === 'unread' ? '#f59e0b' : 
                                         consult.status === 'read' ? '#3b82f6' :
                                         consult.status === 'contacted' ? '#10b981' : '#6b7280',
                              color: '#fff'
                            }}
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="action-btn view"
                              style={{
                                padding: '6px 12px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => {
                                setSelectedConsult(consult);
                              }}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span>
                            </button>
                            <button
                              className="action-btn delete"
                              style={{
                                padding: '6px 12px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => handleDeleteConsult(consult._id)}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span>
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

        {/* Consult Detail View */}
        {activeTab === 'consults' && selectedConsult && (
          <div className="admin-section">
            <div className="section-header">
              <div>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>
                  <button 
                    onClick={() => setSelectedConsult(null)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#3b82f6', 
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  >
                    DASHBOARD
                  </button>
                  / 
                  <button 
                    onClick={() => setSelectedConsult(null)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#3b82f6', 
                      cursor: 'pointer',
                      margin: '0 8px'
                    }}
                  >
                    CONSULTS
                  </button>
                  / EDIT "{selectedConsult.name.toUpperCase()}"
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginTop: '24px' }}>
              {/* Left Column - Consult Information */}
              <div style={{ background: '#1a1f37', borderRadius: '8px', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#fff' }}>Consult information</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Time</label>
                    <div style={{ color: '#fff', fontSize: '14px' }}>
                      {new Date(selectedConsult.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Consult ID</label>
                    <div style={{ color: '#fff', fontSize: '14px' }}>AB{String(selectedConsult._id).slice(-6).toUpperCase()}</div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Name</label>
                    <div style={{ color: '#fff', fontSize: '14px' }}>{selectedConsult.name}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>IP Address</label>
                    <div style={{ color: '#fff', fontSize: '14px' }}>{selectedConsult.ipAddress || 'N/A'}</div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Email</label>
                    <div style={{ color: '#3b82f6', fontSize: '14px' }}>{selectedConsult.email}</div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Phone</label>
                    <div style={{ color: '#fff', fontSize: '14px' }}>{selectedConsult.phone}</div>
                  </div>
                </div>

                {selectedConsult.property && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Schedule a Tour (Optional)</label>
                    <div style={{ color: '#fff', fontSize: '14px' }}>{selectedConsult.property}</div>
                  </div>
                )}

                {selectedConsult.message && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Details</label>
                    <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.6' }}>{selectedConsult.message}</div>
                  </div>
                )}
              </div>

              {/* Right Column - Publish Section */}
              <div>
                <div style={{ background: '#1a1f37', borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Publish</h3>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button 
                      onClick={() => {
                        setSelectedConsult(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>save</span>
                      Save
                    </button>
                    
                    <button 
                      onClick={() => {
                        setSelectedConsult(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>exit_to_app</span>
                      Save & Exit
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Status <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={selectedConsult.status}
                      onChange={(e) => handleUpdateConsultStatus(selectedConsult._id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
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
                  onClick={() => setActiveTab('create-project')}
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

            {filteredProjects.length === 0 ? (
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
                        <th style={{ width: '120px' }}>PUBLISH</th>
                        <th style={{ width: '100px' }}>VIEWS</th>
                        <th style={{ width: '150px' }}>UNIQUE ID</th>
                        <th style={{ width: '150px' }}>CREATED AT</th>
                        <th style={{ width: '120px' }}>STATUS</th>
                        <th style={{ width: '150px' }}>OPERATIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project, index) => (
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
                          <td>
                            <span style={{ 
                              background: project.isPublished ? '#10b981' : '#f59e0b',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}>
                              {project.isPublished ? '🟢 Published' : '🔴 Draft'}
                            </span>
                          </td>
                          <td>{project.views || Math.floor(Math.random() * 100)}</td>
                          <td style={{ color: '#9ca3af', fontSize: '12px' }}>{project._id.slice(-8).toUpperCase()}</td>
                          <td>{formatDate(project.createdAt)}</td>
                          <td>
                            <span style={{ 
                              background: project.status === 'upcoming' ? '#3b82f6' : 
                                         project.status === 'ongoing' ? '#f59e0b' : 
                                         project.status === 'completed' ? '#10b981' : '#6b7280',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {project.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="action-btn" 
                                style={{ 
                                  background: project.isPublished ? '#f59e0b' : '#10b981', 
                                  color: 'white', 
                                  padding: '6px 12px',
                                  marginRight: '5px'
                                }}
                                onClick={() => handleTogglePublish(project._id)}
                                title={project.isPublished ? 'Unpublish' : 'Publish'}
                              >
                                <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>
                                  {project.isPublished ? 'visibility_off' : 'publish'}
                                </span>
                              </button>
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
                    Show from 1 to {filteredProjects.length} in <span style={{ 
                      background: '#3b82f6', 
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>{filteredProjects.length}</span> records
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

        {/* Consult Custom Fields Tab */}
        {activeTab === 'consult-fields' && !showFieldForm && (
          <div className="admin-section">
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <div>
                <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: '600', color: '#fff' }}>Custom Fields</h2>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>DASHBOARD / CONSULTS / CUSTOM FIELDS</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="action-btn primary"
                  style={{ padding: '8px 16px', background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => { setSelectedField(null); setShowFieldForm(true); }}
                >
                  <span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span> Create
                </button>
                <button 
                  className="action-btn view" 
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}
                  onClick={fetchDashboardData}
                >
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>refresh</span> Reload
                </button>
              </div>
            </div>

            <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{fontSize: '18px'}}>info</span>
              Show from 1 to {consultFields.length} in {consultFields.length} records
            </div>

            {consultFields.length === 0 ? (
              <div className="no-data">No custom fields found. Click "Create" to add a new field.</div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>
                        <input type="checkbox" />
                      </th>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>TYPE</th>
                      <th>CREATED AT</th>
                      <th>OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultFields.map((field, index) => (
                      <tr key={field._id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>{index + 1}</td>
                        <td style={{ color: '#3b82f6', fontWeight: '500' }}>{field.name}</td>
                        <td>{field.fieldType}</td>
                        <td>{formatDate(field.createdAt)}</td>
                        <td>
                          <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="action-btn edit"
                              style={{
                                padding: '6px 12px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px'
                              }}
                              onClick={() => { setSelectedField(field); setShowFieldForm(true); }}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span>
                              Edit
                            </button>
                            <button
                              className="action-btn delete"
                              style={{
                                padding: '6px 12px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px'
                              }}
                              onClick={() => handleDeleteField(field._id)}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span>
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

        {/* Custom Field Create/Edit Form */}
        {activeTab === 'consult-fields' && showFieldForm && (
          <div className="admin-section">
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <div>
                <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                  {selectedField ? 'Edit Custom Field' : 'Create Custom Field'}
                </h2>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>
                  DASHBOARD / REAL ESTATE / CREATE CUSTOM FIELD
                </span>
              </div>
            </div>

            <form id="fieldForm" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const fieldData = {
                name: formData.get('name'),
                fieldType: formData.get('fieldType'),
                required: formData.get('required') === 'on',
                placeholder: formData.get('placeholder'),
                order: parseInt(formData.get('order')) || 0,
                active: formData.get('active') === 'on'
              };
              
              if (selectedField) {
                handleUpdateField(selectedField._id, fieldData);
              } else {
                handleCreateField(fieldData);
              }
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
                {/* Left Column - Form Fields */}
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="fieldType"
                      required
                      defaultValue={selectedField?.fieldType || 'text'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#0c111d',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="date">Date</option>
                      <option value="textarea">Textarea</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={selectedField?.name || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#0c111d',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                      placeholder="Name"
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Placeholder
                    </label>
                    <input
                      type="text"
                      name="placeholder"
                      defaultValue={selectedField?.placeholder || ''}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#0c111d',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                      placeholder="Placeholder"
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <div style={{
                        position: 'relative',
                        width: '48px',
                        height: '24px',
                        background: selectedField?.required ? '#3b82f6' : '#374151',
                        borderRadius: '12px',
                        transition: 'background 0.2s'
                      }}>
                        <input
                          type="checkbox"
                          name="required"
                          defaultChecked={selectedField?.required || false}
                          style={{ 
                            position: 'absolute',
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          left: selectedField?.required ? '26px' : '2px',
                          width: '20px',
                          height: '20px',
                          background: '#fff',
                          borderRadius: '50%',
                          transition: 'left 0.2s'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '14px', color: '#fff' }}>Required</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Order <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="order"
                      required
                      defaultValue={selectedField?.order || 999}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#0c111d',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                      placeholder="999"
                    />
                  </div>
                </div>

                {/* Right Column - Publish Section */}
                <div>
                  <div style={{ background: '#1a1f37', borderRadius: '8px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Publish</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      <button 
                        type="submit"
                        style={{
                          width: '100%',
                          padding: '10px 20px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>save</span>
                        Save
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => {
                          document.getElementById('fieldForm').requestSubmit();
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 20px',
                          background: 'transparent',
                          color: '#fff',
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>exit_to_app</span>
                        Save & Exit
                      </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Status
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: '#0c111d', borderRadius: '6px' }}>
                        <input
                          type="checkbox"
                          name="active"
                          defaultChecked={selectedField?.active !== false}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', color: '#fff' }}>Active</span>
                      </label>
                    </div>

                    {selectedField && (
                      <div style={{ paddingTop: '20px', borderTop: '1px solid #374151' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
                            Created
                          </label>
                          <div style={{ color: '#9ca3af', fontSize: '13px' }}>{formatDate(selectedField.createdAt)}</div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
                            Last Modified
                          </label>
                          <div style={{ color: '#9ca3af', fontSize: '13px' }}>{formatDate(selectedField.updatedAt)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && !showPageForm && (
          <div className="admin-section">
            <div className="section-header">
              <div>
                <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>DASHBOARD / PAGES</span>
                <h2 style={{ marginTop: '10px', fontSize: '24px' }}>Pages</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="action-btn view" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}>
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>tune</span> Bulk Actions
                </button>
                <button className="action-btn view" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}>
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>filter_list</span> Filters
                </button>
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
                <button 
                  className="action-btn view" 
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #374151' }}
                  onClick={fetchDashboardData}
                >
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>refresh</span> Reload
                </button>
                <button 
                  className="action-btn view" 
                  style={{ padding: '8px 16px', background: '#3b82f6', border: 'none' }}
                  onClick={() => {
                    setSelectedPage(null);
                    setShowPageForm(true);
                  }}
                >
                  <span className="material-symbols-outlined" style={{fontSize: '16px', verticalAlign: 'middle'}}>add</span> Create
                </button>
              </div>
            </div>

            {pages.length === 0 ? (
              <div className="no-data">No pages found</div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>
                        <input type="checkbox" style={{ cursor: 'pointer' }} />
                      </th>
                      <th style={{ width: '5%' }}>ID</th>
                      <th style={{ width: '25%' }}>NAME</th>
                      <th style={{ width: '15%' }}>TEMPLATE</th>
                      <th style={{ width: '15%' }}>CREATED AT</th>
                      <th style={{ width: '10%' }}>STATUS</th>
                      <th style={{ width: '15%' }}>OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page, index) => (
                      <tr key={page._id}>
                        <td>
                          <input type="checkbox" style={{ cursor: 'pointer' }} />
                        </td>
                        <td>{pages.length - index}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontWeight: '500', color: '#3b82f6', cursor: 'pointer' }}
                              onClick={() => {
                                setSelectedPage(page);
                                setShowPageForm(true);
                              }}
                            >
                              {page.name}
                            </div>
                            {page.description && (
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {page.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{page.template}</td>
                        <td>{formatDate(page.createdAt)}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: page.status === 'Published' ? '#10b981' : page.status === 'Draft' ? '#6b7280' : '#f59e0b',
                            color: '#fff'
                          }}>
                            {page.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="action-btn edit"
                              style={{ 
                                padding: '6px 12px',
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => {
                                setSelectedPage(page);
                                setShowPageForm(true);
                              }}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span>
                            </button>
                            {page.status === 'Published' && (
                              <button
                                className="action-btn view"
                                style={{ 
                                  padding: '6px 12px',
                                  background: '#10b981',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onClick={() => window.open(`/${page.slug}`, '_blank')}
                                title="View page"
                              >
                                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>visibility</span>
                              </button>
                            )}
                            <button
                              className="action-btn delete"
                              style={{ 
                                padding: '6px 12px',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => handleDeletePage(page._id)}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span>
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

        {/* Pages Form */}
        {activeTab === 'pages' && showPageForm && (
          <div className="admin-section" style={{ padding: '0' }}>
            {/* Header with Breadcrumb */}
            <div style={{ 
              padding: '20px 30px', 
              borderBottom: '1px solid #374151',
              background: '#0c111d'
            }}>
              <span style={{ fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                DASHBOARD / PAGES / {selectedPage ? 'EDIT PAGE' : 'CREATE NEW PAGE'}
              </span>
            </div>

            <form 
              id="pageForm"
              style={{ position: 'relative' }}
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const pageData = {
                  name: formData.get('name'),
                  slug: formData.get('permalink'),
                  description: formData.get('description'),
                  template: formData.get('template'),
                  status: formData.get('status'),
                  content: formData.get('content'),
                  metaTitle: formData.get('metaTitle'),
                  metaDescription: formData.get('metaDescription'),
                  metaKeywords: formData.get('metaKeywords'),
                  tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                  isHomePage: formData.get('isHomePage') === 'on'
                };
                
                if (selectedPage) {
                  await handleUpdatePage(selectedPage._id, pageData);
                } else {
                  await handleCreatePage(pageData);
                }
              }}
            >
              {/* Two Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: 'calc(100vh - 200px)' }}>
                {/* Left Column - Main Content */}
                <div style={{ padding: '30px', background: '#0f1419' }}>
                  {/* Name Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={selectedPage?.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/[\s_-]+/g, '-')
                          .replace(/^-+|-+$/g, '');
                        setPageSlug(slug);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="Name"
                    />
                  </div>

                  {/* Permalink Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Permalink <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="permalink"
                      required
                      value={pageSlug || selectedPage?.slug || ''}
                      onChange={(e) => setPageSlug(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="https://sunshinerealestatepvtltd.com/"
                    />
                    {pageSlug && (
                      <div style={{ 
                        marginTop: '6px', 
                        fontSize: '12px', 
                        color: '#6b7280' 
                      }}>
                        <span style={{ color: '#9ca3af' }}>Preview: </span>
                        <span style={{ color: '#3b82f6' }}>
                          https://yourdomain.com/{pageSlug}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={selectedPage?.description || ''}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="Short description"
                    />
                  </div>

                  {/* Content Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '12px',
                      fontWeight: '500'
                    }}>
                      Content
                    </label>
                    
                    {/* Editor Toolbar */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      marginBottom: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        type="button"
                        onClick={() => setShowEditor(!showEditor)}
                        style={{
                          padding: '8px 16px',
                          background: '#374151',
                          color: '#e5e7eb',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                        onMouseLeave={(e) => e.target.style.background = '#374151'}
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                          {showEditor ? 'visibility_off' : 'visibility'}
                        </span>
                        {showEditor ? 'Hide' : 'Show'} Editor
                      </button>
                      
                      <button
                        type="button"
                        style={{
                          padding: '8px 16px',
                          background: '#374151',
                          color: '#e5e7eb',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                        onMouseLeave={(e) => e.target.style.background = '#374151'}
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                          add_photo_alternate
                        </span>
                        Add media
                      </button>
                      
                      <button
                        type="button"
                        style={{
                          padding: '8px 16px',
                          background: '#374151',
                          color: '#e5e7eb',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                        onMouseLeave={(e) => e.target.style.background = '#374151'}
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                          widgets
                        </span>
                        UI Blocks
                      </button>
                    </div>

                    {/* Enhanced Text Editor Area */}
                    {showEditor && (
                      <div style={{ 
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        background: '#1a1f37'
                      }}>
                        {/* Formatting Toolbar */}
                        <div style={{ 
                          padding: '8px',
                          borderBottom: '1px solid #374151',
                          display: 'flex',
                          gap: '4px',
                          flexWrap: 'wrap',
                          background: '#0f1419'
                        }}>
                          {/* Format buttons */}
                          <select style={{ 
                            padding: '4px 8px',
                            background: '#1a1f37',
                            border: '1px solid #374151',
                            borderRadius: '3px',
                            color: '#e5e7eb',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                            <option>Paragraph</option>
                            <option>Heading 1</option>
                            <option>Heading 2</option>
                            <option>Heading 3</option>
                          </select>
                          
                          {['format_bold', 'format_italic', 'format_underlined', 'link', 'format_list_bulleted', 'format_list_numbered'].map(icon => (
                            <button
                              key={icon}
                              type="button"
                              style={{
                                width: '32px',
                                height: '32px',
                                background: 'transparent',
                                border: '1px solid #374151',
                                borderRadius: '3px',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#374151';
                                e.target.style.color = '#e5e7eb';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#9ca3af';
                              }}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                                {icon}
                              </span>
                            </button>
                          ))}
                        </div>
                        
                        <textarea
                          name="content"
                          defaultValue={selectedPage?.content || ''}
                          rows="15"
                          style={{
                            width: '100%',
                            padding: '16px',
                            background: '#1a1f37',
                            border: 'none',
                            color: '#fff',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            minHeight: '400px'
                          }}
                          placeholder="Start typing your content here..."
                        />
                      </div>
                    )}
                  </div>

                  {/* SEO Section - Collapsed by default */}
                  <details style={{ marginTop: '32px' }}>
                    <summary style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      color: '#e5e7eb',
                      cursor: 'pointer',
                      padding: '12px 0',
                      listStyle: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span className="material-symbols-outlined" style={{fontSize: '20px'}}>
                        expand_more
                      </span>
                      SEO Settings
                    </summary>
                    
                    <div style={{ paddingTop: '20px' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#e5e7eb', marginBottom: '8px', fontWeight: '500' }}>
                          Meta Title
                        </label>
                        <input
                          type="text"
                          name="metaTitle"
                          defaultValue={selectedPage?.metaTitle || ''}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#1a1f37',
                            border: '1px solid #374151',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          placeholder="SEO meta title"
                        />
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#e5e7eb', marginBottom: '8px', fontWeight: '500' }}>
                          Meta Description
                        </label>
                        <textarea
                          name="metaDescription"
                          defaultValue={selectedPage?.metaDescription || ''}
                          rows="3"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#1a1f37',
                            border: '1px solid #374151',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none'
                          }}
                          placeholder="SEO meta description"
                        />
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#e5e7eb', marginBottom: '8px', fontWeight: '500' }}>
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          name="metaKeywords"
                          defaultValue={selectedPage?.metaKeywords || ''}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#1a1f37',
                            border: '1px solid #374151',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: '#e5e7eb', marginBottom: '8px', fontWeight: '500' }}>
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          defaultValue={selectedPage?.tags?.join(', ') || ''}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#1a1f37',
                            border: '1px solid #374151',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          placeholder="Real Estate, Property Tips, Investment"
                        />
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                          Add tags to categorize your page
                        </p>
                      </div>
                    </div>
                  </details>
                </div>

                {/* Right Column - Publish Section */}
                <div style={{ 
                  background: '#0c111d',
                  borderLeft: '1px solid #374151',
                  padding: '30px 24px'
                }}>
                  <h3 style={{ 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    marginBottom: '20px', 
                    color: '#e5e7eb' 
                  }}>
                    Publish
                  </h3>
                  
                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px', 
                    marginBottom: '24px' 
                  }}>
                    <button 
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                    >
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>save</span>
                      Save
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        document.getElementById('pageForm').requestSubmit();
                        setTimeout(() => {
                          setShowPageForm(false);
                          setSelectedPage(null);
                        }, 1000);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#e5e7eb',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#374151'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>exit_to_app</span>
                      Save & Exit
                    </button>
                  </div>

                  {/* Status Selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      color: '#9ca3af', 
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }}>
                      Status <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedPage?.status || 'Published'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '13px',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Template Selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      color: '#9ca3af', 
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }}>
                      Template <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="template"
                      defaultValue={selectedPage?.template || 'Default'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '13px',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Default">Default</option>
                      <option value="Homepage">Homepage</option>
                      <option value="Blog Page">Blog Page</option>
                      <option value="Properties List">Properties List</option>
                      <option value="Projects List">Projects List</option>
                      <option value="Contact Page">Contact Page</option>
                      <option value="About Page">About Page</option>
                    </select>
                  </div>

                  {/* Image Upload Section */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      color: '#9ca3af', 
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }}>
                      Image
                    </label>
                    <div style={{
                      width: '100%',
                      height: '160px',
                      border: '2px dashed #374151',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      background: '#1a1f37'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
                    >
                      <span className="material-symbols-outlined" style={{
                        fontSize: '48px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        add_photo_alternate
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#9ca3af',
                        textAlign: 'center'
                      }}>
                        Click to upload image
                      </span>
                    </div>
                  </div>

                  {/* Homepage Checkbox */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      cursor: 'pointer',
                      padding: '12px',
                      background: '#1a1f37',
                      borderRadius: '4px',
                      border: '1px solid #374151'
                    }}>
                      <input
                        type="checkbox"
                        name="isHomePage"
                        defaultChecked={selectedPage?.isHomePage || false}
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          cursor: 'pointer',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <span style={{ fontSize: '13px', color: '#e5e7eb', fontWeight: '500' }}>
                        Set as Homepage
                      </span>
                    </label>
                  </div>

                  {/* Timestamps */}
                  {selectedPage && (
                    <div style={{ 
                      paddingTop: '20px', 
                      borderTop: '1px solid #374151',
                      fontSize: '12px'
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ color: '#6b7280', marginBottom: '4px' }}>Created</div>
                        <div style={{ color: '#9ca3af' }}>{formatDate(selectedPage.createdAt)}</div>
                      </div>
                      <div>
                        <div style={{ color: '#6b7280', marginBottom: '4px' }}>Last Modified</div>
                        <div style={{ color: '#9ca3af' }}>{formatDate(selectedPage.updatedAt)}</div>
                      </div>
                    </div>
                  )}

                  {/* Back Button */}
                  <div style={{ marginTop: '24px' }}>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowPageForm(false);
                        setSelectedPage(null);
                        setPageSlug('');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#9ca3af',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#374151';
                        e.target.style.color = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#9ca3af';
                      }}
                    >
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>arrow_back</span>
                      Back to Pages
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && !showBlogForm && (
          <div className="admin-section">
            {/* Header with breadcrumb */}
            <div style={{ 
              padding: '20px 30px', 
              borderBottom: '1px solid #374151',
              background: '#0c111d'
            }}>
              <span style={{ fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                DASHBOARD / BLOG / POSTS
              </span>
            </div>

            {/* Action Bar */}
            <div style={{
              padding: '20px 30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              borderBottom: '1px solid #374151'
            }}>
              <div style={{ display: 'flex', gap: '15px', flex: '1' }}>
                <button 
                  style={{
                    padding: '8px 16px',
                    background: '#374151',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Bulk Actions
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
                </button>
                <button 
                  style={{
                    padding: '8px 16px',
                    background: '#374151',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Filters
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  value={blogSearchTerm}
                  onChange={(e) => setBlogSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 16px',
                    background: '#1a1f37',
                    border: '1px solid #374151',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    minWidth: '250px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedBlog(null);
                    setBlogSlug('');
                    setShowBlogForm(true);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                  Create
                </button>
                <button
                  onClick={fetchDashboardData}
                  style={{
                    padding: '10px 20px',
                    background: '#374151',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
                  Reload
                </button>
              </div>
            </div>

            {/* Blog Posts Table */}
            {blogPosts.length === 0 ? (
              <div className="no-data" style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', opacity: 0.5 }}>article</span>
                <p style={{ marginTop: '16px', fontSize: '16px' }}>No blog posts yet</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Click "Create" to publish your first blog post</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', padding: '0 30px 30px' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px'
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid #374151',
                      background: '#0c111d'
                    }}>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        width: '60px'
                      }}>
                        <input type="checkbox" />
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        width: '80px'
                      }}>ID</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        width: '100px'
                      }}>IMAGE</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>NAME</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>CATEGORIES</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>AUTHOR</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>CREATED AT</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>STATUS</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts
                      .filter(blog =>
                        blog.name.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                        blog.description?.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                        blog.author?.name?.toLowerCase().includes(blogSearchTerm.toLowerCase())
                      )
                      .map((blog) => (
                      <tr 
                        key={blog._id}
                        style={{
                          borderBottom: '1px solid #1f2937',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0c111d'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 12px' }}>
                          <input type="checkbox" />
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          fontSize: '13px',
                          color: '#9ca3af'
                        }}>
                          {blog._id.slice(-3)}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          {blog.featuredImage ? (
                            <img 
                              src={blog.featuredImage} 
                              alt={blog.name}
                              style={{
                                width: '80px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid #374151'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '80px',
                              height: '50px',
                              background: '#1f2937',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid #374151'
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#4b5563' }}>
                                image
                              </span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <a
                            href={`/news/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#3b82f6',
                              fontSize: '14px',
                              fontWeight: '500',
                              textDecoration: 'none',
                              display: 'block',
                              marginBottom: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                          >
                            {blog.name}
                          </a>
                          {blog.description && (
                            <p style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '300px'
                            }}>
                              {blog.description}
                            </p>
                          )}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          fontSize: '13px',
                          color: '#e5e7eb'
                        }}>
                          {blog.metaKeywords ? (
                            blog.metaKeywords.split(',').slice(0, 2).map((keyword, idx) => (
                              <span 
                                key={idx}
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 8px',
                                  background: '#1e40af',
                                  color: '#93c5fd',
                                  borderRadius: '3px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  marginRight: '4px',
                                  marginBottom: '4px'
                                }}
                              >
                                {keyword.trim()}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#6b7280', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          fontSize: '13px',
                          color: '#e5e7eb'
                        }}>
                          {blog.author?.name || blog.author?.email || 'Unknown'}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          fontSize: '13px',
                          color: '#9ca3af'
                        }}>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <select
                            value={blog.status}
                            onChange={(e) => handleUpdateBlogStatus(blog._id, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              background: blog.status === 'Published' ? '#10b981' : blog.status === 'Draft' ? '#6b7280' : '#f59e0b',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center'
                          }}>
                            <button
                              style={{ 
                                padding: '6px 12px',
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => {
                                setSelectedBlog(blog);
                                setBlogSlug(blog.slug);
                                setShowBlogForm(true);
                              }}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span>
                            </button>
                            <button
                              style={{ 
                                padding: '6px 12px',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => handleDeleteBlog(blog._id)}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '20px',
                  fontSize: '13px',
                  color: '#9ca3af'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>info</span>
                  Show from 1 to {blogPosts.filter(blog =>
                    blog.name.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                    blog.description?.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                    blog.author?.name?.toLowerCase().includes(blogSearchTerm.toLowerCase())
                  ).length} in <span style={{
                    padding: '2px 8px',
                    background: '#374151',
                    borderRadius: '3px',
                    fontWeight: '600',
                    marginLeft: '4px'
                  }}>{blogPosts.length}</span> records
                </div>
              </div>
            )}
          </div>
        )}

        {/* Blog Form */}
        {activeTab === 'blog' && showBlogForm && (
          <div className="admin-section" style={{ padding: '0' }}>
            {/* Header with Breadcrumb */}
            <div style={{ 
              padding: '20px 30px', 
              borderBottom: '1px solid #374151',
              background: '#0c111d'
            }}>
              <span style={{ fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                DASHBOARD / BLOG / {selectedBlog ? 'EDIT POST' : 'CREATE NEW POST'}
              </span>
            </div>

            <form 
              id="blogForm"
              style={{ position: 'relative' }}
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const blogData = {
                  name: formData.get('name'),
                  slug: formData.get('permalink'),
                  description: formData.get('description'),
                  status: formData.get('status'),
                  content: formData.get('content'),
                  metaTitle: formData.get('metaTitle'),
                  metaDescription: formData.get('metaDescription'),
                  metaKeywords: formData.get('metaKeywords'),
                  tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                  featuredImage: formData.get('featuredImage')
                };
                
                if (selectedBlog) {
                  await handleUpdateBlog(selectedBlog._id, blogData);
                } else {
                  await handleCreateBlog(blogData);
                }
              }}
            >
              {/* Two Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: 'calc(100vh - 200px)' }}>
                {/* Left Column - Main Content */}
                <div style={{ padding: '30px', background: '#0f1419' }}>
                  {/* Title Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={selectedBlog?.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/[\s_-]+/g, '-')
                          .replace(/^-+|-+$/g, '');
                        setBlogSlug(slug);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="Enter blog post title"
                    />
                  </div>

                  {/* Permalink Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Permalink <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="permalink"
                      required
                      value={blogSlug || selectedBlog?.slug || ''}
                      onChange={(e) => setBlogSlug(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="post-slug"
                    />
                    {blogSlug && (
                      <div style={{ 
                        marginTop: '6px', 
                        fontSize: '12px', 
                        color: '#6b7280' 
                      }}>
                        <span style={{ color: '#9ca3af' }}>Preview: </span>
                        <span style={{ color: '#3b82f6' }}>
                          /news/{blogSlug}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={selectedBlog?.description || ''}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="Brief description of your blog post"
                    />
                  </div>

                  {/* Content Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Content
                    </label>
                    <textarea
                      name="content"
                      defaultValue={selectedBlog?.content || ''}
                      rows={15}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'monospace',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="Write your blog post content here. You can use HTML."
                    />
                  </div>

                  {/* Featured Image */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Featured Image URL
                    </label>
                    <input
                      type="text"
                      name="featuredImage"
                      defaultValue={selectedBlog?.featuredImage || ''}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* SEO Section */}
                  <div style={{
                    background: '#1a1f37',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #374151'
                  }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#e5e7eb',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                      SEO Settings
                    </h3>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '13px', 
                        color: '#e5e7eb', 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="metaTitle"
                        defaultValue={selectedBlog?.metaTitle || ''}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0f1419',
                          border: '1px solid #374151',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        placeholder="SEO title for search engines"
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '13px', 
                        color: '#e5e7eb', 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        Meta Description
                      </label>
                      <textarea
                        name="metaDescription"
                        defaultValue={selectedBlog?.metaDescription || ''}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0f1419',
                          border: '1px solid #374151',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        placeholder="SEO description for search engines"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '13px', 
                        color: '#e5e7eb', 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        name="metaKeywords"
                        defaultValue={selectedBlog?.metaKeywords || ''}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0f1419',
                          border: '1px solid #374151',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div style={{
                    background: '#1a1f37',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    marginTop: '20px'
                  }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#e5e7eb',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>label</span>
                      Tags
                    </h3>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '13px', 
                        color: '#e5e7eb', 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        defaultValue={selectedBlog?.tags?.join(', ') || ''}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0f1419',
                          border: '1px solid #374151',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        placeholder="Real Estate, Property Tips, Investment"
                      />
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                        Add tags to categorize your blog post (e.g., Real Estate, Market News, Tips)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div style={{ 
                  padding: '30px 20px', 
                  background: '#0c111d',
                  borderLeft: '1px solid #374151'
                }}>
                  {/* Status */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#e5e7eb', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedBlog?.status || 'Draft'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1a1f37',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    marginTop: '30px',
                    paddingTop: '30px',
                    borderTop: '1px solid #374151'
                  }}>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
                      {selectedBlog ? 'Update Post' : 'Create Post'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBlogForm(false);
                        setSelectedBlog(null);
                        setBlogSlug('');
                      }}
                      style={{
                        padding: '12px 20px',
                        background: '#374151',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Create Project Tab */}
        {activeTab === 'create-project' && (
          <div className="admin-section" style={{ padding: 0 }}>
            <CreateProject embedded onBack={() => setActiveTab('projects')} />
          </div>
        )}

        {/* Post Property Tab */}
        {activeTab === 'post-property' && (
          <div className="admin-section" style={{ padding: 0 }}>
            <PostProperty embedded onBack={() => setActiveTab('real-estate')} />
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
