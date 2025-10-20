// resources/js/components/Pages/Courses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import toastConfirm from '../../utils/toastConfirm';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department_id: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, [currentPage, searchTerm, filterDepartment, filterStatus]);

  const fetchCourses = async (page = currentPage) => {
    try {
      const params = {
        page,
        search: searchTerm,
        department_id: filterDepartment,
        status: filterStatus
      };
      
      console.log('Fetching courses with params:', params);
      const response = await axios.get('/api/courses', { params });
      console.log('Courses API response:', response.data);
  setCourses(response.data.data || []);
  setTotalPages(response.data.meta?.last_page || 1);
  // keep currentPage in sync with the page we requested
  setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching courses:', error);
      console.error('Courses API error details:', error.response);
      setCourses([]);
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please refresh and login again.');
      } else {
        toast.error(`Error loading courses: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments for courses...');
      const response = await axios.get('/api/departments');
      console.log('Departments API response for courses:', response.data);
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching departments for courses:', error);
      console.error('Departments API error details:', error.response);
      if (error.response?.status === 401) {
        toast.error('Authentication required for departments. Please refresh and login again.');
      } else {
        toast.error(`Error loading departments: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      let response;
      if (editingCourse) {
        response = await axios.put(`/api/courses/${editingCourse.id}`, formData);
      } else {
        response = await axios.post('/api/courses', formData);
      }

      const saved = response?.data?.data || response?.data || null;

      setShowModal(false);
      setEditingCourse(null);
      resetForm();

      if (editingCourse) {
        // update the course in-place if it's visible on the current page
        if (saved && saved.id) {
          setCourses((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
        }
        toast.success('Course updated successfully');
      } else {
        // after creating a new course, show page 1 and reload so the new item appears
        toast.success('Course created successfully');
        await fetchCourses(1);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const errs = error.response.data.errors || {};
        setErrors(errs);
        const messages = Object.values(errs).flat();
        if (messages.length) {
          toast.error(messages.join('; '));
        }
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('An error occurred while saving the course. See console for details.');
        console.error('Course save error:', error);
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description || '',
      department_id: course.department_id,
      is_active: course.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (course) => {
    const ok = await toastConfirm(`Are you sure you want to delete ${course.name}?`, { okText: 'Delete', cancelText: 'Cancel' });
    if (!ok) return;

    try {
      await axios.delete(`/api/courses/${course.id}`);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting course');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      department_id: '',
      is_active: true
    });
    setErrors({});
  };

  const handleAddNew = () => {
    console.log('Opening add new course modal');
    console.log('Available departments:', departments);
    setEditingCourse(null);
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
            <h1 className="h3 mb-0 text-gray-800">Courses Management</h1>
            <button className="btn btn-primary" onClick={handleAddNew}>
              <i className="fas fa-plus me-2"></i>
              Add Course
            </button>
          </div>

          {/* Filters */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search courses..."
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

          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <tr key={course.id}>
                          <td>{course.name}</td>
                          <td>{course.department?.name || 'N/A'}</td>
                          <td>
                            <span className={`badge ${course.is_active ? 'bg-success' : 'bg-secondary'}`}>
                              {course.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(course)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(course)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Courses pagination">
                  <ul className="pagination justify-content-center">
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Course Code and Credits removed per request */}
                  
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Course Name *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                      </div>
                    </div>
                    <div className="col-md-4">
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

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description[0]}</div>}
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
                        Active Course
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
                    {editingCourse ? 'Update' : 'Create'} Course
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

export default Courses;