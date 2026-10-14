import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '../api/board';
import type { QuestionListParams } from '../types/board';

export const boardKeys = {
  all: ['board'] as const,
  lists: () => [...boardKeys.all, 'list'] as const,
  list: (params: QuestionListParams) => [...boardKeys.lists(), params] as const,
  details: () => [...boardKeys.all, 'detail'] as const,
  detail: (questionId: string) => [...boardKeys.details(), questionId] as const,
};

export function useQuestions(params: QuestionListParams) {
  return useQuery({
    queryKey: boardKeys.list(params),
    queryFn: () => getQuestions(params),
    placeholderData: (previousData) => previousData,
  });
}
