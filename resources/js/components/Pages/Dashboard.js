// resources/js/pages/Dashboard.js
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalDepartments: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const response = await axios.get('/api/dashboard');
      console.log('Dashboard API response:', response.data);
      
      if (response.data && response.data.success) {
        const { statistics, recentDepartments } = response.data.data;
        console.log('Setting stats:', statistics);
        setStats(statistics || {
          totalStudents: 0,
          totalFaculty: 0,
          totalCourses: 0,
          totalDepartments: 0
        });
        setRecentEnrollments(recentDepartments || []);
      } else {
        console.error('API returned unsuccessful response:', response.data);
        // Set default values if API call fails
        setStats({
          totalStudents: 0,
          totalFaculty: 0,
          totalCourses: 0,
          totalDepartments: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        // If unauthorized, might need to redirect to login
        if (error.response.status === 401) {
          console.error('Unauthorized access to dashboard');
        }
      }
      // Set default values on error
      setStats({
        totalStudents: 0,
        totalFaculty: 0,
        totalCourses: 0,
        totalDepartments: 0
      });
    } finally {
      setLoading(false);
    }
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

      {/* Recent Activities */}
      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">Recent Departments</h5>
            </div>
            <div className="card-body">
              {recentEnrollments.length > 0 ? (
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
                      {recentEnrollments.map((department, index) => (
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
        </div>

        <div className="col-md-4">
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