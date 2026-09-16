import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, UserPortfolioRecord } from '../types/auth';
import { CustomPortfolioData } from '../types/portfolioBuilder';
import { apiClient } from '../services/apiClient';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (...args: any[]) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (...args: any[]) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  authNotification: string | null;
  setAuthNotification: (msg: string | null) => void;
  userPortfolio: UserPortfolioRecord | null;
  refreshUserPortfolio: () => Promise<void>;
  saveUserPortfolio: (data: CustomPortfolioData, markPublished?: boolean) => Promise<UserPortfolioRecord | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authNotification, setAuthNotification] = useState<string | null>(null);
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolioRecord | null>(null);

  const checkCurrentUser = useCallback(async () => {
    try {
      if (!apiClient.getToken()) {
        setUser(null);
        setUserPortfolio(null);
        setIsLoading(false);
        return;
      }

      const res = await apiClient.getMe();
      if (res.success && res.user) {
        const fullUser = {
          ...res.user,
          name: res.user.fullName,
        };
        setUser(fullUser);
        setUserPortfolio(res.portfolio || null);
      } else {
        setUser(null);
        setUserPortfolio(null);
        apiClient.setToken(null);
      }
    } catch {
      setUser(null);
      setUserPortfolio(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  const refreshUserPortfolio = useCallback(async () => {
    try {
      const res = await apiClient.getUserPortfolio();
      if (res.success) {
        setUserPortfolio(res.portfolio);
      }
    } catch (e) {
      console.error('Erreur refresh portfolio', e);
    }
  }, []);

  const login = useCallback(async (...args: any[]): Promise<{ success: boolean; error?: string }> => {
    let email = '';
    let password = '';
    if (typeof args[0] === 'object' && args[0] !== null) {
      email = args[0].email;
      password = args[0].password;
    } else {
      email = args[0];
      password = args[1];
    }

    try {
      const res = await apiClient.login(email, password);
      if (res.success && res.user) {
        const fullUser = { ...res.user, name: res.user.fullName };
        setUser(fullUser);
        setUserPortfolio(res.portfolio || null);
        return { success: true };
      }
      return { success: false, error: res.error || 'Identifiants incorrects' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Identifiants incorrects' };
    }
  }, []);

  // Private Admin login (calls dedicated rate-limited /api/admin/login)
  const adminLogin = useCallback(async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiClient.adminLogin(identifier, password);
      if (res.success && res.user) {
        const fullUser = { ...res.user, name: res.user.fullName };
        setUser(fullUser);
        // Refresh admin portfolio
        const portRes = await apiClient.getAdminMyPortfolio().catch(() => null);
        if (portRes && portRes.portfolio) {
          setUserPortfolio(portRes.portfolio);
        }
        return { success: true };
      }
      return { success: false, error: res.error || 'Identifiants incorrects.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Identifiants incorrects.' };
    }
  }, []);

  const register = useCallback(async (...args: any[]): Promise<{ success: boolean; error?: string }> => {
    let fullName = '';
    let email = '';
    let password = '';
    if (typeof args[0] === 'object' && args[0] !== null) {
      fullName = args[0].name || args[0].fullName;
      email = args[0].email;
      password = args[0].password;
    } else {
      fullName = args[0];
      email = args[1];
      password = args[2];
    }

    try {
      const res = await apiClient.register(fullName, email, password);
      if (res.success && res.user) {
        const fullUser = { ...res.user, name: res.user.fullName };
        setUser(fullUser);
        setUserPortfolio(res.portfolio || null);
        return { success: true };
      }
      return { success: false, error: res.error || 'Erreur d’inscription' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur d’inscription' };
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.logout();
    setUser(null);
    setUserPortfolio(null);
    setAuthNotification(null);
  }, []);

  const saveUserPortfolio = useCallback(async (data: CustomPortfolioData, markPublished: boolean = false): Promise<UserPortfolioRecord | null> => {
    try {
      const status = markPublished ? 'published' : (userPortfolio?.status || 'draft');
      const res = await apiClient.saveUserPortfolio(data, status);
      if (res.success && res.portfolio) {
        setUserPortfolio(res.portfolio);
        return res.portfolio;
      }
      return null;
    } catch (err) {
      console.error('Erreur sauvegarde portfolio', err);
      return null;
    }
  }, [userPortfolio?.status]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        adminLogin,
        register,
        logout,
        authNotification,
        setAuthNotification,
        userPortfolio,
        refreshUserPortfolio,
        saveUserPortfolio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
