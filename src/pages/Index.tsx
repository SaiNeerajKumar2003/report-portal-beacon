
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from '@/components/auth/LoginPage';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    // Redirect based on user role
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return <LoginPage />;
};

export default Index;
