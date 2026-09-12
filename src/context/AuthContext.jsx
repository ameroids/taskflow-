import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import * as db from '../services/db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // full user profile record
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      const session = authService.getSession();
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
      setInitializing(false);
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    const session = await authService.login(username, password);
    const full = await db.getUserById(session.id);
    setUser(full);
    return full;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
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
