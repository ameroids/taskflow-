import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import * as db from '../services/db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // full user profile record
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await authService.getSession();
      if (session) {
        const full = await db.getUserById(session.id);
        if (full && full.status !== 'inactive') {
          setUser(full);
        } else {
          if (full && full.status === 'inactive') {
            alert('You are inactive, kindly contact your admin.');
          }
          authService.logout();
        }
      }
      await new Promise((res) => setTimeout(res, 1000));
      setInitializing(false);
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    setInitializing(true);
    try {
      const session = await authService.login(username, password);
      const full = await db.getUserById(session.id);
      setUser(full);
      await new Promise(r => setTimeout(r, 1000));
      return full;
    } finally {
      setInitializing(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setInitializing(true);
    await new Promise(r => setTimeout(r, 1000));
    authService.logout();
    setUser(null);
    setInitializing(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const full = await db.getUserById(user.id);
    setUser(full);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout, refreshUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
