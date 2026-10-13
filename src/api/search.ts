import apiClient from './client';

export const search = async (query: string, reference?: string): Promise<string> => {
  const response = await apiClient.get<unknown>('/api/search', {
    params: reference ? { query, reference } : { query },
  });
  const data = response.data;

  // Handle { answer: "..." } object response
  if (data && typeof data === 'object' && 'answer' in data) {
    const answer = (data as { answer?: unknown }).answer;
    if (typeof answer === 'string') {
      return answer;
    }
  }

  // Handle raw string response
  if (typeof data === 'string') {
    return data;
  }

  // Handle other object structures (fallback)
  return typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
};
