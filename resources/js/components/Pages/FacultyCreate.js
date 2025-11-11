import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FacultyCreate = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    middle_name: '',
    gender: '',
    last_name: '',
    email: '',
    phone: '',
    emergency_contact: '',
    photo: null,
    photo_preview: '',
    position: '',
    department_id: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching departments', err);
      toast.error('Error fetching departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const payload = { ...formData };

      // If a photo file is present, send as multipart/form-data
      if (payload.photo && payload.photo instanceof File) {
        const fd = new FormData();
        Object.keys(payload).forEach(key => {
          if (key === 'photo_preview') return;
          const val = payload[key];
          if (val === undefined || val === null) return;
          if (key === 'photo') return; // append separately
          if (typeof val === 'boolean') fd.append(key, val ? '1' : '0');
          else fd.append(key, val);
        });
        fd.append('photo', payload.photo);
        await axios.post('/api/faculty', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        if (payload.photo_preview) delete payload.photo_preview;
        if (payload.photo === null) delete payload.photo;
        await axios.post('/api/faculty', payload);
      }
      toast.success('Faculty member created');
      navigate('/faculty');
    } catch (err) {
      console.error('Error creating faculty', err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error(err.response?.data?.message || 'Error creating faculty');
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
              <h5 className="card-title mb-0">Add New Faculty Member</h5>
              <div>
                <button className="btn btn-secondary" onClick={() => navigate('/faculty')}>Back</button>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Employee ID *</label>
                    <input required className={`form-control ${errors.employee_id ? 'is-invalid' : ''}`} value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} />
                    {errors.employee_id && <div className="invalid-feedback">{errors.employee_id[0]}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department *</label>
                    <select required className={`form-select ${errors.department_id ? 'is-invalid' : ''}`} value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                      <option value="">Select Department</option>
                      {departments.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                    </select>
                    {errors.department_id && <div className="invalid-feedback">{errors.department_id[0]}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">First Name *</label>
                    <input required className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                    {errors.first_name && <div className="invalid-feedback">{errors.first_name[0]}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Middle Name</label>
                    <input className={`form-control ${errors.middle_name ? 'is-invalid' : ''}`} value={formData.middle_name} onChange={(e) => setFormData({...formData, middle_name: e.target.value})} />
                    {errors.middle_name && <div className="invalid-feedback">{errors.middle_name[0]}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input required className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                    {errors.last_name && <div className="invalid-feedback">{errors.last_name[0]}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" required className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Phone</label>
                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="col-md-2 mb-3">
                    <label className="form-label">Emergency Contact</label>
                    <input className={`form-control ${errors.emergency_contact ? 'is-invalid' : ''}`} value={formData.emergency_contact} onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})} />
                  </div>
                  <div className="col-md-2 mb-3">
                    <label className="form-label">Gender</label>
                    <select className={`form-select ${errors.gender ? 'is-invalid' : ''}`} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <div className="invalid-feedback">{errors.gender[0]}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card p-3 text-center">
                      <div className="mb-2"><strong>Upload Photo</strong></div>
                      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e9ecef', borderRadius: 6, marginBottom: 8 }}>
                        {formData.photo_preview ? (
                          <img src={formData.photo_preview} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#0d6efd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
                            {(((formData.first_name || '').charAt(0) || '') + ((formData.middle_name || '').charAt(0) || '') + ((formData.last_name || '').charAt(0) || '')).toUpperCase().slice(0,2) || 'U'}
                          </div>
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Position *</label>
                    <input required className={`form-control ${errors.position ? 'is-invalid' : ''}`} value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} placeholder="e.g., Professor" />
                    {errors.position && <div className="invalid-feedback">{errors.position[0]}</div>}
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                  <label className="form-check-label" htmlFor="is_active">Active Faculty Member</label>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/faculty')}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Faculty Member'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCreate;
