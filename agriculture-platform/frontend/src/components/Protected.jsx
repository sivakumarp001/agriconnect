import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Protected({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return !user ? <Navigate to="/login" /> : roles && !roles.includes(user.role) ? <Navigate to="/dashboard" /> : children;
}
