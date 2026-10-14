import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createQuestion } from '../api/board';
import QuestionForm from '../components/board/QuestionForm';
import { boardKeys } from '../hooks/useQuestions';
import { getBoardErrorMessage } from '../utils/boardError';

export default function QuestionCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: (question) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      navigate(`/board/${question.id}`);
    },
    onError: (reason) => setError(getBoardErrorMessage(reason)),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <button type="button" onClick={() => navigate('/board')} className="text-sm font-semibold text-slate-500 hover:text-slate-900">← 게시판으로</button>
      <div className="mb-6 mt-5">
        <h1 className="text-3xl font-black text-slate-950">새 질문 작성</h1>
        <p className="mt-2 text-sm text-slate-600">상황과 시도한 방법을 자세히 적을수록 정확한 답변을 받을 수 있어요.</p>
      </div>
      <QuestionForm submitLabel="질문 등록" isSubmitting={mutation.isPending} serverError={error} onSubmit={(value) => { setError(null); mutation.mutate(value); }} onCancel={() => navigate('/board')} />
    </div>
  );
}
