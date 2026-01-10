import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Fetch from tracking API
      const response = await fetch('/api/track-submission');
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        setError('Failed to load submissions');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Time filter
    const now = new Date();
    if (filter === 'today') {
      filtered = filtered.filter(sub => {
        const subDate = new Date(sub.timestamp);
        return subDate.toDateString() === now.toDateString();
      });
    } else if (filter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(sub => new Date(sub.timestamp) >= weekAgo);
    } else if (filter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(sub => new Date(sub.timestamp) >= monthAgo);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(sub =>
        (sub.name && sub.name.toLowerCase().includes(search)) ||
        (sub.firstname && sub.firstname.toLowerCase().includes(search)) ||
        (sub.lastname && sub.lastname.toLowerCase().includes(search)) ||
        (sub.email && sub.email.toLowerCase().includes(search)) ||
        (sub.phone && sub.phone.includes(search)) ||
        (sub.property && sub.property.toLowerCase().includes(search)) ||
        (sub.property_inquiry && sub.property_inquiry.toLowerCase().includes(search))
      );
    }

    return filtered;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const filtered = filterSubmissions();
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Property', 'Message', 'Timestamp'];
    const csv = [
      headers.join(','),
      ...filtered.map(sub => [
        sub.id,
        `"${sub.name}"`,
        sub.email,
        sub.phone,
        `"${sub.property}"`,
        `"${sub.message}"`,
        sub.timestamp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubmissions = filterSubmissions();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>CRM Dashboard</h1>
        <p>Manage and view all property inquiries</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{submissions.length}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {submissions.filter(s => {
              const date = new Date(s.timestamp);
              return date.toDateString() === new Date().toDateString();
            }).length}
          </div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {submissions.filter(s => {
              const date = new Date(s.timestamp);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return date >= weekAgo;
            }).length}
          </div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {submissions.filter(s => {
              const date = new Date(s.timestamp);
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return date >= monthAgo;
            }).length}
          </div>
          <div className="stat-label">This Month</div>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, phone, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'today' ? 'active' : ''}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button
            className={filter === 'week' ? 'active' : ''}
            onClick={() => setFilter('week')}
          >
            This Week
          </button>
          <button
            className={filter === 'month' ? 'active' : ''}
            onClick={() => setFilter('month')}
          >
            This Month
          </button>
        </div>

        <button className="export-btn" onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading submissions...</div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : (
        <div className="submissions-list">
          {filteredSubmissions.length === 0 ? (
            <div className="no-data">No submissions found</div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div className="submission-id">#{submission.id}</div>
                  <div className="submission-date">{formatDate(submission.timestamp)}</div>
                </div>
                <div className="submission-body">
                  <div className="submission-row">
                    <strong>Name:</strong> {submission.firstname} {submission.lastname || submission.name || ''}
                  </div>
                  <div className="submission-row">
                    <strong>Email:</strong> 
                    <a href={`mailto:${submission.email}`}>{submission.email}</a>
                  </div>
                  <div className="submission-row">
                    <strong>Phone:</strong> 
                    <a href={`tel:${submission.phone}`}>{submission.phone || 'Not provided'}</a>
                  </div>
                  <div className="submission-row">
                    <strong>Property:</strong> {submission.property || submission.property_inquiry || 'General Inquiry'}
                  </div>
                  {submission.message && (
                    <div className="submission-message">
                      <strong>Message:</strong>
                      <p>{submission.message}</p>
                    </div>
                  )}
                </div>
                <div className="submission-footer">
                  <span className="source-badge">{submission.source}</span>
                  <span className="status-badge">{submission.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
