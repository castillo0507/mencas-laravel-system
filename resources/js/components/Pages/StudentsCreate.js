import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentsCreate = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseList, setShowCourseList] = useState(false);
  const courseWrapperRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!courseWrapperRef.current) return;
      if (!courseWrapperRef.current.contains(e.target)) {
        setShowCourseList(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setShowCourseList(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const [formData, setFormData] = useState({
    course_id: '',
    department_id: '',
    year_level: '',
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
    address: '',
    gender: '',
    birthplace: '',
    guardian_name: '',
    guardian_contact: '',
    emergency_contact: '',
    photo: null,
    photo_preview: '',
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

      // If a photo file is present, send as multipart/form-data
      if (payload.photo && payload.photo instanceof File) {
        const fd = new FormData();
        // append all payload fields except photo_preview
        Object.keys(payload).forEach(key => {
          if (key === 'photo_preview') return;
          const val = payload[key];
          if (val === undefined || val === null) return;
          // For boolean values, cast to string
          if (typeof val === 'boolean') fd.append(key, val ? '1' : '0');
          else fd.append(key, val);
        });
        fd.append('photo', payload.photo);

        await axios.post('/api/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        // remove photo_preview if present
        if (payload.photo_preview) delete payload.photo_preview;
        if (payload.photo === null) delete payload.photo;
        await axios.post('/api/students', payload);
      }
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
                {/* Name row: First, Last, Middle, Extension */}
                <div className="row mb-3">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">First Name *</label>
                    <input type="text" className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
                    {errors.first_name && <div className="invalid-feedback">{errors.first_name[0]}</div>}
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
                    {errors.last_name && <div className="invalid-feedback">{errors.last_name[0]}</div>}
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Middle Name</label>
                    <input type="text" className={`form-control ${errors.middle_name ? 'is-invalid' : ''}`} value={formData.middle_name} onChange={(e) => setFormData({...formData, middle_name: e.target.value})} />
                    {errors.middle_name && <div className="invalid-feedback">{errors.middle_name[0]}</div>}
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Extension Name</label>
                    <input type="text" className={`form-control ${errors.extension_name ? 'is-invalid' : ''}`} value={formData.extension_name} onChange={(e) => setFormData({...formData, extension_name: e.target.value})} />
                    {errors.extension_name && <div className="invalid-feedback">{errors.extension_name[0]}</div>}
                  </div>
                </div>

                {/* Student ID */}
                <div className="mb-3">
                  <label className="form-label">Student ID *</label>
                  <input type="text" className={`form-control ${errors.student_id ? 'is-invalid' : ''}`} value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} required />
                  {errors.student_id && <div className="invalid-feedback">{errors.student_id[0]}</div>}
                </div>

                {/* Academic Year, Year Level, Email, Phone */}
                <div className="row mb-3">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Academic Year</label>
                    <select className={`form-select ${errors.academic_year_id ? 'is-invalid' : ''}`} value={formData.academic_year_id} onChange={(e) => setFormData({...formData, academic_year_id: e.target.value})}>
                      <option value="">Select Academic Year</option>
                      {academicYears && academicYears.length > 0 ? (
                        academicYears.map(y => (<option key={y.id} value={y.id}>{y.year || y.name}</option>))
                      ) : (
                        <option value="">No academic years available</option>
                      )}
                    </select>
                    {errors.academic_year_id && <div className="invalid-feedback">{errors.academic_year_id[0]}</div>}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Year Level</label>
                    <select className={`form-select ${errors.year_level ? 'is-invalid' : ''}`} value={formData.year_level} onChange={(e) => setFormData({...formData, year_level: e.target.value})}>
                      <option value="">Select Year Level</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    {errors.year_level && <div className="invalid-feedback">{errors.year_level[0]}</div>}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Phone</label>
                    <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div className="row mb-3">
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

                {/* Gender, Birthplace, Address + Photo upload */}
                <div className="row mb-3">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label d-block">Gender</label>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="gender" id="genderMale" value="male" checked={formData.gender === 'male'} onChange={(e) => setFormData(s => ({ ...s, gender: e.target.value }))} />
                          <label className="form-check-label" htmlFor="genderMale">Male</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="gender" id="genderFemale" value="female" checked={formData.gender === 'female'} onChange={(e) => setFormData(s => ({ ...s, gender: e.target.value }))} />
                          <label className="form-check-label" htmlFor="genderFemale">Female</label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Birthplace</label>
                        <input type="text" className={`form-control ${errors.birthplace ? 'is-invalid' : ''}`} value={formData.birthplace} onChange={(e) => setFormData({...formData, birthplace: e.target.value})} />
                        {errors.birthplace && <div className="invalid-feedback">{errors.birthplace[0]}</div>}
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Address</label>
                        <textarea className={`form-control ${errors.address ? 'is-invalid' : ''}`} rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        {errors.address && <div className="invalid-feedback">{errors.address[0]}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card p-3 text-center">
                      <div className="mb-2">
                        <strong>Upload Student Photo</strong>
                      </div>
                      <div style={{ minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e9ecef', borderRadius: 6, marginBottom: 8 }}>
                        {formData.photo_preview ? (
                          <img src={formData.photo_preview} alt="preview" style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'cover', borderRadius: 4 }} />
                        ) : (
                          <div className="text-muted">No photo selected</div>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        if (f) {
                          const preview = URL.createObjectURL(f);
                          setFormData(s => ({ ...s, photo: f, photo_preview: preview }));
                        }
                      }} />
                    </div>
                  </div>
                </div>

                

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3" style={{ position: 'relative' }}>
                      <label className="form-label">Course *</label>
                      <div style={{ position: 'relative' }} ref={courseWrapperRef} onClick={() => setShowCourseList(true)}>
                        <input
                          type="text"
                          className={`form-control ${errors.course_id ? 'is-invalid' : ''}`}
                          placeholder="Search courses..."
                          value={(formData.course_id && courses.find(x => String(x.id) === String(formData.course_id))?.name) || courseSearch}
                          onChange={(e) => {
                            setCourseSearch(e.target.value);
                            setShowCourseList(true);
                            if (formData.course_id) setFormData(prev => ({ ...prev, course_id: '' }));
                          }}
                          onFocus={() => setShowCourseList(true)}
                          required
                          style={{ paddingRight: '38px' }}
                        />
                        <button type="button" onClick={() => setShowCourseList(s => !s)} aria-label="Toggle courses" style={{
                          position: 'absolute',
                          right: '6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'transparent',
                          padding: '6px',
                          cursor: 'pointer'
                        }}>
                          <i className="fas fa-caret-down"></i>
                        </button>
                        {errors.course_id && <div className="invalid-feedback">{errors.course_id[0]}</div>}

                        {showCourseList && (
                          <div style={{
                            position: 'absolute',
                            zIndex: 1050,
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: '6px',
                            marginTop: '6px',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                          }}>
                            <div style={{ padding: '8px' }}>
                              <input
                                type="search"
                                className="form-control"
                                placeholder="Type to filter courses"
                                value={courseSearch}
                                onChange={(e) => setCourseSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                            <ul className="list-group list-group-flush">
                              {courses.filter(c => {
                                if (!courseSearch) return true;
                                const q = courseSearch.toLowerCase();
                                return (c.name || '').toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q);
                              }).map(c => (
                                <li
                                  key={c.id}
                                  className="list-group-item list-group-item-action"
                                  style={{ cursor: 'pointer' }}
                                  onMouseDown={(ev) => {
                                    ev.preventDefault();
                                    setFormData(prev => ({ ...prev, course_id: String(c.id) }));
                                    setCourseSearch('');
                                    setShowCourseList(false);
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>{c.name}</div>
                                    <small className="text-muted">{c.department?.name || ''}</small>
                                  </div>
                                </li>
                              ))}
                              {courses.filter(c => {
                                if (!courseSearch) return true;
                                const q = courseSearch.toLowerCase();
                                return (c.name || '').toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q);
                              }).length === 0 && (
                                <li className="list-group-item text-muted">No courses match your search.</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
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

                <div className="row mb-3">
                  <div className="col-md-5">
                    <label className="form-label">Guardian Name</label>
                    <input type="text" className={`form-control ${errors.guardian_name ? 'is-invalid' : ''}`} value={formData.guardian_name} onChange={(e) => setFormData({...formData, guardian_name: e.target.value})} />
                    {errors.guardian_name && <div className="invalid-feedback">{errors.guardian_name[0]}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Guardian Contact</label>
                    <input type="text" className={`form-control ${errors.guardian_contact ? 'is-invalid' : ''}`} value={formData.guardian_contact} onChange={(e) => setFormData({...formData, guardian_contact: e.target.value})} />
                    {errors.guardian_contact && <div className="invalid-feedback">{errors.guardian_contact[0]}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Emergency Contact</label>
                    <input type="text" className={`form-control ${errors.emergency_contact ? 'is-invalid' : ''}`} value={formData.emergency_contact} onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})} />
                    {errors.emergency_contact && <div className="invalid-feedback">{errors.emergency_contact[0]}</div>}
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
