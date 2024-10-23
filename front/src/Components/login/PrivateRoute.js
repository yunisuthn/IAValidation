import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // État pour l'authentification

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token'); // Récupère le token dans le localStorage
      console.log("Token trouvé:", token);
      
      if (token) {
        setIsAuthenticated(true); // L'utilisateur est authentifié si le token existe
      } else {
        setIsAuthenticated(false); // Aucun token, donc non authentifié
      }
    };

    // Appel immédiat pour vérifier l'authentification
    checkAuth();

    // Si le token change dans localStorage (ex. après login), mettez à jour l'état
    window.addEventListener('storage', checkAuth); // Écoute les changements dans le localStorage
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  console.log("isAuthenticated:", isAuthenticated);

  // Affiche un état de chargement pendant la vérification de l'authentification
  if (isAuthenticated === null) {
    return <div>Chargement...</div>; // Affichez un loader ou un texte temporaire
  }

  // Redirige si l'utilisateur n'est pas authentifié
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
