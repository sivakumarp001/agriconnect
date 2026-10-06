import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Protected({ children, roles }) {
  const { user, loading } = useAuth();

  // If user is already stored in localStorage and loaded into state, render immediately without flashing loading state
  if (loading && !user) {
    return null;
  }

  return !user ? <Navigate to="/login" /> : roles && !roles.includes(user.role) ? <Navigate to="/dashboard" /> : children;
}
