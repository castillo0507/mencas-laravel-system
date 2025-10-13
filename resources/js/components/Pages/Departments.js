// resources/js/components/Pages/Departments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  
  // View state for showing courses
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentCourses, setDepartmentCourses] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadDepartments();
  }, [filters, refreshKey]);

  const loadDepartments = async () => {
    console.log('=== LOADING DEPARTMENTS ===');
    try {
      setLoading(true);
      
      // Clear existing departments first to prevent stale data
      setDepartments([]);
      
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      // Add cache-busting parameter to prevent cached responses
      params.append('_t', Date.now().toString());
      
      const response = await axios.get(`/api/departments?${params}`);
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      
      const departmentsData = response.data.data || [];
      console.log('Received departments count:', departmentsData.length);
      
      // Force state update
      setDepartments(() => {
        console.log('Setting departments state with:', departmentsData.length, 'items');
        return departmentsData;
      });
      
      setPagination({
        current_page: response.data.meta?.current_page || 1,
        last_page: response.data.meta?.last_page || 1,
        total: response.data.meta?.total || 0
      });
      
      console.log('Pagination total:', response.data.meta?.total);
      console.log('=== LOADING DEPARTMENTS COMPLETE ===');
      
    } catch (error) {
      console.error('=== ERROR LOADING DEPARTMENTS ===', error);
      console.error('Error details:', error.response?.data);
      setDepartments([]);
      alert('Failed to load departments: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadDepartmentCourses = async (departmentId) => {
    console.log('Loading courses for department:', departmentId);
    try {
      const response = await axios.get(`/api/departments/${departmentId}`);
      const department = response.data.data;
      setSelectedDepartment(department);
      setDepartmentCourses(department.courses || []);
      setShowCoursesModal(true);
    } catch (error) {
      console.error('Error loading department courses:', error);
      alert('Failed to load department courses');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: ''
    });
  };

  const forceRefresh = () => {
    console.log('=== MANUAL REFRESH TRIGGERED ===');
    setRefreshKey(prev => prev + 1);
  };

  const handleAddNew = () => {
    console.log('Opening add department modal...');
    setEditingDepartment(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (department) => {
    console.log('Editing department:', department);
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || '',
      is_active: department.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting department:', formData);
    
    try {
      if (editingDepartment) {
        await axios.put(`/api/departments/${editingDepartment.id}`, formData);
        alert('Department updated successfully');
      } else {
        const response = await axios.post('/api/departments', formData);
        console.log('Create response:', response.data);
        alert('Department created successfully');
      }
      
      setShowModal(false);
      forceRefresh(); // Refresh the list
    } catch (error) {
      console.error('Error saving department:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        alert('Validation errors:\n' + errorMessages.join('\n'));
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to save department');
      }
    }
  };

  const handleDelete = async (department) => {
    if (confirm(`Are you sure you want to delete the department "${department.name}"? This action cannot be undone.`)) {
      console.log('=== DELETE OPERATION START ===');
      console.log('Deleting department ID:', department.id);
      console.log('Current departments count before delete:', departments.length);
      
      try {
        // Delete from server first
        const response = await axios.delete(`/api/departments/${department.id}`);
        console.log('Server delete response:', response.data);
        
        // Then immediately update the UI by removing the item
        setDepartments(currentDepartments => {
          console.log('Current departments before filter:', currentDepartments.length);
          const filtered = currentDepartments.filter(item => {
            const keep = item.id !== department.id;
            if (!keep) {
              console.log('Removing department with ID:', item.id);
            }
            return keep;
          });
          console.log('Departments after filter:', filtered.length);
          return filtered;
        });
        
        // Force a complete refresh by updating the refresh key
        console.log('=== FORCING COMPLETE REFRESH ===');
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
        }, 300);
        
        alert('Department deleted successfully');
        console.log('=== DELETE OPERATION SUCCESS ===');
        
      } catch (error) {
        console.error('=== DELETE OPERATION ERROR ===', error);
        
        if (error.response?.status === 404) {
          alert('Department not found - it may have already been deleted');
          forceRefresh();
        } else if (error.response?.data?.message) {
          alert('Failed to delete department: ' + error.response.data.message);
        } else {
          alert('Failed to delete department. Please try again.');
        }
      }
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 'bg-success' : 'bg-secondary';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold text-dark">Department Management</h1>
              <p className="text-muted">
                Manage departments, add new departments, and view courses 
                <small className="badge bg-info ms-2">
                  {departments.length} departments | Refresh: {refreshKey}
                </small>
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={forceRefresh}
                title="Force Refresh List"
              >
                <i className="fas fa-sync-alt me-2"></i>
                Force Refresh
              </button>
              <button 
                className="btn btn-primary d-flex align-items-center"
                onClick={handleAddNew}
              >
                <i className="fas fa-plus me-2"></i>
                Add Department
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by department name or code..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-building fa-3x text-muted mb-3"></i>
              <p className="text-muted">No departments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Department</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Students</th>
                    <th>Faculty</th>
                    <th>Courses</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(department => (
                    <tr key={department.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{department.name}</div>
                          <small className="text-muted">{department.description || 'No description'}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{department.code}</span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(department.is_active)}`}>
                          {getStatusText(department.is_active)}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info">{department.students_count || 0}</span>
                      </td>
                      <td>
                        <span className="badge bg-success">{department.faculty_count || 0}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-link p-0"
                          onClick={() => loadDepartmentCourses(department.id)}
                          title="View Courses"
                        >
                          <span className="badge bg-primary">{department.courses_count || 0} courses</span>
                        </button>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEdit(department)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(department)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handleFilterChange('page', pagination.current_page - 1)}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">{pagination.current_page} of {pagination.last_page}</span>
                  </li>
                  <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handleFilterChange('page', pagination.current_page + 1)}>
                      Next
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
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Department Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter department name"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Department Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        placeholder="Enter department code (e.g., CS, ENG, MATH)"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter department description (optional)"
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="is_active"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="is_active">
                          Active Department
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingDepartment ? 'Update' : 'Create'} Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Courses Modal */}
      {showCoursesModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Courses in {selectedDepartment?.name}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCoursesModal(false)}></button>
              </div>
              <div className="modal-body">
                {departmentCourses.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-book fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No courses found in this department</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Course Code</th>
                          <th>Course Name</th>
                          <th>Credits</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentCourses.map(course => (
                          <tr key={course.id}>
                            <td>
                              <span className="badge bg-light text-dark">{course.code}</span>
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium">{course.name}</div>
                                <small className="text-muted">{course.description || 'No description'}</small>
                              </div>
                            </td>
                            <td>{course.credits} credits</td>
                            <td>
                              <span className={`badge ${course.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                {course.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCoursesModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;