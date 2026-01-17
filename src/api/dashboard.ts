import apiClient from './client';
import type { UserDashboard, UserCreditInfo, AdminSearchLog } from '../types';

export const getUserDashboard = async (): Promise<UserDashboard> => {
  const response = await apiClient.get('/api/user/dashboard');
  return response.data;
};

export const getAdminUsersCredits = async (): Promise<UserCreditInfo[]> => {
  const response = await apiClient.get('/api/admin/dashboard/users');
  return response.data;
};

export const getAdminSearchLogs = async (): Promise<AdminSearchLog[]> => {
  const response = await apiClient.get('/api/admin/dashboard/logs');
  return response.data;
};

export const setUserCredits = async (uid: string, credits: number): Promise<void> => {
  await apiClient.post(`/api/admin/users/${uid}/credits`, null, {
    params: { credits },
  });
};
