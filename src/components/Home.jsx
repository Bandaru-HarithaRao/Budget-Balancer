import React from 'react';
import './Home.css';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="branding">
          {/*<div className="logo"></div>*/}
          <h1>WealthPulse</h1>
          <p className="tagline">Track. Budget. Grow.</p>
        </div>
        
        <div className="cards">
          <Link to="/category" className="card no-underline">
            <div className="icon">💰</div>
            <h3>Track Daily Expenses</h3>
            <p>Easily monitor and manage your daily spending.</p>
            <button>Learn more</button>
          </Link>
          
          <Link to="/dashboard" className="card no-underline">
            <div className="icon">📈</div>
            <h3>Visualize with Charts</h3>
            <p>Gain insights into your finances through charts</p>
            <button>Learn more</button>
          </Link>
          
          <div className="card">
            <div className="icon">🔔</div>
            <h3>Get Budget Alerts</h3>
            <p>Stay informed when you exceed your budget</p>
            <button>Learn more</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;