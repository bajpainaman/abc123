import React from 'react';
import './Loader.css'; // Import the associated CSS file

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
