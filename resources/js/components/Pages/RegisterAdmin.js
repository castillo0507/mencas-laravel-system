import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterAdmin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/register-admin', {
        name,
        email,
        password,
        password_confirmation: passwordConfirm
      });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Register error', err);
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    axios.get('/api/admin-exists')
      .then(res => {
        if (!mounted) return;
        if (res.data && res.data.exists) {
          setAdminExists(true);
          setError('An admin account already exists.');
        }
      })
      .catch(err => {
        console.warn('admin-exists check failed', err?.message || err);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <div className="card">
        <div className="card-body">
          <h4>Create Admin Account</h4>
          <p className="text-muted">Create the initial administrator account for the system.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {!adminExists && <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" type="button" onClick={() => window.location.href = '/login'}>Back to Login</button>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Admin'}</button>
            </div>
          </form>}
          {adminExists && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-secondary" type="button" onClick={() => window.location.href = '/login'}>Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
