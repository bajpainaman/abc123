import React, { useState, useEffect } from 'react';
import { auth } from './Firebase';
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainApp from './components/MainApp';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage'; // Import the new UploadPage component

function App() {
  const [user, setUser] = useState(null); // Track authenticated user

  // Check user authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Protected routes */}
        <Route
          path="/"
          element={
            user ? <MainApp user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/upload"
          element={
            user ? <UploadPage user={user} /> : <Navigate to="/login" />
          }
        />
        {/* Public route */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : <LoginPage />
          }
        />
        {/* Redirect unknown routes to home or login */}
        <Route
          path="*"
          element={
            user ? <Navigate to="/" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
