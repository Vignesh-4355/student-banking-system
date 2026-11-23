import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('studentbank_token');
      const storedUser = localStorage.getItem('studentbank_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse cached user data', e);
      localStorage.removeItem('studentbank_token');
      localStorage.removeItem('studentbank_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    if (res.success && res.data) {
      const authData = res.data;
      setToken(authData.token);
      setUser(authData);
      localStorage.setItem('studentbank_token', authData.token);
      localStorage.setItem('studentbank_user', JSON.stringify(authData));
      return authData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (registerData) => {
    const res = await axiosClient.post('/auth/register', registerData);
    if (res.success && res.data) {
      const authData = res.data;
      setToken(authData.token);
      setUser(authData);
      localStorage.setItem('studentbank_token', authData.token);
      localStorage.setItem('studentbank_user', JSON.stringify(authData));
      return authData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const verifyOtp = async (email, otp) => {
    const res = await axiosClient.post('/auth/verify-otp', { email, otp });
    if (res.success) {
      if (user) {
        const updatedUser = { ...user, isEmailVerified: true };
        setUser(updatedUser);
        localStorage.setItem('studentbank_user', JSON.stringify(updatedUser));
      }
      return true;
    }
    throw new Error(res.message || 'Verification failed');
  };

  const resendOtp = async (email) => {
    return await axiosClient.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
  };

  const forgotPassword = async (email) => {
    return await axiosClient.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (email, otp, newPassword) => {
    return await axiosClient.post('/auth/reset-password', { email, otp, newPassword });
  };

  const refreshProfile = async () => {
    try {
      const res = await axiosClient.get('/students/profile');
      if (res.success && res.data) {
        const profile = res.data;
        setUser((prev) => ({
          ...prev,
          fullName: profile.fullName,
          walletBalance: profile.walletBalance,
          accountNumber: profile.accountNumber,
          upiId: profile.upiId,
          collegeName: profile.collegeName,
          profileImageUrl: profile.profileImageUrl,
        }));
        return profile;
      }
    } catch (err) {
      console.warn('Could not refresh student profile', err);
    }
    return null;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('studentbank_token');
    localStorage.removeItem('studentbank_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        refreshProfile,
        setUser,
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
