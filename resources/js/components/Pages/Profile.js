// resources/js/components/Pages/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../router-new';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showActivity, setShowActivity] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ theme: localStorage.getItem('app_theme') || 'light', notifications: localStorage.getItem('app_notifications') === 'true' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      // Include password fields only if user entered them
      if (formData.current_password) {
        payload.current_password = formData.current_password;
      }
      if (formData.new_password) {
        payload.new_password = formData.new_password;
        payload.new_password_confirmation = formData.confirm_password;
      }

      const res = await axios.put('/api/profile', payload);
      setSuccess(res.data.message || 'Profile updated successfully!');

      // Reset password fields
      setFormData({
        ...formData,
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: ['Failed to update profile'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const navigate = useNavigate();

  const closeActivityModal = () => {
    setShowActivity(false);
    setActivityLogs([]);
  };

  const clearActivity = async () => {
    if (!window.confirm('Clear activity logs? This cannot be undone locally.')) return;
    try {
      // Try server-side clear if endpoint exists
      try {
        await axios.delete('/api/activity');
      } catch (e) {
        try { await axios.delete('/api/activity-log'); } catch (e2) { /* ignore */ }
      }
    } catch (err) {
      // ignore server errors
    }
    setActivityLogs([]);
  };

  const exportActivity = () => {
    const data = JSON.stringify(activityLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-${(new Date()).toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveSettings = async () => {
    // persist locally
    localStorage.setItem('app_theme', settings.theme);
    localStorage.setItem('app_notifications', settings.notifications ? 'true' : 'false');

    // optionally persist to server if endpoint exists
    try {
      await axios.post('/api/user/settings', settings);
    } catch (err) {
      try { await axios.put('/api/user/settings', settings); } catch (e) { /* ignore */ }
    }

    setShowSettings(false);
    // Apply theme immediately (simple implementation)
    document.documentElement.setAttribute('data-theme', settings.theme);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="h3 mb-4 text-gray-800">My Profile</h1>

          <div className="row">
            {/* Profile Information */}
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Profile Information</h6>
                </div>
                <div className="card-body">
                  {success && (
                    <div className="alert alert-success alert-dismissible fade show">
                      <i className="fas fa-check-circle me-2"></i>
                      {success}
                    </div>
                  )}

                  {errors.general && (
                    <div className="alert alert-danger">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.general[0]}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                          {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                        </div>
                      </div>
                    </div>

                    <hr />

                    <h6 className="text-primary mb-3">Change Password</h6>
                    
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                            value={formData.current_password}
                            onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                            placeholder="Leave blank to keep current password"
                          />
                          {errors.current_password && <div className="invalid-feedback">{errors.current_password[0]}</div>}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                            value={formData.new_password}
                            onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                            placeholder="Enter new password"
                          />
                          {errors.new_password && <div className="invalid-feedback">{errors.new_password[0]}</div>}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Confirm New Password</label>
                          <input
                            type="password"
                            className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                            placeholder="Confirm new password"
                          />
                          {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password[0]}</div>}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Update Profile
                          </>
                        )}
                      </button>
                      
                      <button 
                        type="button" 
                        className="btn btn-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="col-lg-4">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Account Summary</h6>
                </div>
                <div className="card-body text-center">
                  <div className="mb-3">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      <i className="fas fa-user fa-2x text-white"></i>
                    </div>
                  </div>
                  
                  <h5 className="font-weight-bold">{user?.name || 'Admin User'}</h5>
                  <p className="text-muted mb-3">{user?.email || 'admin@mencas.edu'}</p>
                  
                  <hr />
                  
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h6 className="text-primary">Role</h6>
                        <p className="mb-0 text-capitalize">{user?.role || 'Administrator'}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <h6 className="text-primary">Status</h6>
                      <span className="badge bg-success">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card shadow mt-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    {/* Download Data removed as requested */}
                    <button className="btn btn-outline-info" onClick={async () => {
                      setShowActivity(true);
                      setActivityLoading(true);
                      try {
                        // Try several possible endpoints for activity; fallback gracefully
                        let res;
                        try { res = await axios.get('/api/activity'); } catch (e1) {
                          try { res = await axios.get('/api/activity-log'); } catch (e2) {
                            try { res = await axios.get('/api/user/activity'); } catch (e3) { res = null; }
                          }
                        }
                        if (res && res.data) {
                          // Support both {data: [...]} and raw array
                          setActivityLogs(res.data.data || res.data || []);
                        } else {
                          setActivityLogs([]);
                        }
                      } catch (err) {
                        console.error('Error loading activity:', err);
                        setActivityLogs([]);
                      } finally {
                        setActivityLoading(false);
                      }
                    }}>
                      <i className="fas fa-history me-2"></i>
                      Activity Log
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/settings')}>
                      <i className="fas fa-cog me-2"></i>
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log Modal */}
          {showActivity && (
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Activity Log</h5>
                    <button type="button" className="btn-close" onClick={closeActivityModal}></button>
                  </div>
                  <div className="modal-body">
                    {activityLoading ? (
                      <div className="text-center py-4"><div className="spinner-border" role="status"></div></div>
                    ) : (
                      <div>
                        {activityLogs.length === 0 ? (
                          <div className="text-center text-muted py-4">No activity found.</div>
                        ) : (
                          <ul className="list-group">
                            {activityLogs.map((a, idx) => (
                              <li key={idx} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <div className="small text-muted">{a.created_at || a.timestamp || a.time || ''}</div>
                                    <div>{a.message || a.action || JSON.stringify(a)}</div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeActivityModal}>Close</button>
                    <button className="btn btn-outline-primary" onClick={exportActivity} disabled={activityLogs.length===0}>Export</button>
                    <button className="btn btn-danger" onClick={clearActivity} disabled={activityLogs.length===0}>Clear</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Settings</h5>
                    <button type="button" className="btn-close" onClick={() => setShowSettings(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Theme</label>
                      <select className="form-select" value={settings.theme} onChange={(e) => setSettings(s => ({ ...s, theme: e.target.value }))}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input className="form-check-input" type="checkbox" id="notifToggle" checked={settings.notifications} onChange={(e) => setSettings(s => ({ ...s, notifications: e.target.checked }))} />
                      <label className="form-check-label" htmlFor="notifToggle">Enable notifications</label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={saveSettings}>Save Settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
