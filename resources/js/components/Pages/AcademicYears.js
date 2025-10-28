import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AcademicYears = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ year: '', start_date: '', end_date: '', is_current: false, is_active: true });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await axios.get('/api/academic-years');
      } catch (err) {
        res = await axios.get('/api/academic_years');
      }
      const data = res.data.data || res.data || [];
      setYears(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch academic years', err);
      toast.error('Failed to load academic years');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ year: '', start_date: '', end_date: '', is_current: false, is_active: true });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!form.year || !form.year.trim()) {
        toast.error('Please provide a year name (e.g. 2024-2025)');
        setSaving(false);
        return;
      }

      if (editingId) {
        await axios.put(`/api/academic-years/${editingId}`, form);
        toast.success('Academic year updated');
      } else {
        await axios.post('/api/academic-years', form);
        toast.success('Academic year created');
      }

      resetForm();
      fetchYears();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      }
      const msg = err.response?.data?.message || 'Save failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (y) => {
    setEditingId(y.id);
    setForm({
      year: y.year || y.name || '',
      start_date: y.start_date || '',
      end_date: y.end_date || '',
      is_current: !!y.is_current || !!y.current || false,
      is_active: !!y.is_active || !!y.active || true
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this academic year?')) return;
    try {
      await axios.delete(`/api/academic-years/${id}`);
      toast.success('Academic year deleted');
      fetchYears();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Academic Years</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-2 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label">Year (label)</label>
                    <input type="text" className={`form-control ${errors.year ? 'is-invalid' : ''}`} value={form.year} onChange={(e) => setForm({...form, year: e.target.value})} placeholder="e.g. 2024-2025" />
                    {errors.year && <div className="invalid-feedback">{errors.year[0]}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Start Date</label>
                    <input type="date" className={`form-control ${errors.start_date ? 'is-invalid' : ''}`} value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value})} />
                    {errors.start_date && <div className="invalid-feedback">{errors.start_date[0]}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">End Date</label>
                    <input type="date" className={`form-control ${errors.end_date ? 'is-invalid' : ''}`} value={form.end_date} onChange={(e) => setForm({...form, end_date: e.target.value})} />
                    {errors.end_date && <div className="invalid-feedback">{errors.end_date[0]}</div>}
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="ay-current" checked={!!form.is_current} onChange={(e) => setForm({...form, is_current: e.target.checked})} />
                        <label className="form-check-label" htmlFor="ay-current">Current</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="ay-active" checked={!!form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
                        <label className="form-check-label" htmlFor="ay-active">Active</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2 d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>Reset</button>
                  </div>
                </div>
              </form>

              <div>
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Active</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {years.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center">No academic years found</td>
                          </tr>
                        )}
                        {years.map(y => (
                          <tr key={y.id}>
                            <td>{y.year || y.name}</td>
                            <td>{(y.is_active || y.active) ? 'Yes' : 'No'}</td>
                            <td>{y.created_at ? new Date(y.created_at).toLocaleString() : ''}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(y)}>Edit</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(y.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicYears;
