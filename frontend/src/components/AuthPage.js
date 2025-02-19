import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AuthPage.css';
import API from './api';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false); 
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const toggleAuthMode = () => {
    setIsSignup((prevMode) => !prevMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isSignup) {
            const response = await API.post('/auth/register', {
                username: name,  
                email,
                password,
                role,
            });
            alert(response.data.message); 
        } else {
            const response = await API.post('/auth/login', {
                email,
                password,
            });
            const { token, role } = response.data; 
            localStorage.setItem('token', token);
            if (role === 'instructor') {
                navigate('/instructor-dashboard');
            } else if (role === 'student') {
                navigate('/student-dashboard');
            }
        }
    } catch (error) {
        console.error('Authentication failed', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Authentication failed. Please try again.');
    }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="role-selection">
          <button 
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleChange('student')}
          >
            Student
          </button>
          <button 
            className={`role-btn ${role === 'instructor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('instructor')}
          >
            Instructor
          </button>
        </div>

        <h2>{isSignup ? `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}` : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-btn">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="divider">OR</div>

        <p className="toggle-link">
          {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <span onClick={toggleAuthMode}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
