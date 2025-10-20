// resources/js/components/Pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalDepartments: 0
  });

  const [recentDepartments, setRecentDepartments] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentFaculty, setRecentFaculty] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Listen for in-app events when other pages add entities
    const handler = (e) => {
      if (!e || !e.detail) return;
      const { type, item } = e.detail;
      handleEntityAdded(type, item);
    };

    window.addEventListener('mencas:entityAdded', handler);
    return () => window.removeEventListener('mencas:entityAdded', handler);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Primary dashboard endpoint (if available)
      try {
        const res = await axios.get('/api/dashboard');
        const payload = res?.data?.data || {};
        if (payload.statistics) setStats(payload.statistics);
        if (payload.recentDepartments) setRecentDepartments(payload.recentDepartments);
        if (payload.recentCourses) setRecentCourses(payload.recentCourses);
        if (payload.recentStudents) setRecentStudents(payload.recentStudents);
        if (payload.recentFaculty) setRecentFaculty(payload.recentFaculty);
      } catch (err) {
        // ignore — we'll try individual recent endpoints below
        console.debug('No consolidated /api/dashboard or it returned non-conventional payload. Trying individual recent endpoints.');
      }

      // Fallback: try fetching individual recent lists (some APIs support ?recent=1)
      await Promise.all([
        (async () => {
          try {
            const r = await axios.get('/api/departments', { params: { recent: 1, per_page: 5 } });
            setRecentDepartments(r.data.data || r.data || []);
          } catch (e) {/* silent */}
        })(),
        (async () => {
          try {
            const r = await axios.get('/api/courses', { params: { recent: 1, per_page: 5 } });
            setRecentCourses(r.data.data || r.data || []);
          } catch (e) {/* silent */}
        })(),
        (async () => {
          try {
            const r = await axios.get('/api/students', { params: { recent: 1, per_page: 5 } });
            setRecentStudents(r.data.data || r.data || []);
          } catch (e) {/* silent */}
        })(),
        (async () => {
          try {
            const r = await axios.get('/api/faculty', { params: { recent: 1, per_page: 5 } });
            setRecentFaculty(r.data.data || r.data || []);
          } catch (e) {/* silent */}
        })(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEntityAdded = (type, item) => {
    if (!type || !item) return;

    // Create a user-friendly title
    const title = (item.name || item.full_name || item.title || item.email || 'New item');
    const notif = {
      id: Date.now(),
      type,
      title,
      item,
      time: new Date().toISOString()
    };

    setNotifications((p) => [notif, ...p].slice(0, 20));

    // Update the recent lists accordingly (keep up to 5)
    switch (type) {
      case 'department':
        setRecentDepartments((p) => [item, ...p].slice(0, 5));
        break;
      case 'course':
        setRecentCourses((p) => [item, ...p].slice(0, 5));
        break;
      case 'student':
        setRecentStudents((p) => [item, ...p].slice(0, 5));
        break;
      case 'faculty':
        setRecentFaculty((p) => [item, ...p].slice(0, 5));
        break;
      default:
        break;
    }

    // show a toast notification for immediate feedback
    toast.info(`${type.charAt(0).toUpperCase() + type.slice(1)} added: ${title}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 fw-bold text-dark">Dashboard Overview</h1>
          <p className="text-muted">Welcome to Student & Faculty Management System</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #5D7FBD 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h1 fw-bold mb-0">{stats.totalStudents}</h2>
                  <p className="mb-0 opacity-75">Total Students</p>
                </div>
                <div className="opacity-75">
                  <i className="fas fa-user-graduate fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #5D7FBD 0%, #5D7FBD 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h1 fw-bold mb-0">{stats.totalFaculty}</h2>
                  <p className="mb-0 opacity-75">Total Faculty</p>
                </div>
                <div className="opacity-75">
                  <i className="fas fa-chalkboard-teacher fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #5D7FBD 0%, #5D7FBD 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h1 fw-bold mb-0">{stats.totalCourses}</h2>
                  <p className="mb-0 opacity-75">Total Courses</p>
                </div>
                <div className="opacity-75">
                  <i className="fas fa-book fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #5D7FBD 0%, #5D7FBD 100%)' }}>
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h1 fw-bold mb-0">{stats.totalDepartments}</h2>
                  <p className="mb-0 opacity-75">Departments</p>
                </div>
                <div className="opacity-75">
                  <i className="fas fa-building fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities and Notifications */}
      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">Recent Departments</h5>
            </div>
            <div className="card-body">
              {recentDepartments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="border-0 fw-semibold">Department</th>
                        <th className="border-0 fw-semibold">Code</th>
                        <th className="border-0 fw-semibold">Students</th>
                        <th className="border-0 fw-semibold">Faculty</th>
                        <th className="border-0 fw-semibold">Courses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDepartments.map((department, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                style={{ width: '32px', height: '32px', borderRadius: '50%', fontSize: '12px' }}
                              >
                                {department.name?.charAt(0) || 'D'}
                              </div>
                              <span className="fw-semibold">{department.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{department.code}</span>
                          </td>
                          <td>
                            <span className="badge bg-info">{department.students_count || 0}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">{department.faculty_count || 0}</span>
                          </td>
                          <td>
                            <span className="badge bg-primary">{department.courses_count || 0}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-building fa-3x mb-3 opacity-25"></i>
                  <p>No recent departments found</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">Recent Courses</h5>
            </div>
            <div className="card-body">
              {recentCourses.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {recentCourses.map((c) => (
                    <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold">{c.name}</div>
                        <small className="text-muted">{c.department?.name || 'No department'}</small>
                      </div>
                      <span className={`badge ${c.is_active ? 'bg-success' : 'bg-secondary'}`}>{c.is_active ? 'Active' : 'Inactive'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-book fa-3x mb-3 opacity-25"></i>
                  <p>No recent courses</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Students */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">Recent Students</h5>
            </div>
            <div className="card-body">
              {recentStudents.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {recentStudents.map((s) => (
                    <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold">{s.full_name || `${s.first_name} ${s.last_name}`}</div>
                        <small className="text-muted">{s.student_id || s.email || ''}</small>
                      </div>
                      <span className="badge bg-info">{s.year || ''}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-user-graduate fa-3x mb-3 opacity-25"></i>
                  <p>No recent students</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">Recent Notifications</h5>
            </div>
            <div className="card-body">
              {notifications.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {notifications.map((n) => (
                    <li key={n.id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="fw-semibold">{n.title}</div>
                          <small className="text-muted">{n.type}</small>
                        </div>
                        <small className="text-muted">{new Date(n.time).toLocaleString()}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-bell fa-3x mb-3 opacity-25"></i>
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/students" className="btn btn-outline-primary">
                  <i className="fas fa-user-plus me-2"></i>
                  Add Student
                </a>
                <a href="/faculty" className="btn btn-outline-success">
                  <i className="fas fa-user-tie me-2"></i>
                  Add Faculty
                </a>
                <a href="/courses" className="btn btn-outline-info">
                  <i className="fas fa-book me-2"></i>
                  Add Course
                </a>
                <a href="/reports" className="btn btn-outline-secondary">
                  <i className="fas fa-chart-bar me-2"></i>
                  View Reports
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}