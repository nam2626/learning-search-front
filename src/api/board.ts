import apiClient from './client';
import type {
  Answer,
  AnswerInput,
  AnswerUpdateInput,
  QuestionDetail,
  QuestionInput,
  QuestionListParams,
  QuestionPage,
  QuestionUpdateInput,
} from '../types/board';

export async function getQuestions(params: QuestionListParams): Promise<QuestionPage> {
  const response = await apiClient.get<QuestionPage>('/api/board/questions', { params });
  return response.data;
}

export async function getQuestion(questionId: string): Promise<QuestionDetail> {
  const response = await apiClient.get<QuestionDetail>(`/api/board/questions/${questionId}`);
  return response.data;
}

export async function createQuestion(input: QuestionInput): Promise<QuestionDetail> {
  const response = await apiClient.post<QuestionDetail>('/api/board/questions', input);
  return response.data;
}

export async function updateQuestion(
  questionId: string,
  input: QuestionUpdateInput,
): Promise<QuestionDetail> {
  const response = await apiClient.put<QuestionDetail>(`/api/board/questions/${questionId}`, input);
  return response.data;
}

export async function deleteQuestion(questionId: string): Promise<void> {
  await apiClient.delete(`/api/board/questions/${questionId}`);
}

export async function createAnswer(questionId: string, input: AnswerInput): Promise<Answer> {
  const response = await apiClient.post<Answer>(`/api/board/questions/${questionId}/answers`, input);
  return response.data;
}

export async function updateAnswer(
  questionId: string,
  answerId: string,
  input: AnswerUpdateInput,
): Promise<Answer> {
  const response = await apiClient.put<Answer>(
    `/api/board/questions/${questionId}/answers/${answerId}`,
    input,
  );
  return response.data;
}

export async function deleteAnswer(questionId: string, answerId: string): Promise<void> {
  await apiClient.delete(`/api/board/questions/${questionId}/answers/${answerId}`);
}

export async function acceptAnswer(questionId: string, answerId: string): Promise<QuestionDetail> {
  const response = await apiClient.put<QuestionDetail>(
    `/api/board/questions/${questionId}/accepted-answer/${answerId}`,
  );
  return response.data;
}

export async function cancelAcceptedAnswer(questionId: string): Promise<QuestionDetail> {
  const response = await apiClient.delete<QuestionDetail>(
    `/api/board/questions/${questionId}/accepted-answer`,
  );
  return response.data;
}
