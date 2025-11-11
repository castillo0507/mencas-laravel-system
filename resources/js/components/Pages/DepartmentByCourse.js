import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DepartmentByCourse = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboard = async () => {
    try {
      const resp = await axios.get('/api/dashboard');
      const payload = resp.data?.data || resp.data || null;
      setDashboardData(payload);
      // Attempt to fetch students list to compute accurate per-course counts
      try {
        const sresp = await axios.get('/api/students', { params: { per_page: 1000 } });
        const studentList = Array.isArray(sresp.data?.data) ? sresp.data.data : (Array.isArray(sresp.data) ? sresp.data : []);
        // build counts map
        const counts = {};
        (studentList || []).forEach(s => {
          const cid = s.course_id || s.course?.id || null;
          if (!cid) return;
          counts[cid] = (counts[cid] || 0) + 1;
        });
        // override courseCounts by attaching to dashboardData for rendering
        // Note: we keep local variable courseCounts below but set dashboardData._courseCounts for persistence
        const next = { ...payload, _courseCounts: counts };
        setDashboardData(next);
      } catch (err) {
        // ignore errors — fall back to any counts present in payload
        console.warn('Could not fetch students for course counts', err);
      }
    } catch (err) {
      console.error('Error fetching dashboard for DepartmentByCourse', err);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  const departments = dashboardData?.departmentStats || dashboardData?.departments || [];
  const courses = dashboardData?.courses || [];

  // Map courses by department
  const coursesByDept = {};
  (courses || []).forEach(c => {
    const did = c.department_id || c.department?.id || null;
    if (!coursesByDept[did]) coursesByDept[did] = [];
    coursesByDept[did].push(c);
  });

  // Compute student counts per course as a fallback when course.students_count isn't provided.
  // Prefer counts from dashboardData._courseCounts (populated by a students API fetch); otherwise fall back to dashboardData.students.
  const courseCounts = {};
  if (dashboardData?._courseCounts) {
    Object.assign(courseCounts, dashboardData._courseCounts);
  } else {
    (dashboardData?.students || []).forEach(s => {
      const cid = s.course_id || s.course?.id || null;
      if (!cid) return;
      courseCounts[cid] = (courseCounts[cid] || 0) + 1;
    });
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-decoration-none me-3" onClick={() => navigate(-1)} aria-label="Back">
                <i className="fas fa-arrow-left me-1" /> Back
              </button>
              <h1 className="h3 mb-0 text-gray-800">Departments — Courses</h1>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              {(departments.length === 0) ? (
                <div className="card"><div className="card-body text-muted">No department data available.</div></div>
              ) : (
                departments.map(dept => (
                  <div className="card mb-3" key={dept.id}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{dept.name}</strong>
                        <div className="small text-muted">Students: {dept.students_count || 0} · Faculty: {dept.faculty_count || 0} · Courses: {dept.courses_count || (coursesByDept[dept.id]?.length || 0)}</div>
                      </div>
                    </div>
                    <div className="card-body">
                      {(coursesByDept[dept.id] || []).length === 0 ? (
                        <div className="text-muted">No courses for this department.</div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm table-hover">
                            <thead>
                              <tr>
                                  <th>Course</th>
                                  <th>Students</th>
                                  <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                              {(coursesByDept[dept.id] || []).map(c => (
                                <tr key={c.id}>
                                  <td>{c.name}</td>
                                  <td>{(c.students_count != null ? c.students_count : (courseCounts[c.id] != null ? courseCounts[c.id] : '-'))}</td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => navigate(`/reports/courses/${c.id}`)}>View Students</button>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => alert('Course details not implemented')}>Details</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentByCourse;
