import { apiClient } from './client';
import type { MemberListResponse } from '../types';

export const getMembers = async (pageToken?: string): Promise<MemberListResponse> => {
  const params = pageToken ? { pageToken } : {};
  const response = await apiClient.get('/api/admin/members', { params });
  return response.data;
};

export const updateMemberGrade = async (uid: string, grade: number): Promise<void> => {
  await apiClient.put(`/api/admin/members/${uid}/grade`, null, {
    params: { grade },
  });
};
