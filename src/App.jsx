import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import CarbonTracker from './CarbonTracker.jsx';
import AuthPages from './Register.jsx';
import Nav from './Nav.jsx'; 
import CarbonSustainabilityApp from "./SeasonalReminders.jsx"
function App() {
  return (
    <Router>
      <Nav />
      <Routes>
      <Route path="/" element={<AuthPages />} />
        <Route path="/home" element={<CarbonTracker />} />
        <Route path="/CarbonSustainabilityApp" element={<CarbonSustainabilityApp />} />
      </Routes>
    </Router>
  );
}

export default App;
