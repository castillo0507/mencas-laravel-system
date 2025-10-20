// resources/js/components/Pages/Students.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import toastConfirm from '../../utils/toastConfirm';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [currentPage, searchTerm, filterCourse, filterStatus]);

  const fetchStudents = async () => {
    try {
      const params = { page: currentPage };

      if (searchTerm && searchTerm.trim() !== '') {
        params.search = searchTerm;
      }
      // Only send course/status when a specific filter is selected. Empty string means 'All'.
      if (filterCourse && String(filterCourse).trim() !== '') {
        params.course_id = filterCourse;
      }
      if (filterStatus && String(filterStatus).trim() !== '') {
        params.status = filterStatus;
      }

      const response = await axios.get('/api/students', { params });
      // be defensive: support older responses and avoid TypeErrors when server returns error
      const payload = response?.data ?? response;
      const list = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      const studentsData = list.map((student) => ({
        ...student,
        course_name: student.course?.name || 'N/A',
      }));

      setStudents(studentsData);
      setTotalPages(payload?.meta?.last_page || 1);
    } catch (error) {
      console.error('Error fetching students:', error);
      // show a helpful alert when fetch fails
  const message = error.response?.data?.message || error.message || 'Error fetching students';
  toast.error(message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      toast.error('Error fetching courses');
    }
  };

  

  const handleEdit = (student) => {
    // navigate to edit page for the student
    navigate(`/students/${student.id}/edit`);
  };

  

  const handleDelete = async (student) => {
    const ok = await toastConfirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`, { okText: 'OK', cancelText: 'Cancel' });
    if (!ok) return;

    try {
      await axios.delete(`/api/students/${student.id}`);
      toast.success('Student deleted successfully!');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting student');
    }
  };

  const handleArchive = async (student) => {
    const ok = await toastConfirm(`Are you sure you want to archive ${student.first_name} ${student.last_name}?`, { okText: 'Archive', cancelText: 'Cancel' });
    if (!ok) return;

    try {
  // Use lightweight archive endpoint to avoid triggering full-update validation
  await axios.patch(`/api/students/${student.id}/archive`, { archived: true });
      toast.success('Student archived');
      fetchStudents();
    } catch (error) {
      console.error('Error archiving student:', error);
      toast.error(error.response?.data?.message || 'Error archiving student');
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
              <div className="d-flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/students/create')}
              >
                <i className="fas fa-plus me-2"></i>Add Student
              </button>
              <a href="/archives" className="btn btn-outline-secondary">
                <i className="fas fa-archive me-2"></i>Archive
              </a>
              </div>
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
                    value={filterCourse}
                    onChange={(e) => {
                      setFilterCourse(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                      <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
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
                      <th>Course</th>
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
                          <td>{student.course_name}</td>
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
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleArchive(student)}
                                title="Archive"
                              >
                                <i className="fas fa-archive"></i>
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

      
    </div>
  );
};

export default Students;