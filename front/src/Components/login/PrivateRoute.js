import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate(); // Initialize navigate hook
  const { userLoggedIn } = useAuth();

  useEffect(() => {
    if (userLoggedIn === false) {
      // Redirect to login if not authenticated
      navigate('/');
    }
  }, [userLoggedIn, navigate]);

  // Render Outlet if authenticated
  return (
    <>
      { userLoggedIn && children}
    </>
  );
};

export default PrivateRoute;
