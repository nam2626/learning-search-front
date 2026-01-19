import axios from 'axios';
import apiClient from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

const API_BASE_URL = 'https://nam3324.synology.me:32902';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/register`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

export const deleteAccount = async (): Promise<void> => {
  await apiClient.delete('/api/auth/delete');
};

export const getCurrentUser = async (token?: string): Promise<User> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const authToken = token || localStorage.getItem('token');
  if (authToken && authToken !== 'null' && authToken !== 'undefined') {
    headers.Authorization = `Bearer ${authToken}`;
  }
  const response = await axios.get(`${API_BASE_URL}/api/auth/me`, { headers });
  return response.data;
};
