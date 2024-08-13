// ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, roles }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:4000/protected', { withCredentials: true });
        if (response.data.isAuthenticated && response.data.user) {
          setIsAuthenticated(true);
          setUserRole(response.data.user.role); // Assuming the role is sent in the response
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          navigate('/auth/signin');
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
        //console.error("Error checking authentication status", error);
        navigate('/auth/signin');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated && roles && !roles.includes(userRole)) {
      navigate('/404'); // Redirect to a "Forbidden" page or similar
    }
  }, [isAuthenticated, roles, userRole, navigate]);

  return isAuthenticated && roles && roles.includes(userRole) ? children : null;
};

export default ProtectedRoute;
