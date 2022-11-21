import React from "react";
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem('accessToken');
    
  if (!token) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" state={{ from: '' }} />
  }
  // authorized so return child components
  return children;
}

export default PrivateRoute;