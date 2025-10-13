// resources/js/components/Layout/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;