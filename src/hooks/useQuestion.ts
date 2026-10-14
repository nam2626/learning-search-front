import { useQuery } from '@tanstack/react-query';
import { getQuestion } from '../api/board';
import { boardKeys } from './useQuestions';

export function useQuestion(questionId: string) {
  return useQuery({
    queryKey: boardKeys.detail(questionId),
    queryFn: () => getQuestion(questionId),
    enabled: Boolean(questionId),
  });
}
