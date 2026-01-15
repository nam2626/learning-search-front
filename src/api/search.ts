import apiClient from './client';

export const search = async (query: string): Promise<string> => {
  const response = await apiClient.get('/api/search', {
    params: { query },
  });
  return response.data;
};
