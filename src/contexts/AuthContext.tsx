import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types';
import * as authApi from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
        try {
          const userData = await authApi.getCurrentUser(storedToken);
          setToken(storedToken);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data);
    const newToken = response.token;

    setToken(newToken);
    localStorage.setItem('token', newToken);

    if (response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } else {
      const userData = await authApi.getCurrentUser(newToken);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const register = async (data: RegisterRequest) => {
    await authApi.register(data);
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    const updatedUser = await authApi.updateProfile(data);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const deleteAccount = async () => {
    // 서버가 회원 및 연관 데이터 삭제를 모두 완료한 뒤에만
    // 클라이언트의 인증 정보를 제거한다. 실패 시에는 로그인 상태를
    // 유지해 사용자가 오류를 확인하고 다시 시도할 수 있어야 한다.
    await authApi.deleteAccount();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        updateProfile,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
