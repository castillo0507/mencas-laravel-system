import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const FacultyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department_id: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      await fetchDepartments();
      await fetchFaculty();
    })();
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

  const fetchFaculty = async () => {
    try {
      const res = await axios.get(`/api/faculty/${id}`);
      const f = res.data.data || res.data;
      if (!f) {
        toast.error('Faculty not found');
        navigate('/faculty');
        return;
      }
      setFormData({
        employee_id: f.employee_id || '',
        first_name: f.first_name || '',
        last_name: f.last_name || '',
        email: f.email || '',
        phone: f.phone || '',
        position: f.position || '',
        department_id: f.department_id || '',
        is_active: !!f.is_active
      });
    } catch (err) {
      console.error('Error fetching faculty', err);
      toast.error('Error fetching faculty');
      navigate('/faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await axios.put(`/api/faculty/${id}`, formData);
      toast.success('Faculty updated');
      navigate('/faculty');
    } catch (err) {
      console.error('Error updating faculty', err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error(err.response?.data?.message || 'Error updating faculty');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Edit Faculty Member</h5>
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input required className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                    {errors.first_name && <div className="invalid-feedback">{errors.first_name[0]}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    {errors.phone && <div className="invalid-feedback">{errors.phone[0]}</div>}
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
                  <button type="submit" className="btn btn-primary">Update Faculty Member</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyEdit;
