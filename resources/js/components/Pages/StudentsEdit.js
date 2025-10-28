import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';

const StudentsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    course_id: '',
    department_id: '',
    academic_year_id: '',
    student_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    extension_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    enrollment_date: '',
    status: 'active',
    archived: false
  });

  useEffect(() => {
    (async () => {
      await fetchAcademicYears();
      fetchCourses();
      fetchStudent();
    })();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      let res;
      try {
        res = await axios.get('/api/academic-years');
      } catch (err) {
        res = await axios.get('/api/academic_years');
      }
      const years = res.data.data || res.data || [];
      setAcademicYears(years);
      // If the student doesn't already have an academic_year_id, default to the active one
      if (Array.isArray(years) && years.length > 0) {
        const active = years.find(y => y.active === true || y.is_active === true);
        if (active) {
          setFormData(prev => ({ ...prev, academic_year_id: prev.academic_year_id || active.id }));
        }
      }
    } catch (err) {
      console.error('Error fetching academic years:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Error fetching courses');
    }
  };

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/students/${id}`);
      const s = res.data.data || res.data;
      if (!s) {
        toast.error('Student not found');
        navigate('/students');
        return;
      }
      setFormData({
        course_id: s.course_id || '',
        department_id: s.department_id || '',
        academic_year_id: s.academic_year_id || '',
        student_id: s.student_id || '',
        first_name: s.first_name || '',
        middle_name: s.middle_name || '',
        last_name: s.last_name || '',
        extension_name: s.extension_name || '',
        email: s.email || '',
        phone: s.phone || '',
        date_of_birth: s.date_of_birth ? normalizeDate(s.date_of_birth) : '',
        enrollment_date: s.enrollment_date ? normalizeDate(s.enrollment_date) : '',
        status: s.status || 'active',
        archived: !!s.archived
      });
    } catch (err) {
      console.error('Error fetching student:', err);
      toast.error('Error fetching student');
      navigate('/students');
    } finally {
      setLoading(false);
    }
  };

  const normalizeDate = (value) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    const m = value.match(/(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const payload = { ...formData };
      if (payload.date_of_birth) payload.date_of_birth = normalizeDate(payload.date_of_birth);
      if (payload.enrollment_date) payload.enrollment_date = normalizeDate(payload.enrollment_date);

      if (!payload.academic_year_id || isNaN(Number(payload.academic_year_id))) {
        payload.academic_year_id = null;
      }

      if (!payload.department_id && payload.course_id) {
        const selectedCourse = courses.find(c => String(c.id) === String(payload.course_id));
        if (selectedCourse && selectedCourse.department_id) {
          payload.department_id = selectedCourse.department_id;
        }
      }

      if (!payload.department_id) payload.department_id = '';

      await axios.put(`/api/students/${id}`, payload);
      toast.success('Student updated successfully!');
      navigate('/students');
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors || {});
        } else if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(`Server error: ${error.response.status}`);
        }
      } else {
        toast.error(`Network error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Edit Student</h5>
              <div>
                <button className="btn btn-secondary" onClick={() => navigate('/students')}>Back</button>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Student ID *</label>
                  <input type="text" className={`form-control ${errors.student_id ? 'is-invalid' : ''}`} value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} required />
                  {errors.student_id && <div className="invalid-feedback">{errors.student_id[0]}</div>}
                </div>

                <div className="row mb-3">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Academic Year</label>
                    <select className={`form-select ${errors.academic_year_id ? 'is-invalid' : ''}`} value={formData.academic_year_id} onChange={(e) => setFormData({...formData, academic_year_id: e.target.value})}>
                      <option value="">Select Academic Year</option>
                      {academicYears && academicYears.length > 0 ? (
                        academicYears.map(y => (<option key={y.id} value={y.id}>{y.year || y.name}</option>))
                      ) : (
                        <option value="" disabled>No academic years available</option>
                      )}
                    </select>
                    {(!academicYears || academicYears.length === 0) && (
                      <small className="text-muted d-block mt-1">No academic years found. <Link to="/academic-years">Create an academic year</Link>.</small>
                    )}
                    {errors.academic_year_id && <div className="invalid-feedback">{errors.academic_year_id[0]}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Middle Name</label>
                    <input type="text" className={`form-control ${errors.middle_name ? 'is-invalid' : ''}`} value={formData.middle_name} onChange={(e) => setFormData({...formData, middle_name: e.target.value})} />
                    {errors.middle_name && <div className="invalid-feedback">{errors.middle_name[0]}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Extension Name</label>
                    <input type="text" className={`form-control ${errors.extension_name ? 'is-invalid' : ''}`} value={formData.extension_name} onChange={(e) => setFormData({...formData, extension_name: e.target.value})} />
                    {errors.extension_name && <div className="invalid-feedback">{errors.extension_name[0]}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input type="text" className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
                    {errors.first_name && <div className="invalid-feedback">{errors.first_name[0]}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
                    {errors.last_name && <div className="invalid-feedback">{errors.last_name[0]}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Date of Birth *</label>
                      <input type="date" className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`} value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} required />
                      {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth[0]}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Enrollment Date *</label>
                      <input type="date" className={`form-control ${errors.enrollment_date ? 'is-invalid' : ''}`} value={formData.enrollment_date} onChange={(e) => setFormData({...formData, enrollment_date: e.target.value})} required />
                      {errors.enrollment_date && <div className="invalid-feedback">{errors.enrollment_date[0]}</div>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Course *</label>
                      <select className={`form-select ${errors.course_id ? 'is-invalid' : ''}`} value={formData.course_id} onChange={(e) => setFormData({...formData, course_id: e.target.value})} required>
                        <option value="">Select Course</option>
                        {courses.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </select>
                      {errors.course_id && <div className="invalid-feedback">{errors.course_id[0]}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status *</label>
                      <select className={`form-select ${errors.status ? 'is-invalid' : ''}`} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                      {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Academic Year</label>
                  <select className={`form-select ${errors.academic_year_id ? 'is-invalid' : ''}`} value={formData.academic_year_id} onChange={(e) => setFormData({...formData, academic_year_id: e.target.value})}>
                    <option value="">Select Academic Year</option>
                    {/* Static options */}
                    <option value="2020-2021">S.Y. 2020-2021</option>
                    <option value="2021-2022">S.Y. 2021-2022</option>
                    <option value="2022-2023">S.Y. 2022-2023</option>
                    <option value="2023-2024">S.Y. 2023-2024</option>
                    <option value="2024-2025">S.Y. 2024-2025</option>
                    {academicYears.map(y => (<option key={y.id} value={y.id}>{y.name}</option>))}
                  </select>
                  {errors.academic_year_id && <div className="invalid-feedback">{errors.academic_year_id[0]}</div>}
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Student'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsEdit;
