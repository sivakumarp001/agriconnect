import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const C = createContext();

export const useAuth = () => useContext(C);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((r) => {
        setUser(r.data.user);
        localStorage.user = JSON.stringify(r.data.user);
      })
      .catch(() => {
        localStorage.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (data) => {
    localStorage.token = data.token;
    localStorage.user = JSON.stringify(data.user);
    setUser(data.user);
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return <C.Provider value={{ user, loading, login, logout, setUser }}>{children}</C.Provider>;
}
