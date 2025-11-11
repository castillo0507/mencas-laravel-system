import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentsByCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  useEffect(() => {
    (async () => {
      await fetchDashboard();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDashboard = async () => {
    try {
      const resp = await axios.get('/api/dashboard');
      const payload = resp.data?.data || resp.data || null;
      setDashboardData(payload);
      // find course if available in dashboard payload
      const found = (payload?.courses || []).find(c => String(c.id) === String(id));
      if (found) {
        setCourse(found);
        // fetch students for this course
        fetchStudents({ course: found.id });
      } else {
        // still try to fetch students even if course metadata not present
        fetchStudents({ course: id });
      }
    } catch (err) {
      console.error('Error fetching dashboard for StudentsByCourse', err);
      // still attempt to fetch students
      fetchStudents({ course: id });
    } finally {
      setLoading(false);
    }
  };

  const safeCell = (v) => {
    if (v === null || v === undefined) return '-';
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch (e) { return '-'; }
    }
    return String(v);
  };

  const renderAcademicYear = (s) => {
    try {
      const ay = s?.academicYear || s?.academic_year;
      if (ay) {
        if (typeof ay === 'string') return ay;
        if (typeof ay === 'object') return ay.year || ay.name || ay.label || JSON.stringify(ay);
      }
      if (s?.academic_year_id && dashboardData?.academic_years) {
        const found = dashboardData.academic_years.find(y => String(y.id) === String(s.academic_year_id));
        if (found) return found.year || found.name || found.label || '-';
      }
      if (s?.academic_year && typeof s.academic_year === 'string') return s.academic_year;
    } catch (e) {}
    return '-';
  };

  const fetchStudents = async (params = {}) => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const apiParams = {};
      if (params.course) apiParams.course_id = params.course;
      if (params.department) apiParams.department_id = params.department;
      if (params.search) apiParams.search = params.search;
      if (params.academic_year) apiParams.academic_year_id = params.academic_year;
      if (params.status) apiParams.status = params.status;

      const resp = await axios.get('/api/students', { params: apiParams });
      if (resp.data) {
        if (Array.isArray(resp.data)) setStudents(resp.data || []);
        else if (Array.isArray(resp.data.data)) setStudents(resp.data.data || []);
        else setStudents([]);
      } else setStudents([]);
    } catch (err) {
      console.warn('StudentsByCourse: falling back to dashboard data', err);
      if (dashboardData && Array.isArray(dashboardData.students)) {
        let list = dashboardData.students.slice();
        if (params.course) list = list.filter(s => String(s.course_id) === String(params.course));
        setStudents(list);
      } else {
        setStudentsError('No student data available');
        setStudents([]);
      }
    } finally {
      setStudentsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-decoration-none me-3" onClick={() => navigate(-1)} aria-label="Back"><i className="fas fa-arrow-left me-1" /> Back</button>
              <h1 className="h3 mb-0 text-gray-800">Students by Course</h1>
            </div>
          </div>

          <div className="card shadow mb-4">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <>
                  <div className="mb-3">
                    <h5 className="mb-0">{course?.name || `Course ${id}`}</h5>
                    <small className="text-muted">{course?.department_name || course?.department?.name || ''}</small>
                  </div>

                  <div className="table-responsive">
                    {studentsLoading ? (
                      <div className="text-center py-4">Loading students...</div>
                    ) : studentsError ? (
                      <div className="text-danger">{studentsError}</div>
                    ) : students.length === 0 ? (
                      <div className="text-muted">No students found for this course.</div>
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsByCourse;
