// resources/js/components/Pages/Students.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    enrollment_date: '',
    status: 'active',
    department_id: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, [currentPage, searchTerm, filterDepartment, filterStatus]);

  const fetchStudents = async () => {
    try {
      const params = {
        page: currentPage,
        search: searchTerm,
        department_id: filterDepartment,
        status: filterStatus
      };
      
      const response = await axios.get('/api/students', { params });
      setStudents(response.data.data || []);
      setTotalPages(response.data.meta?.last_page || 1);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (editingStudent) {
        await axios.put(`/api/students/${editingStudent.id}`, formData);
        alert('Student updated successfully!');
      } else {
        await axios.post('/api/students', formData);
        alert('Student created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone || '',
      date_of_birth: student.date_of_birth || '',
      enrollment_date: student.enrollment_date,
      status: student.status,
      department_id: student.department_id
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      enrollment_date: '',
      status: 'active',
      department_id: ''
    });
    setEditingStudent(null);
    setErrors({});
  };

  const handleDelete = async (student) => {
    if (!confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`)) {
      return;
    }

    try {
      await axios.delete(`/api/students/${student.id}`);
      alert('Student deleted successfully!');
      fetchStudents();
    } catch (error) {
      alert('Error deleting student');
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Student Management</h5>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <i className="fas fa-plus me-2"></i>Add Student
              </button>
            </div>

            <div className="card-body">
              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterDepartment}
                    onChange={(e) => {
                      setFilterDepartment(e.target.value);
                      setCurrentPage(1);
                    }}
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
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Students Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.student_id}</td>
                          <td>{student.first_name} {student.last_name}</td>
                          <td>{student.email}</td>
                          <td>{student.phone || 'N/A'}</td>
                          <td>{student.department?.name || 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              student.status === 'active' ? 'bg-success' :
                              student.status === 'graduated' ? 'bg-primary' :
                              student.status === 'suspended' ? 'bg-danger' : 'bg-secondary'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(student)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(student)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No students found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                      >
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
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simple Add/Edit Student Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Student ID *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
                      value={formData.student_id}
                      onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                      required
                      placeholder="S-2024-01"
                    />
                    {errors.student_id && <div className="invalid-feedback">{errors.student_id[0]}</div>}
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

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone[0]}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date of Birth *</label>
                        <input
                          type="date"
                          className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                          required
                        />
                        {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth[0]}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Enrollment Date *</label>
                        <input
                          type="date"
                          className={`form-control ${errors.enrollment_date ? 'is-invalid' : ''}`}
                          value={formData.enrollment_date}
                          onChange={(e) => setFormData({...formData, enrollment_date: e.target.value})}
                          required
                        />
                        {errors.enrollment_date && <div className="invalid-feedback">{errors.enrollment_date[0]}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
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
                            <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                          ))}
                        </select>
                        {errors.department_id && <div className="invalid-feedback">{errors.department_id[0]}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Status *</label>
                        <select
                          className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="graduated">Graduated</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {editingStudent ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingStudent ? 'Update Student' : 'Create Student'
                    )}
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

export default Students;