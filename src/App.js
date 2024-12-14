import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import StockAnalysis from './pages/StockAnalysis';
import Predictions from './pages/Predictions';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import Blog from './pages/Blog';
import MainLayout from './layouts/MainLayout';
import './styles/components.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<StockAnalysis />} />
          <Route path="/technical" element={<TechnicalAnalysis />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/blog" element={<Blog />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
