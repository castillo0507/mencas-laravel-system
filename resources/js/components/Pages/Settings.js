import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AcademicYears from './AcademicYears';
import ArchiveFiles from './ArchiveFiles';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('app_theme') || 'light'
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('General');

  useEffect(() => {
    // Optionally fetch server-stored settings if endpoint exists
    const fetchServerSettings = async () => {
      try {
        const res = await axios.get('/api/user/settings');
        if (res?.data) {
          const s = res.data.data || res.data;
          if (s.theme) setSettings(prev => ({ ...prev, theme: s.theme }));
        }
      } catch (err) {
        // ignore if endpoint not present
      }
    };

    fetchServerSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    setMessage('');
    try {
  localStorage.setItem('app_theme', settings.theme);

      // optimistic apply
      document.documentElement.setAttribute('data-theme', settings.theme);

      // try to persist server-side
      try {
        await axios.post('/api/user/settings', settings);
      } catch (postErr) {
        try { await axios.put('/api/user/settings', settings); } catch (putErr) { /* ignore */ }
      }

      setMessage('Settings saved');
    } catch (err) {
      console.error('Save settings error', err);
      setMessage('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="h3 mb-4 text-gray-800">Settings</h1>
        </div>

        <div className="col-12">
          <ul className="nav nav-tabs mb-3">
            {['General','Academic Years','Archived Files','System Preferences','User Roles'].map(tab => (
              <li className="nav-item" key={tab}>
                <button className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              </li>
            ))}
          </ul>

          {activeTab === 'Archived Files' ? (
            <ArchiveFiles />
          ) : (
            <div className="card mb-4">
              <div className="card-body">
              {activeTab === 'General' && (
                <div>
                  <h5 className="mb-3">General Settings</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Theme</label>
                      <select className="form-select" value={settings.theme} onChange={e => setSettings(s => ({ ...s, theme: e.target.value }))}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    {/* Notifications removed */}
                  </div>

                  <div className="mt-4">
                    <button className="btn btn-primary me-2" onClick={saveSettings} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                    {message && <span className="text-success ms-2">{message}</span>}
                  </div>
                </div>
              )}

              {activeTab === 'Academic Years' && (
                <div>
                  <AcademicYears />
                </div>
              )}

              {activeTab === 'System Preferences' && (
                <div>
                  <h5 className="mb-3">System Preferences</h5>
                  <p className="text-muted">Placeholder for system-wide preferences (timezones, locales, integrations).</p>
                  <div className="mb-3">
                    <label className="form-label">Default Timezone</label>
                    <select className="form-select">
                      <option>UTC</option>
                      <option>Asia/Manila</option>
                      <option>America/New_York</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'User Roles' && (
                <div>
                  <h5 className="mb-3">User Roles</h5>
                  <p className="text-muted">Role and permission management will appear here.</p>
                  <div>
                    <button className="btn btn-outline-primary me-2" onClick={() => alert('Open role manager')}>Manage Roles</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default Settings;
