import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportsFaculty = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', department: '', status: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      await fetchDashboardData();
      await fetchFaculty({});
    })();

    const onFacultyChanged = () => {
      fetchDashboardData();
      fetchFaculty(filters);
    };
    window.addEventListener('faculty:changed', onFacultyChanged);
    return () => window.removeEventListener('faculty:changed', onFacultyChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('/api/dashboard');
      const payload = res.data?.data || res.data || null;
      setDashboardData(payload);
    } catch (err) {
      console.error('Error fetching dashboard data for reports/faculty:', err);
      setDashboardData(null);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async (params = {}) => {
    setFacultyLoading(true);
    setError(null);
    try {
      const apiParams = {};
      if (params.department) apiParams.department_id = params.department;
      if (params.search) apiParams.search = params.search;
      if (params.status) apiParams.status = params.status;

      const response = await axios.get('/api/faculty', { params: apiParams });
      if (response.data) {
        if (Array.isArray(response.data)) setFaculty(response.data || []);
        else if (Array.isArray(response.data.data)) setFaculty(response.data.data || []);
        else setFaculty([]);
      } else setFaculty([]);
    } catch (err) {
      console.warn('Error fetching faculty in ReportsFaculty, falling back to dashboard data if available', err);
      if (dashboardData && Array.isArray(dashboardData.faculty)) {
        let list = dashboardData.faculty.slice();
        if (params.department) list = list.filter(f => String(f.department_id) === String(params.department));
        if (params.status) list = list.filter(f => String(f.status) === String(params.status));
        if (params.search) list = list.filter(f => `${f.first_name || ''} ${f.last_name || ''}`.toLowerCase().includes(String(params.search).toLowerCase()));
        setFaculty(list);
      } else {
        setError('No faculty data available');
        setFaculty([]);
      }
    } finally {
      setFacultyLoading(false);
    }
  };

  const applyFilters = () => fetchFaculty(filters);
  const resetFilters = () => { setFilters({ search: '', department: '', status: '' }); fetchFaculty({}); };

  const safe = (v) => {
    if (v === null || v === undefined) return '-';
    if (typeof v === 'object') {
      try { return v.name || v.label || JSON.stringify(v); } catch (e) { return '-'; }
    }
    return String(v);
  };

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
              <h1 className="h3 mb-0 text-gray-800">Faculty Reports</h1>
            </div>
            {/* Export buttons removed */}
          </div>

          <h4 className="mb-4">Faculty Overview</h4>

          <div className="row mb-4">
            <div className="col-md-4 mb-3"><div className="card p-3"><div className="small text-muted">Total Faculty</div><div className="h3 fw-bold">{dashboardData?.statistics?.totalFaculty || 0}</div></div></div>
            <div className="col-md-4 mb-3"><div className="card p-3"><div className="small text-muted">Active Faculty</div><div className="h3 fw-bold">{dashboardData?.statistics?.activeFaculty || 0}</div></div></div>
            <div className="col-md-4 mb-3"><div className="card p-3"><div className="small text-muted">Departments with Faculty</div><div className="h3 fw-bold">{(dashboardData?.departmentStats || []).length || 0}</div></div></div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h6 className="mb-3">Filter Faculty</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <input type="search" className="form-control" placeholder="Search by name or employee ID..." value={filters.search} onChange={e => setFilters(s => ({ ...s, search: e.target.value }))} />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={filters.department} onChange={e => setFilters(s => ({ ...s, department: e.target.value }))}>
                    <option value="">All Departments</option>
                    {(dashboardData?.departments || []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={filters.status} onChange={e => setFilters(s => ({ ...s, status: e.target.value }))}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-md-2 d-flex align-items-center">
                  <div>
                    <button className="btn btn-primary me-2" onClick={() => applyFilters()} disabled={facultyLoading}>Apply</button>
                    <button className="btn btn-link" onClick={() => resetFilters()}>Reset Filters</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">All Faculty</h6>
              <div className="table-responsive">
                {facultyLoading ? (
                  <div className="text-center py-4">Loading faculty...</div>
                ) : error ? (
                  <div className="text-danger">{error}</div>
                ) : faculty.length === 0 ? (
                  <div className="text-muted">No faculty found for the selected filters.</div>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.map(f => (
                        <tr key={f?.id || Math.random()}>
                          <td>{safe(f?.employee_id ?? f?.id)}</td>
                          <td>{safe(f?.first_name ? `${f.first_name} ${f.middle_name ? ' ' + f.middle_name : ''} ${f.last_name}` : f?.name)}</td>
                          <td>{safe(f?.email)}</td>
                          <td>{safe(f?.department?.name || f?.department_name || (dashboardData?.departments?.find(d => d.id === f?.department_id)?.name))}</td>
                          <td>{safe(f?.position)}</td>
                          <td>{safe(f?.is_active ? 'Active' : 'Inactive')}</td>
                          <td><button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/faculty/${f?.id}`)}>View Details</button></td>
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

export default ReportsFaculty;
