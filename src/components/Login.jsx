import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user information in localStorage for Categories component
        localStorage.setItem('userIdentifier', identifier); // Used by Categories component
        localStorage.setItem('username', data.username);    // Actual username from database
        localStorage.setItem('isLoggedIn', 'true');         // Login status
        localStorage.setItem('user', identifier);           // Keep your original storage for compatibility
        
        setMessage('✅ Login successful! Redirecting...');
        
        // Small delay to show success message
        setTimeout(() => {
          navigate('/'); // Redirect to home page
        }, 1000);
      } else {
        setMessage('❌ Invalid username or password, try logging in again!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">🔷 WealthPulse</div>
        <h2>Log in to WealthPulse</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email or Username</label>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={loading}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {message && (
          <p className={`login-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <p className="signup-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;