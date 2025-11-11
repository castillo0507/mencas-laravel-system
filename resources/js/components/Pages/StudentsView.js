import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch student and related resources; exported as a function so we can call it on events
  const fetchStudent = async (signal = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/students/${id}`);
      const payload = res.data?.data || res.data || null;
      if (signal.cancelled) return;
      setStudent(payload);

      // fetch related single resources if API returned only ids
      if (payload && !signal.cancelled) {
        // fetch course if missing but course_id present
        if ((!payload.course || typeof payload.course !== 'object') && payload.course_id) {
          try {
            const cr = await axios.get(`/api/courses/${payload.course_id}`);
            const coursePayload = cr.data?.data || cr.data || null;
            if (!signal.cancelled) setStudent(prev => ({ ...(prev || {}), course: coursePayload }));
          } catch (e) {
            // ignore
          }
        }

        // fetch department if missing but department_id present
        if ((!payload.department || typeof payload.department !== 'object') && payload.department_id) {
          try {
            const dr = await axios.get(`/api/departments/${payload.department_id}`);
            const deptPayload = dr.data?.data || dr.data || null;
            if (!signal.cancelled) setStudent(prev => ({ ...(prev || {}), department: deptPayload }));
          } catch (e) {
            // ignore
          }
        }

        // fetch academic year if missing but academic_year_id present
        if ((!payload.academicYear && !payload.academic_year) && payload.academic_year_id) {
          try {
            let ar;
            try { ar = await axios.get(`/api/academic-years/${payload.academic_year_id}`); } catch (e) { ar = await axios.get(`/api/academic_years/${payload.academic_year_id}`); }
            const ayPayload = ar.data?.data || ar.data || null;
            if (!signal.cancelled) setStudent(prev => ({ ...(prev || {}), academicYear: ayPayload }));
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error('Error fetching student', err);
      if (!signal.cancelled) setError(err.response?.data?.message || err.message || String(err));
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    const token = { cancelled: false };
    fetchStudent(token);

    const onStudentsChanged = (ev) => {
      try {
        const changedId = ev?.detail?.id || ev?.detail?.student_id || ev?.detail?.student?.id;
        // if the changed student matches current, refresh; if no id provided, refresh anyway
        if (!changedId || String(changedId) === String(id)) {
          fetchStudent({ cancelled: false });
        }
      } catch (e) {
        // swallow
      }
    };

    window.addEventListener('students:changed', onStudentsChanged);
    return () => {
      token.cancelled = true;
      window.removeEventListener('students:changed', onStudentsChanged);
    };
  }, [id]);

  const safe = (v) => {
    if (v === null || v === undefined) return '-';
    if (typeof v === 'object') {
      try { return v.name || v.label || JSON.stringify(v); } catch (e) { return '-'; }
    }
    return String(v);
  };

  const renderAcademicYear = (s) => {
    if (!s) return '-';
    const ay = s.academicYear || s.academic_year;
    if (ay) {
      if (typeof ay === 'string') return ay;
      if (typeof ay === 'object') return ay.year || ay.name || ay.label || JSON.stringify(ay);
    }
    if (s.academic_year && typeof s.academic_year === 'string') return s.academic_year;
    return s.academic_year_id ? String(s.academic_year_id) : '-';
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  if (error) return (
    <div className="container-fluid mt-4"><div className="alert alert-danger">Error loading student: {String(error)}</div></div>
  );

  if (!student) return (
    <div className="container-fluid mt-4"><div className="alert alert-warning">Student not found.</div></div>
  );

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-link text-decoration-none me-3" onClick={() => navigate(-1)} aria-label="Back"><i className="fas fa-arrow-left me-1" /> Back</button>
            <h1 className="h3 mb-0">Student Details</h1>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 text-center">
              {student.photo_url || student.photo ? (
                <img
                  src={student.photo_url || student.photo}
                  alt={`${student.first_name || ''} ${student.last_name || ''}`}
                  className="mb-3"
                  style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <div
                  className="bg-primary text-white d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '140px', height: '140px', borderRadius: '50%', fontSize: '32px' }}
                >
                  {(student.first_name?.charAt(0) || '') + (student.middle_name?.charAt(0) || '') + (student.last_name?.charAt(0) || '')}
                </div>
              )}
            </div>
            <div className="col-md-9">
              <h5 className="mb-3">Personal Information</h5>
              <div className="row">
                <div className="col-md-4"><strong>Student ID:</strong> {safe(student.student_id || student.id)}</div>
                <div className="col-md-4"><strong>Full Name:</strong> {safe(student.name || `${student.first_name || ''} ${student.middle_name ? ' ' + student.middle_name : ''} ${student.last_name || ''} ${student.extension_name ? ', ' + student.extension_name : ''}`)}</div>
                <div className="col-md-4"><strong>Email:</strong> {safe(student.email || student.personal_email)}</div>

                <div className="col-md-4"><strong>Phone:</strong> {safe(student.phone)}</div>
                <div className="col-md-4"><strong>Date of Birth:</strong> {safe(student.date_of_birth)}</div>
                <div className="col-md-4"><strong>Enrollment Date:</strong> {safe(student.enrollment_date)}</div>

                <div className="col-md-4"><strong>Birthplace:</strong> {safe(student.birthplace)}</div>
                <div className="col-md-4"><strong>Gender:</strong> {safe(student.gender)}</div>
                <div className="col-md-4"><strong>Address:</strong> {safe(student.address)}</div>

                <div className="col-md-4"><strong>Guardian:</strong> {safe(student.guardian_name)}</div>
                <div className="col-md-4"><strong>Guardian Contact:</strong> {safe(student.guardian_contact)}</div>
                <div className="col-md-4"><strong>Emergency Contact:</strong> {safe(student.emergency_contact)}</div>
              </div>

              <hr />
              <h5 className="mb-3">Academic Information</h5>
              <div className="row">
                <div className="col-md-4"><strong>Department:</strong> {safe(student.department?.name || student.department_name)}</div>
                <div className="col-md-4"><strong>Course:</strong> {safe(student.course?.name || student.course_name)}</div>
                <div className="col-md-4"><strong>Academic Year:</strong> {renderAcademicYear(student)}</div>
                <div className="col-md-4"><strong>Year Level:</strong> {safe(student.year_level ?? student.year_level_label)}</div>
                <div className="col-md-4"><strong>Status:</strong> {safe(student.status)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsView;
