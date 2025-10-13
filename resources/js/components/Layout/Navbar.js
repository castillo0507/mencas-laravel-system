// resources/js/components/Layout/Navbar.js
import React, { useState } from 'react';
import { useAuth } from '../../router-new';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style={{ height: '60px' }}>
      <div className="container-fluid">
        {/* Mobile menu button */}
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          style={{ border: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Spacer */}
        <div className="flex-grow-1"></div>

        {/* User dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-link text-decoration-none d-flex align-items-center"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ color: '#495057' }}
          >
            <div
              className="bg-primary text-white d-flex align-items-center justify-content-center me-2"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '12px'
              }}
            >
              <i className="fas fa-user"></i>
            </div>
            <span className="fw-semibold">{user?.name || 'Admin'}</span>
            <i className="fas fa-chevron-down ms-2 small"></i>
          </button>

          {showDropdown && (
            <ul
              className="dropdown-menu dropdown-menu-end show"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 1000
              }}
            >
              <li>
                <a className="dropdown-item d-flex align-items-center" href="/profile">
                  <i className="fas fa-user me-2 text-muted"></i>
                  My Profile
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-2 text-muted"></i>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;