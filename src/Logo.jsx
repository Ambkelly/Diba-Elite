// Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

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

export default Logo;