import apiClient from './client';

export const search = async (query: string): Promise<string> => {
  const response = await apiClient.get<any>('/api/search', { params: { query } });
  
  // Handle { answer: "..." } object response
  if (response.data && typeof response.data === 'object' && 'answer' in response.data) {
    return response.data.answer;
  }
  
  // Handle raw string response
  if (typeof response.data === 'string') {
    return response.data;
  }
  
  // Handle other object structures (fallback)
  return typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : String(response.data);
};