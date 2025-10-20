import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentsCreate = () => {
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
    // load academic years first so we can default to the active one
    (async () => {
      await fetchAcademicYears();
      fetchCourses();
      setFormData(prev => ({ ...prev, student_id: generateStudentId() }));
    })();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      let res;
      try {
        res = await axios.get('/api/academic-years');
      } catch (err) {
        // fallback to alternate endpoint name
        res = await axios.get('/api/academic_years');
      }
      const years = res.data.data || res.data || [];
      setAcademicYears(years);
      // default to first active academic year when creating students
      if (Array.isArray(years) && years.length > 0) {
        const active = years.find(y => y.active === true || y.is_active === true);
        if (active) {
          setFormData(prev => ({ ...prev, academic_year_id: active.id }));
        }
      }
    } catch (err) {
      console.error('Error fetching academic years:', err);
      // non-fatal
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

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const suffix = String(Date.now()).slice(-6);
    return `S-${year}-${suffix}`;
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

      // Ensure academic_year_id is a numeric id when sending to the API.
      // If empty or a non-numeric display value (e.g. "2024-2025"), try mapping
      // to the actual academicYears list. Fallback to the active academic year.
      if (!payload.academic_year_id) {
        const active = academicYears.find(y => y.active === true || y.is_active === true);
        if (active) payload.academic_year_id = active.id;
        else payload.academic_year_id = null;
      } else if (isNaN(Number(payload.academic_year_id))) {
        // value might be a display string; try to find matching academic year
        const mapped = academicYears.find(y => String(y.id) === String(payload.academic_year_id)
          || y.name === payload.academic_year_id
          || (y.name && y.name.includes(payload.academic_year_id)));
        if (mapped) payload.academic_year_id = mapped.id;
        else {
          const active = academicYears.find(y => y.active === true || y.is_active === true);
          if (active) payload.academic_year_id = active.id;
          else payload.academic_year_id = null;
        }
      }

      if (!payload.department_id && payload.course_id) {
        const selectedCourse = courses.find(c => String(c.id) === String(payload.course_id));
        if (selectedCourse && selectedCourse.department_id) {
          payload.department_id = selectedCourse.department_id;
        }
      }

      if (!payload.department_id) payload.department_id = '';

      await axios.post('/api/students', payload);
      toast.success('Student created successfully!');
      navigate('/students');
    } catch (error) {
      console.error('Error creating student:', error);
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
            <div className="card-header">
              <h5 className="card-title mb-0">Add New Student</h5>
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

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Student'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsCreate;
