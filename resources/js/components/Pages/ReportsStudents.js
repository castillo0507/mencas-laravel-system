import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportsStudents = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentFilters, setStudentFilters] = useState({ search: '', department: '', course: '', academic_year: '', status: '', year_level: '' });
  const [studentsError, setStudentsError] = useState(null);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // initial students load with default (empty) filters
    (async () => {
      try {
        await fetchStudents({});
      } catch (err) {
        console.error('Initial fetchStudents failed:', err);
        setPageError(err.message || String(err));
      }
    })();

    // listen for student changes elsewhere in the app
    const onStudentsChanged = () => {
      try {
        fetchDashboardData();
        fetchStudents(studentFilters);
      } catch (err) {
        console.error('Error handling students:changed event:', err);
        setPageError(err.message || String(err));
      }
    };
    const onWindowError = (msg, source, lineno, colno, error) => {
      console.error('Window error captured:', { msg, source, lineno, colno, error });
      setPageError(msg || (error && error.message) || 'Unknown error');
    };
    const onRejection = (ev) => {
      console.error('Unhandled rejection:', ev);
      setPageError(ev?.reason?.message || String(ev));
    };
    window.addEventListener('students:changed', onStudentsChanged);
    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('students:changed', onStudentsChanged);
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      const payload = response.data?.data || response.data || null;
      setDashboardData(payload);
    } catch (err) {
      console.error('Error fetching dashboard data for reports/students:', err);
      setDashboardData(null);
      setPageError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const renderYearLevel = (s) => {
    if (s?.year_level || s?.year_level === 0) {
      const v = String(s.year_level).trim();
      if (/^[1-4]$/.test(v)) return v;
    }
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
    const wordMap = { 'first': '1', '1st': '1', 'one': '1', 'second': '2', '2nd': '2', 'two': '2', 'third': '3', '3rd': '3', 'three': '3', 'fourth': '4', '4th': '4', 'four': '4' };
    for (const str of candidates) {
      const m1 = str.match(/(?:year|yr|level|lvl)\s*[#:]*\s*([1-4])\b/i);
      if (m1) return m1[1];
      const m2 = str.match(/\b([1-4])(st|nd|rd|th)\b/i);
      if (m2) return m2[1];
      const m3 = str.match(/\b([1-4])\b/);
      if (m3) return m3[1];
      for (const [word, num] of Object.entries(wordMap)) {
        if (new RegExp('\\b' + word + '\\b', 'i').test(str)) return num;
      }
    }
    try { const flat = JSON.stringify(s); const mf = flat.match(/\b([1-4])\b/); if (mf) return mf[1]; } catch (e) {}
    return '-';
  };

  const fetchStudents = async (params = {}) => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const apiParams = {};
      if (params.department) apiParams.department_id = params.department;
      if (params.course) apiParams.course_id = params.course;
      if (params.year_level) apiParams.year_level = params.year_level;
      if (params.search) apiParams.search = params.search;
      if (params.academic_year) apiParams.academic_year_id = params.academic_year;
      if (params.status) apiParams.status = params.status;
      const response = await axios.get('/api/students', { params: apiParams });
      if (response.data) {
        if (Array.isArray(response.data)) setStudents(response.data || []);
        else if (Array.isArray(response.data.data)) setStudents(response.data.data || []);
        else setStudents([]);
      } else setStudents([]);
    } catch (err) {
      console.warn('Error fetching students in ReportsStudents, falling back to dashboard data if available', err);
      setPageError(err.message || String(err));
      if (dashboardData && Array.isArray(dashboardData.students)) {
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

  const applyStudentFilters = () => fetchStudents(studentFilters);
  const resetStudentFilters = () => { setStudentFilters({ search: '', department: '', course: '', academic_year: '', status: '', year_level: '' }); fetchStudents({}); };

  // small helper to safely render values inside table cells
  const safeCell = (v) => {
    if (v === null || v === undefined) return '-';
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch (e) { return '-'; }
    }
    return String(v);
  };

  // Render academic year as a human friendly label
  const renderAcademicYear = (s) => {
    try {
      // Prefer nested academicYear object fields
      const ay = s?.academicYear || s?.academic_year;
      if (ay) {
        if (typeof ay === 'string') return ay;
        if (typeof ay === 'object') return ay.year || ay.name || ay.label || JSON.stringify(ay);
      }

      // Try to map by academic_year_id using dashboardData
      if (s?.academic_year_id && dashboardData?.academic_years) {
        const found = dashboardData.academic_years.find(y => String(y.id) === String(s.academic_year_id));
        if (found) return found.year || found.name || found.label || '-';
      }

      // Fall back to any string-like field
      if (s?.academic_year && typeof s.academic_year === 'string') return s.academic_year;
    } catch (e) {
      // ignore
    }
    return '-';
  };

  if (pageError) return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="alert alert-danger">An error occurred loading this page: {String(pageError)}</div>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-decoration-none me-3" onClick={() => navigate(-1)} aria-label="Back"><i className="fas fa-arrow-left me-1" /> Back</button>
              <h1 className="h3 mb-0 text-gray-800">Reports & Analytics</h1>
            </div>
            {/* Export buttons removed */}
          </div>

          <h4 className="mb-4">Students Overview</h4>

          <div className="row mb-4">
            <div className="col-md-4 mb-3"><div className="card p-3"><div className="small text-muted">Total Students</div><div className="h3 fw-bold">{dashboardData?.statistics?.totalStudents || 0}</div></div></div>
            <div className="col-md-4 mb-3"><div className="card p-3"><div className="small text-muted">Active Students</div><div className="h3 fw-bold">{dashboardData?.studentStatusDistribution?.find(s => s.status === 'active')?.count || 0}</div></div></div>
            <div className="col-md-4 mb-3"><div className="card p-3"><div className="small text-muted">Students Graduating</div><div className="h3 fw-bold">{dashboardData?.studentStatusDistribution?.find(s => s.status === 'graduated')?.count || 0}</div></div></div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h6 className="mb-3">Filter Students</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <input type="search" className="form-control" placeholder="Search by name or ID..." value={studentFilters.search} onChange={e => setStudentFilters(s => ({ ...s, search: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={studentFilters.department} onChange={e => setStudentFilters(s => ({ ...s, department: e.target.value }))}>
                    <option value="">All Departments</option>
                    {(dashboardData?.departments || []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={studentFilters.academic_year} onChange={e => setStudentFilters(s => ({ ...s, academic_year: e.target.value }))}>
                    <option value="">All Years</option>
                    {(dashboardData?.academic_years || []).map(y => <option key={y.id} value={y.id}>{y.year}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={studentFilters.status} onChange={e => setStudentFilters(s => ({ ...s, status: e.target.value }))}>
                    <option value="">All Statuses</option>
                    {(dashboardData?.studentStatusDistribution || []).map(st => <option key={st.status} value={st.status}>{st.status}</option>)}
                  </select>
                </div>
                <div className="col-md-2 d-flex align-items-center">
                  <div>
                    <button className="btn btn-primary me-2" onClick={() => applyStudentFilters()} disabled={studentsLoading}>Apply</button>
                    <button className="btn btn-link" onClick={() => resetStudentFilters()}>Reset Filters</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">All Students</h6>
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
                        <th>Student ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                            {students.map(s => (
                              <tr key={s?.id || Math.random()}>
                                <td>{safeCell(s?.student_id ?? s?.id)}</td>
                                <td>{safeCell(s?.name ?? `${s?.first_name ?? ''} ${s?.last_name ?? ''}`)}</td>
                                <td>{safeCell(s?.email ?? s?.personal_email)}</td>
                                <td>{safeCell(s?.department?.name ?? s?.department_name ?? (dashboardData?.departments?.find(d => d.id === s?.department_id)?.name))}</td>
                                <td>{safeCell(renderAcademicYear(s))}</td>
                                <td>{safeCell(s?.status)}</td>
                                <td><button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/students/${s?.id}`)}>View Details</button></td>
                              </tr>
                            ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsStudents;
