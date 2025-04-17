import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import CarbonTracker from './CarbonTracker.jsx';
import AuthPages from './Register.jsx';
import CarbonSustainabilityApp from './SeasonalReminders.jsx';
import ChatWidget from './ChatWidget';

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPages mode="login" />} />
        <Route path="/register" element={<AuthPages mode="register" />} />
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