import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';

import './App.css';
import CarbonTracker from './CarbonTracker.jsx';
import AuthPages from './Register.jsx';
import Nav from './Nav.jsx';
import CarbonSustainabilityApp from './SeasonalReminders.jsx';
import ChatWidget from './ChatWidget';

// Inline Logo component
const Logo = () => {
  return (
    <div className="flex justify-center p-4">
      <Link to="/" className="flex items-center">
        {/* Replace with your actual logo image */}
        <img
          src="/path-to-your-logo.png"
          alt="Carbon Footprint App Logo"
          className="h-12"
        />
      </Link>
    </div>
  );
};

// Layout component that conditionally renders Nav or Logo
const AppLayout = () => {
  const location = useLocation();
  // Check if the current path is either the root or register path
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';
  
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/register" element={<AuthPages />} /> {/* Add this if you have a separate register route */}
        <Route path="/home" element={<CarbonTracker />} />
        <Route path="/CarbonSustainabilityApp" element={<CarbonSustainabilityApp />} />
      </Routes>
      
      {/* Only show the ChatWidget when not on authentication pages */}
      {!isAuthPage && <ChatWidget />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;