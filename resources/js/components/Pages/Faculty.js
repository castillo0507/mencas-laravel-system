// resources/js/components/Pages/Faculty.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import toastConfirm from '../../utils/toastConfirm';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

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
    fetchFaculty();
    fetchDepartments();
  }, [currentPage, searchTerm, filterDepartment, filterStatus]);

  const fetchFaculty = async () => {
    try {
      const params = {
        page: currentPage,
        search: searchTerm,
        department_id: filterDepartment,
        status: filterStatus
      };
      
      const response = await axios.get('/api/faculty', { params });
      setFaculty(response.data.data || []);
      setTotalPages(response.data.meta?.last_page || 1);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    console.log('Submitting faculty data:', formData);
    
    try {
      let response;
      if (editingFaculty) {
        response = await axios.put(`/api/faculty/${editingFaculty.id}`, formData);
        console.log('Update response:', response);
      } else {
        response = await axios.post('/api/faculty', formData);
        console.log('Create response:', response);
      }
      
  setShowModal(false);
  setEditingFaculty(null);
  resetForm();
  fetchFaculty();
  toast.success('Faculty member saved successfully!');
    } catch (error) {
      console.error('Error saving faculty:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleEdit = (facultyMember) => {
    setEditingFaculty(facultyMember);
    setFormData({
      employee_id: facultyMember.employee_id,
      first_name: facultyMember.first_name,
      last_name: facultyMember.last_name,
      email: facultyMember.email,
      phone: facultyMember.phone || '',
      position: facultyMember.position,
      department_id: facultyMember.department_id,
      is_active: facultyMember.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (facultyMember) => {
    const ok = await toastConfirm(`Are you sure you want to delete ${facultyMember.first_name} ${facultyMember.last_name}?`, { okText: 'Delete', cancelText: 'Cancel' });
    if (!ok) return;
    try {
      await axios.delete(`/api/faculty/${facultyMember.id}`);
      toast.success('Faculty member deleted');
      fetchFaculty();
    } catch (error) {
      console.error('Error deleting faculty member:', error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position: '',
      department_id: '',
      is_active: true
    });
    setErrors({});
  };

  const handleAddNew = () => {
    setEditingFaculty(null);
    resetForm();
    setShowModal(true);
  };



  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0 text-gray-800">Faculty Members</h1>
              <p className="mb-0 text-muted"></p>
            </div>
            <div className="d-flex gap-2">
              <div className="btn-group" role="group">
                <button 
                  className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('cards')}
                  title="Card View"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <i className="fas fa-table"></i>
                </button>
              </div>
              <button className="btn btn-success" onClick={handleAddNew}>
                <i className="fas fa-plus me-2"></i>
                Add Faculty Member
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterDepartment('');
                      setFilterStatus('');
                      setCurrentPage(1);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Display */}
          {viewMode === 'cards' ? (
            <div className="row">
              {faculty.length > 0 ? (
                faculty.map((member) => (
                  <div key={member.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div 
                            className="bg-primary text-white d-flex align-items-center justify-content-center me-3"
                            style={{ width: '50px', height: '50px', borderRadius: '50%', fontSize: '18px' }}
                          >
                            {member.first_name?.charAt(0)}{member.last_name?.charAt(0)}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="card-title mb-1">
                              {member.position} {member.first_name} {member.last_name}
                            </h6>
                            <p className="text-muted small mb-0">{member.position}</p>
                            <p className="text-muted small mb-0">
                              {member.department?.name || 'No Department'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-building me-2 text-muted"></i>
                            <span className="small">{member.department?.name || 'No Department'}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-envelope me-2 text-muted"></i>
                            <span className="small">{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="d-flex align-items-center mb-2">
                              <i className="fas fa-phone me-2 text-muted"></i>
                              <span className="small">{member.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <span className={`badge ${member.is_active ? 'bg-success' : 'bg-secondary'}`}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEdit(member)}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-5">
                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No faculty members found</h5>
                    <p className="text-muted">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card shadow">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.length > 0 ? (
                        faculty.map((member) => (
                          <tr key={member.id}>
                            <td><strong>{member.employee_id}</strong></td>
                            <td>{member.first_name} {member.last_name}</td>
                            <td>{member.email}</td>
                            <td>{member.phone || 'N/A'}</td>
                            <td>{member.position}</td>
                            <td>{member.department?.name || 'N/A'}</td>
                            <td>
                              <span className={`badge ${member.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                {member.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(member)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(member)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No faculty members found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Faculty pagination">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                  </li>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Employee ID *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.employee_id ? 'is-invalid' : ''}`}
                          value={formData.employee_id}
                          onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                          required
                        />
                        {errors.employee_id && <div className="invalid-feedback">{errors.employee_id[0]}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Department *</label>
                        <select
                          className={`form-select ${errors.department_id ? 'is-invalid' : ''}`}
                          value={formData.department_id}
                          onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                          required
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </select>
                        {errors.department_id && <div className="invalid-feedback">{errors.department_id[0]}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                          value={formData.first_name}
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                          required
                        />
                        {errors.first_name && <div className="invalid-feedback">{errors.first_name[0]}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                          value={formData.last_name}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                          required
                        />
                        {errors.last_name && <div className="invalid-feedback">{errors.last_name[0]}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone[0]}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Position *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          required
                          placeholder="e.g., Professor, Associate Professor"
                        />
                        {errors.position && <div className="invalid-feedback">{errors.position[0]}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="is_active">
                        Active Faculty Member
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingFaculty ? 'Update' : 'Create'} Faculty Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;