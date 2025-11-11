// resources/js/components/Layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/faculty', icon: 'fas fa-chalkboard-teacher', label: 'Faculty' },
  { path: '/students', icon: 'fas fa-user-graduate', label: 'Students' },
  { path: '/courses', icon: 'fas fa-book', label: 'Courses' },
      { path: '/departments', icon: 'fas fa-building', label: 'Departments' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' }
  ];

  return (
    <div 
      className="bg-primary text-white d-flex flex-column"
      style={{ 
        width: '250px',
        background: 'linear-gradient(135deg, #667eea 0%, #5D7FBD 100%)',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}
    >
      {/* Brand */}
      <div className="p-4 text-center border-bottom border-white border-opacity-25">
        <div 
          className="d-inline-flex align-items-center justify-content-center text-white mb-2"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '60px',
            height: '60px'
          }}
        >
          <i className="fas fa-graduation-cap fa-2x"></i>
        </div>
        <h4 className="fw-bold mb-0">ADMIN</h4>
        <small className="text-white-50">Dashboard</small>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow-1 py-3">
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li className="nav-item px-3 py-1" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded ${
                  isActive(item.path) ? 'bg-white bg-opacity-25' : ''
                }`}
                style={{
                  transition: 'all 0.2s ease',
                  ':hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-top border-white border-opacity-25">
        <div className="text-center">
          <small className="text-white-50">
            © IT-31 Mendoza-Castillo Laravel System
          </small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;