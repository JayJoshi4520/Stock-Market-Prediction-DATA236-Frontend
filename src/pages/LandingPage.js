import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Real-Time Stock Market
            <span className="gradient-text"> Analytics</span>
          </h1>
          <p className="hero-subtitle">
            Track, analyze, and make informed decisions with our comprehensive stock market dashboard
          </p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
            <span className="btn-arrow">→</span>
          </button>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Real-Time Data</h3>
            <p>Live stock prices and market updates every minute</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Technical Analysis</h3>
            <p>Advanced charts and technical indicators</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Stock Screening</h3>
            <p>Powerful tools to find the best trading opportunities</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access your dashboard anywhere, anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 