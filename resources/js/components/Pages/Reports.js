// resources/js/components/Pages/Reports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [studentsPanelOpen, setStudentsPanelOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentFilters, setStudentFilters] = useState({ department: '', course: '', year_level: '' });
  const [studentsError, setStudentsError] = useState(null);

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

  const fetchStudents = async (params = {}) => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      // Map client filter keys to API expected keys
      const apiParams = {};
      if (params.department) apiParams.department_id = params.department;
      if (params.course) apiParams.course_id = params.course;
      if (params.year_level) apiParams.year_level = params.year_level;
      if (params.search) apiParams.search = params.search;

      // Try API first
      const response = await axios.get('/api/students', { params: apiParams });

      // API returns { data: [...], meta: {...} }
      if (response.data) {
        if (Array.isArray(response.data)) {
          setStudents(response.data || []);
        } else if (Array.isArray(response.data.data)) {
          const list = response.data.data || [];
          // If server returned no students but user requested a year_level, try client-side fallback
          if (list.length === 0 && params && params.year_level) {
            // Server returned no results for this year_level filter. Try fetching a larger unfiltered set
            // then apply client-side year parsing to show matches. This is a fallback when year_level isn't stored on the server.
            try {
              const allResp = await axios.get('/api/students', { params: { per_page: 1000 } });
              const allList = Array.isArray(allResp.data?.data) ? allResp.data.data : (Array.isArray(allResp.data) ? allResp.data : []);
              const fallback = allList.filter(ss => String(renderYearLevel(ss)) === String(params.year_level));
              setStudents(fallback);
            } catch (err) {
              // final fallback: empty
              setStudents([]);
            }
          } else {
            setStudents(list);
          }
        } else {
          setStudents([]);
        }
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.warn('Could not fetch /api/students, falling back to dashboardData.students if available', error);
      // fallback to dashboardData if present
      if (dashboardData && Array.isArray(dashboardData.students)) {
        // apply client-side filters
        let list = dashboardData.students.slice();
        if (params.department) list = list.filter(s => String(s.department_id) === String(params.department));
        if (params.course) list = list.filter(s => String(s.course_id) === String(params.course));
        if (params.year_level) list = list.filter(s => String(s.year_level) === String(params.year_level));
        setStudents(list);
      } else {
        setStudentsError('No student data available');
        setStudents([]);
      }
    } finally {
      setStudentsLoading(false);
    }
  };

  const exportData = (type) => {
    // Mock export function
    console.log(`Exporting ${type} data...`);
    alert(`${type} data export would start here`);
  };

  const openStudentsPanel = (preFilter = {}) => {
    const empty = { department: '', course: '', year_level: '' };
    const filters = { ...empty, ...preFilter };
    setStudentFilters(filters);
    setStudentsPanelOpen(true);
    setSelectedReport('students');
    fetchStudents(filters);
  };

  const applyStudentFilters = () => {
    fetchStudents(studentFilters);
  };

  const resetStudentFilters = () => {
    const empty = { department: '', course: '', year_level: '' };
    setStudentFilters(empty);
    fetchStudents(empty);
  };

  // Render a numeric year level (1-4). Prefer explicit year_level on the student record.
  // If missing, attempt to parse a single-digit year (1-4) from academicYear fields or dashboard mappings.
  const renderYearLevel = (s) => {
    // direct numeric year_level (allow string or number)
    if (s?.year_level || s?.year_level === 0) {
      const v = String(s.year_level).trim();
      if (/^[1-4]$/.test(v)) return v;
    }

    // Collect candidate strings to search for patterns
    const candidates = [
      s?.academicYear?.year,
      s?.academicYear?.name,
      s?.academic_year || s?.academicYear || s?.academic_year_id,
      dashboardData?.academic_years?.find(y => y.id === s.academic_year_id)?.year,
      dashboardData?.academic_years?.find(y => y.id === s.academic_year_id)?.name,
      s?.course?.name,
      s?.course_name,
      s?.year_level_label,
    ].filter(Boolean).map(c => String(c));

    const wordMap = {
      'first': '1', '1st': '1', 'one': '1',
      'second': '2', '2nd': '2', 'two': '2',
      'third': '3', '3rd': '3', 'three': '3',
      'fourth': '4', '4th': '4', 'four': '4'
    };

    for (const str of candidates) {
      // look for explicit patterns like 'Year 1', '1st Year', 'Level 2'
      const m1 = str.match(/(?:year|yr|level|lvl)\s*[#:]*\s*([1-4])\b/i);
      if (m1) return m1[1];

      // look for ordinal like '1st', '2nd'
      const m2 = str.match(/\b([1-4])(st|nd|rd|th)\b/i);
      if (m2) return m2[1];

      // look for standalone digit 1-4
      const m3 = str.match(/\b([1-4])\b/);
      if (m3) return m3[1];

      // look for word form e.g., 'First Year'
      for (const [word, num] of Object.entries(wordMap)) {
        if (new RegExp('\\b' + word + '\\b', 'i').test(str)) return num;
      }
    }

    // As a final fallback, try to inspect any numeric-looking property anywhere on the student object
    try {
      const flat = JSON.stringify(s);
      const mf = flat.match(/\b([1-4])\b/);
      if (mf) return mf[1];
    } catch (e) {
      // ignore
    }

    return '-';
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
                        <button
                          className="btn btn-link p-0 h5 mb-0 font-weight-bold text-gray-800 text-start"
                          onClick={() => openStudentsPanel({})}
                        >
                          {dashboardData.statistics?.totalStudents || 0}
                        </button>
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
              <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Student Enrollment Report</h6>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setStudentsPanelOpen(!studentsPanelOpen)}>
                    {studentsPanelOpen ? 'Hide Students' : 'Show Students'}
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => resetStudentFilters()}>
                    Reset Filters
                  </button>
                </div>
              </div>
              <div className="card-body">
                <p>Detailed student enrollment and performance analytics would be displayed here.</p>
                <div className="row">
                  <div className="col-md-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h5>Total Students</h5>
                        <button className="btn btn-light text-start w-100 p-2" onClick={() => openStudentsPanel({})}>
                          <h2 className="mb-0">{dashboardData?.statistics?.activeStudents || 0}</h2>
                        </button>
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

                {/* Students Panel */}
                {studentsPanelOpen && (
                  <div className="mt-4">
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Department</label>
                        <select className="form-select" value={studentFilters.department} onChange={e => setStudentFilters(s => ({ ...s, department: e.target.value }))}>
                          <option value="">All</option>
                          {(dashboardData?.departments || []).map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Course</label>
                        <select className="form-select" value={studentFilters.course} onChange={e => setStudentFilters(s => ({ ...s, course: e.target.value }))}>
                          <option value="">All</option>
                          {(dashboardData?.courses || []).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Year Level</label>
                        <select className="form-select" value={studentFilters.year_level} onChange={e => setStudentFilters(s => ({ ...s, year_level: e.target.value }))}>
                          <option value="">All</option>
                          {[1,2,3,4].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3 d-flex align-items-end">
                        <div className="w-100">
                          <button className="btn btn-primary me-2 w-100 mb-2" onClick={applyStudentFilters} disabled={studentsLoading}>Apply Filters</button>
                          <button className="btn btn-outline-secondary w-100" onClick={resetStudentFilters} disabled={studentsLoading}>Reset</button>
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      {studentsLoading ? (
                        <div className="text-center py-4">Loading students...</div>
                      ) : studentsError ? (
                        <div className="text-danger">{studentsError}</div>
                      ) : students.length === 0 ? (
                        <div className="text-muted">No students found for the selected filters.</div>
                      ) : (
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Department</th>
                              <th>Course</th>
                              <th>Year Level</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map(s => (
                              <tr key={s.id}>
                                <td>{s.name || `${s.first_name || ''} ${s.last_name || ''}`}</td>
                                <td>{s.department?.name || s.department_name || (dashboardData?.departments?.find(d => d.id === s.department_id)?.name) || '-'}</td>
                                <td>{s.course?.name || s.course_name || (dashboardData?.courses?.find(c => c.id === s.course_id)?.name) || '-'}</td>
                                <td>{renderYearLevel(s)}</td>
                                <td>{s.status || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}
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