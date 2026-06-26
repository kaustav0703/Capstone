import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../utils/api.js';

const AuthPage = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Route protection toggle: redirect users away if they are already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // View state tracking toggles (true = Login panel, false = Registration panel)
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form input bindings
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  // Status feedback hooks for messages and error tracking
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setAvatar('');
    setErrorMessage('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        // --- 1. PROCESS SIGN-IN BACKEND TRANSACTION ---
        const response = await API.post('/auth/login', { email, password });
        login(response.data); // Stores the user profile parameters inside global context
        navigate('/');
      } else {
        // --- 2. PROCESS REGISTRATION BACKEND TRANSACTION ---
        const response = await API.post('/auth/register', {
          username,
          email,
          password,
          avatar: avatar.trim() !== '' ? avatar : undefined,
        });

        setSuccessMessage(response.data.message || 'Registration successful!');
        
        // Automatically switch view panel contexts to login mode after a brief timeout delay
        setTimeout(() => {
          setIsLoginMode(true);
          resetFormFields();
          setSuccessMessage('');
        }, 2000);
      }
    } catch (error) {
      // Safely capture and extract custom server error validation payload strings
      const errorMsg = error.response?.data?.message || 'An unexpected authentication error occurred.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-view-canvas">
      <div className="auth-form-card">
        <div className="auth-card-header">
          <h2>{isLoginMode ? 'Sign In to ViewTube' : 'Create an Account'}</h2>
          <p>{isLoginMode ? 'Access your personal channel and dashboard tools' : 'Start sharing videos and writing comments'}</p>
        </div>

        {/* Dynamic Client Notification Alerts Banner Layout */}
        {errorMessage && <div className="auth-alert status-error">{errorMessage}</div>}
        {successMessage && <div className="auth-alert status-success">{successMessage}</div>}

        <form onSubmit={handleFormSubmit} className="auth-inputs-form">
          {!isLoginMode && (
            <div className="form-input-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a public display identifier"
                required={!isLoginMode}
              />
            </div>
          )}

          <div className="form-input-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-input-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter minimum 6 characters"
              required
            />
          </div>

          {!isLoginMode && (
            <div className="form-input-group">
              <label htmlFor="avatar">Profile Avatar URL (Optional)</label>
              <input
                type="url"
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="auth-submit-action-btn">
            {isSubmitting ? 'Processing request...' : isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-card-footer">
          <p>
            {isLoginMode ? "New to ViewTube? " : "Already have an account? "}
            <button
              type="button"
              className="toggle-view-link"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                resetFormFields();
              }}
            >
              {isLoginMode ? 'Create an account here' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
