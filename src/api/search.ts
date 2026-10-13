import apiClient from './client';
import type { ConversationTurn } from '../types';

export const search = async (
  query: string,
  reference?: string,
  history: ConversationTurn[] = [],
): Promise<string> => {
  const response = await apiClient.post<unknown>('/api/search/conversation', {
    query,
    reference,
    history: history.slice(-3),
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
