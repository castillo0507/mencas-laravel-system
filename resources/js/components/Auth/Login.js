// resources/js/components/Auth/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../router-new';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          {/* Left Side - Login Form */}
          <div className="col-lg-5 col-md-6">
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '60px 40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '60px',
                width: '40px',
                height: '40px',
                background: '#5D7FBD',
                borderRadius: '50%'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '-20px',
                width: '60px',
                height: '60px',
                background: '#5D7FBD',
                borderRadius: '50%',
                opacity: '0.8'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '40px',
                width: '30px',
                height: '30px',
                background: '#5D7FBD',
                borderRadius: '50%',
                opacity: '0.7'
              }}></div>

              <div className="text-left mb-5">
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '10px',
                  lineHeight: '1.2'
                }}>
                  Admin<br />
                  <span style={{ color: '#5D7FBD' }}>Dashboard</span>
                </h1>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#7f8c8d',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Username
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#f8f9fa'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#5D7FBD';
                      e.target.style.backgroundColor = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1';
                      e.target.style.backgroundColor = '#f8f9fa';
                    }}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="mb-4">
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#7f8c8d',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '15px 50px 15px 20px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '12px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4ecdc4';
                        e.target.style.backgroundColor = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ecf0f1';
                        e.target.style.backgroundColor = '#f8f9fa';
                      }}
                      placeholder="Enter your password"
                    />
                    <i className="fas fa-eye" style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#bdc3c7',
                      cursor: 'pointer'
                    }}></i>
                  </div>
                </div>

                <div className="text-right mb-4">
                  <a href="#" style={{
                    color: '#5D7FBD',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Forgot Password?
                  </a>
                </div>

                {error && (
                  <div className="alert alert-danger mb-4" style={{
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#5D7FBD',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #5D7FBD 0%, #5D7FBD 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      LOGIN
                      <i className="fas fa-arrow-right ms-2"></i>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                  Don't have an account? 
                </span>
                <a href="#" style={{
                  color: '#5D7FBD',
                  textDecoration: 'none',
                  fontWeight: '600',
                  marginLeft: '5px'
                }}>
                  REGISTER
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Image Placeholder */}
          <div className="col-lg-6 d-none d-lg-block">
            <div style={{
              marginLeft: '40px',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #5D7FBD 0%, #5D7FBD 100%)',
                borderRadius: '20px',
                padding: '80px 60px',
                color: 'white',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '15px',
                  padding: '40px',
                  marginBottom: '30px'
                }}>
                  <i className="fas fa-graduation-cap" style={{
                    fontSize: '4rem',
                    color: 'white'
                  }}></i>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  Student & Faculty<br />Management System
                </h3>
                <p style={{
                  fontSize: '1rem',
                  opacity: '0.9',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}>
                  Manage your educational institution with ease.<br />
                  Track students, faculty, and academic progress all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;