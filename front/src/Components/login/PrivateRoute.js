import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children , url}) => {
  const token = localStorage.getItem('token'); // Vérifiez si le token est présent

  return token ? children : <Navigate to={url} />; // Si pas de token, redirection vers la page de login
};

export default PrivateRoute;
