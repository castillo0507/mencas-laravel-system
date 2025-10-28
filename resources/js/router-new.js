// resources/js/router-new.js //
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import components //
import Login from './components/Auth/Login';
import RegisterAdmin from './components/Pages/RegisterAdmin';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Pages/Dashboard';
import Faculty from './components/Pages/Faculty';
import FacultyCreate from './components/Pages/FacultyCreate';
import FacultyEdit from './components/Pages/FacultyEdit';
import Students from './components/Pages/Students';
import StudentsCreate from './components/Pages/StudentsCreate';
import StudentsEdit from './components/Pages/StudentsEdit';
import Courses from './components/Pages/Courses';
import Departments from './components/Pages/Departments';
import Reports from './components/Pages/Reports';
import Profile from './components/Pages/Profile';
import ArchiveFiles from './components/Pages/ArchiveFiles';
import AcademicYears from './components/Pages/AcademicYears';

// Auth Context //
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider //
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Set axios defaults //
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getCurrentUser = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token: authToken, user: userData } = response.data;
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('auth_token', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component //
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (for login page when already authenticated) //
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Main App Router //
export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route
            path="/register-admin"
            element={
              <PublicRoute>
                <RegisterAdmin />
              </PublicRoute>
            }
          />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/faculty" element={<Faculty />} />
                    <Route path="/faculty/create" element={<FacultyCreate />} />
                    <Route path="/faculty/:id/edit" element={<FacultyEdit />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/students/create" element={<StudentsCreate />} />
                    <Route path="/students/:id/edit" element={<StudentsEdit />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/academic-years" element={<AcademicYears />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/archives" element={<ArchiveFiles />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}