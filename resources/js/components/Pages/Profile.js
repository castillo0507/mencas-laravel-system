// resources/js/components/Pages/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../router-new';

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
                    <button className="btn btn-outline-primary">
                      <i className="fas fa-download me-2"></i>
                      Download Data
                    </button>
                    <button className="btn btn-outline-info">
                      <i className="fas fa-history me-2"></i>
                      Activity Log
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="fas fa-cog me-2"></i>
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;