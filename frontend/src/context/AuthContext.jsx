import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const { data } = await authService.getMe();
      setUser(data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    toast.success('Welcome back!');
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    toast.success('Account created!');
    return data.data.user;
  };

  const logout = async () => {
    await authService.logout();
    setAccessToken(null);
    setUser(null);
    toast.success('Logged out.');
  };

  const updateUserLocal = (updates) => setUser((prev) => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserLocal, refetch: bootstrap }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
