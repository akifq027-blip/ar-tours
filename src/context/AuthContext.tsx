import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthLoginResponse, Verify2FAResponse, Resend2FAResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStaffOrAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthLoginResponse>;
  verify2FA: (sessionId: string, otp: string) => Promise<Verify2FAResponse>;
  resend2FA: (sessionId: string) => Promise<Resend2FAResponse>;
  register: (
    fullNameOrObj: string | { full_name?: string; fullName?: string; email: string; phone?: string; password: string },
    email?: string,
    phone?: string,
    password?: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (fullName: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ar_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('ar_auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        localStorage.removeItem('ar_auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<AuthLoginResponse> => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.token && res.user) {
        localStorage.setItem('ar_auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (sessionId: string, otp: string): Promise<Verify2FAResponse> => {
    setIsLoading(true);
    try {
      const res = await api.verify2FA({ two_factor_session_id: sessionId, otp });
      if (res.token && res.user) {
        localStorage.setItem('ar_auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const resend2FA = async (sessionId: string): Promise<Resend2FAResponse> => {
    return await api.resend2FA({ two_factor_session_id: sessionId });
  };

  const register = async (
    fullNameOrObj: string | { full_name?: string; fullName?: string; email: string; phone?: string; password: string },
    email?: string,
    phone?: string,
    password?: string
  ) => {
    setIsLoading(true);
    try {
      let payload: { full_name: string; email: string; phone?: string; password: string };

      if (typeof fullNameOrObj === 'object') {
        payload = {
          full_name: fullNameOrObj.full_name || fullNameOrObj.fullName || '',
          email: fullNameOrObj.email || '',
          phone: fullNameOrObj.phone || '',
          password: fullNameOrObj.password || '',
        };
      } else {
        payload = {
          full_name: fullNameOrObj,
          email: email || '',
          phone: phone || '',
          password: password || '',
        };
      }

      const res = await api.register(payload);
      if (res.token && res.user) {
        localStorage.setItem('ar_auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ar_auth_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (fullName: string, phone: string) => {
    const res = await api.updateProfile({ full_name: fullName, phone });
    setUser(res.user);
  };

  const isAdmin = user?.role === 'admin';
  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isStaffOrAdmin,
        login,
        verify2FA,
        resend2FA,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
