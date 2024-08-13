// RedirectIfAuthenticated.js
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated,userRole } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      if(userRole == 'admin'){
        navigate('/dashboard', { replace: true });
      }else if(userRole == 'client'){
        navigate('/user/addorder', { replace: true });
      }else if(userRole == 'assistance'){
        navigate('/chat/staff', { replace: true });
      }else if(userRole == 'technician'){
        navigate('/admin/allshapes', { replace: true });
      }else{
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? children : null;
};

export default RedirectIfAuthenticated;
