// resources/js/components/Pages/Reports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching reports data...');
      const response = await axios.get('/api/dashboard');
      console.log('Reports API response:', response.data);
      
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      } else {
        console.error('API returned unsuccessful response:', response.data);
        setDashboardData(null);
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (type) => {
    // Mock export function
    console.log(`Exporting ${type} data...`);
    alert(`${type} data export would start here`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0 text-gray-800">Reports & Analytics</h1>
            <div className="btn-group">
              <button 
                className="btn btn-outline-primary"
                onClick={() => exportData('PDF')}
              >
                <i className="fas fa-file-pdf me-2"></i>
                Export PDF
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => exportData('Excel')}
              >
                <i className="fas fa-file-excel me-2"></i>
                Export Excel
              </button>
            </div>
          </div>

          {/* Report Type Selection */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="btn-group w-100" role="group">
                <button 
                  className={`btn ${selectedReport === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedReport('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`btn ${selectedReport === 'students' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedReport('students')}
                >
                  Student Report
                </button>
                <button 
                  className={`btn ${selectedReport === 'faculty' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedReport('faculty')}
                >
                  Faculty Report
                </button>
                <button 
                  className={`btn ${selectedReport === 'courses' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedReport('courses')}
                >
                  Course Report
                </button>
                <button 
                  className={`btn ${selectedReport === 'departments' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedReport('departments')}
                >
                  Department Report
                </button>
              </div>
            </div>
          </div>

          {/* Overview Report */}
          {selectedReport === 'overview' && dashboardData && (
            <div className="row">
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Total Students
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {dashboardData.statistics?.totalStudents || 0}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-users fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Active Faculty
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {dashboardData.statistics?.totalFaculty || 0}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-chalkboard-teacher fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Active Courses
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {dashboardData.statistics?.totalCourses || 0}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-book fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Departments
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {dashboardData.statistics?.totalDepartments || 0}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-building fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Statistics */}
              <div className="col-lg-6 mb-4">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Department Statistics</h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Department</th>
                            <th>Students</th>
                            <th>Faculty</th>
                            <th>Courses</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.departmentStats?.map((dept) => (
                            <tr key={dept.id}>
                              <td>{dept.name}</td>
                              <td>{dept.students_count || 0}</td>
                              <td>{dept.faculty_count || 0}</td>
                              <td>{dept.courses_count || 0}</td>
                            </tr>
                          )) || <tr><td colSpan="4">No department data available</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Status Distribution */}
              <div className="col-lg-6 mb-4">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Student Status Distribution</h6>
                  </div>
                  <div className="card-body">
                    {dashboardData.studentStatusDistribution?.map((status) => (
                      <div key={status.status} className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="text-capitalize">{status.status}</span>
                          <span>{status.count}</span>
                        </div>
                        <div className="progress">
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${(status.count / (dashboardData.statistics?.totalStudents || 1) * 100) || 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    )) || <p className="text-muted">No student status data available</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Report */}
          {selectedReport === 'students' && (
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Student Enrollment Report</h6>
              </div>
              <div className="card-body">
                <p>Detailed student enrollment and performance analytics would be displayed here.</p>
                <div className="row">
                  <div className="col-md-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h5>Total Enrolled</h5>
                        <h2>{dashboardData?.statistics?.activeStudents || 0}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-success text-white">
                      <div className="card-body">
                        <h5>Graduated</h5>
                        <h2>{dashboardData?.studentStatusDistribution?.find(s => s.status === 'graduated')?.count || 0}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-warning text-white">
                      <div className="card-body">
                        <h5>Inactive</h5>
                        <h2>{dashboardData?.studentStatusDistribution?.find(s => s.status === 'inactive')?.count || 0}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Faculty Report */}
          {selectedReport === 'faculty' && (
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Faculty Performance Report</h6>
              </div>
              <div className="card-body">
                <p>Faculty workload and performance metrics would be displayed here.</p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-info text-white">
                      <div className="card-body">
                        <h5>Active Faculty</h5>
                        <h2>{dashboardData?.statistics?.activeFaculty || 0}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-secondary text-white">
                      <div className="card-body">
                        <h5>Total Faculty</h5>
                        <h2>{dashboardData?.statistics?.totalFaculty || 0}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Report */}
          {selectedReport === 'courses' && (
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Course Analytics Report</h6>
              </div>
              <div className="card-body">
                <p>Course statistics and enrollment data would be displayed here.</p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-success text-white">
                      <div className="card-body">
                        <h5>Active Courses</h5>
                        <h2>{dashboardData?.statistics?.activeCourses || 0}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h5>Total Courses</h5>
                        <h2>{dashboardData?.statistics?.totalCourses || 0}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Department Report */}
          {selectedReport === 'departments' && (
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Department Management Report</h6>
              </div>
              <div className="card-body">
                <p>Comprehensive department statistics and performance metrics.</p>
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h5>Total Departments</h5>
                        <h2>{dashboardData?.statistics?.totalDepartments || 0}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-success text-white">
                      <div className="card-body">
                        <h5>Active Departments</h5>
                        <h2>{dashboardData?.statistics?.activeDepartments || 0}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-info text-white">
                      <div className="card-body">
                        <h5>Recent Additions</h5>
                        <h2>{dashboardData?.recentDepartments?.length || 0}</h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Details Table */}
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Department Name</th>
                        <th>Code</th>
                        <th>Students</th>
                        <th>Faculty</th>
                        <th>Courses</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.departmentStats?.map((dept) => (
                        <tr key={dept.id}>
                          <td className="fw-medium">{dept.name}</td>
                          <td>
                            <span className="badge bg-light text-dark">{dept.code}</span>
                          </td>
                          <td>
                            <span className="badge bg-info">{dept.students_count || 0}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">{dept.faculty_count || 0}</span>
                          </td>
                          <td>
                            <span className="badge bg-primary">{dept.courses_count || 0}</span>
                          </td>
                          <td>
                            <span className={`badge ${dept.is_active ? 'bg-success' : 'bg-secondary'}`}>
                              {dept.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">
                            No department data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;