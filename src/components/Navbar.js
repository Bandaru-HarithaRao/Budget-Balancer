import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // ✅ Clear user session
    setUser(null); // ✅ Update state
    navigate('/'); // ✅ Redirect to Home
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/category">Categories</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="welcome-msg">Welcome {user}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Log In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
