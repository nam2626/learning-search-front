import apiClient from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

export const deleteAccount = async (): Promise<void> => {
  await apiClient.delete('/api/auth/delete');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};
