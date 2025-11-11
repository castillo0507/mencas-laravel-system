import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FacultyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaculty = async (signal = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/faculty/${id}`);
      const payload = res.data?.data || res.data || null;
      if (signal.cancelled) return;
      setFaculty(payload);

      if (payload && !signal.cancelled) {
        if ((!payload.department || typeof payload.department !== 'object') && payload.department_id) {
          try {
            const dr = await axios.get(`/api/departments/${payload.department_id}`);
            const deptPayload = dr.data?.data || dr.data || null;
            if (!signal.cancelled) setFaculty(prev => ({ ...(prev || {}), department: deptPayload }));
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error('Error fetching faculty', err);
      if (!signal.cancelled) setError(err.response?.data?.message || err.message || String(err));
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    const token = { cancelled: false };
    fetchFaculty(token);

    const onFacultyChanged = (ev) => {
      try {
        const changedId = ev?.detail?.id || ev?.detail?.faculty_id || ev?.detail?.faculty?.id;
        if (!changedId || String(changedId) === String(id)) {
          fetchFaculty({ cancelled: false });
        }
      } catch (e) {
        // swallow
      }
    };

    window.addEventListener('faculty:changed', onFacultyChanged);
    return () => {
      token.cancelled = true;
      window.removeEventListener('faculty:changed', onFacultyChanged);
    };
  }, [id]);

  const safe = (v) => {
    if (v === null || v === undefined) return '-';
    if (typeof v === 'object') {
      try { return v.name || v.label || JSON.stringify(v); } catch (e) { return '-'; }
    }
    return String(v);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  if (error) return (
    <div className="container-fluid mt-4"><div className="alert alert-danger">Error loading faculty: {String(error)}</div></div>
  );

  if (!faculty) return (
    <div className="container-fluid mt-4"><div className="alert alert-warning">Faculty member not found.</div></div>
  );

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-link text-decoration-none me-3" onClick={() => navigate(-1)} aria-label="Back"><i className="fas fa-arrow-left me-1" /> Back</button>
            <h1 className="h3 mb-0">Faculty Details</h1>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 text-center">
              {faculty.photo_url || faculty.photo ? (
                <img
                  src={faculty.photo_url || faculty.photo}
                  alt={`${faculty.first_name || ''} ${faculty.last_name || ''}`}
                  className="mb-3"
                  style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <div
                  className="bg-primary text-white d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '140px', height: '140px', borderRadius: '50%', fontSize: '32px' }}
                >
                  {(faculty.first_name?.charAt(0) || '') + (faculty.middle_name?.charAt(0) || '') + (faculty.last_name?.charAt(0) || '')}
                </div>
              )}
            </div>
            <div className="col-md-9">
              <h5 className="mb-3">Personal Information</h5>
              <div className="row">
                <div className="col-md-4"><strong>Employee ID:</strong> {safe(faculty.employee_id || faculty.id)}</div>
                <div className="col-md-4"><strong>Full Name:</strong> {safe(faculty.name || `${faculty.first_name || ''}${faculty.middle_name ? ' ' + faculty.middle_name : ''} ${faculty.last_name || ''}`)}</div>
                <div className="col-md-4"><strong>Email:</strong> {safe(faculty.email)}</div>

                <div className="col-md-4"><strong>Phone:</strong> {safe(faculty.phone)}</div>
                <div className="col-md-4"><strong>Position:</strong> {safe(faculty.position)}</div>
                <div className="col-md-4"><strong>Department:</strong> {safe(faculty.department?.name || faculty.department_name)}</div>

                <div className="col-md-4"><strong>Gender:</strong> {safe(faculty.gender)}</div>
                <div className="col-md-4"><strong>Emergency Contact:</strong> {safe(faculty.emergency_contact)}</div>
                <div className="col-md-4"><strong>Status:</strong> {safe(faculty.is_active ? 'Active' : 'Inactive')}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyView;
