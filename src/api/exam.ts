import apiClient from './client';
import type { AnalysisResult } from '../types';

export const analyzeExam = async (image: File | undefined, query: string): Promise<AnalysisResult> => {
  const formData = new FormData();
  if (image) {
    formData.append('image', image);
  }
  formData.append('query', query);

  const response = await apiClient.post<AnalysisResult>('/api/exam/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
