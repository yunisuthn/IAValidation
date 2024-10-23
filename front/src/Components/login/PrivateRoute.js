import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State for authentication

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log("Token found:", token);
    
    // Update authentication state based on token presence
    setIsAuthenticated(!!token); // Convert token to boolean (true if exists, false if not)

  }, []); // Run only once on mount

  console.log("isAuthenticated:", isAuthenticated);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Display a loader or temporary text
  }

  // Redirect if user is not authenticated
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
