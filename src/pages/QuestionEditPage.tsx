import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { updateQuestion } from '../api/board';
import QuestionForm from '../components/board/QuestionForm';
import { useQuestion } from '../hooks/useQuestion';
import { boardKeys } from '../hooks/useQuestions';
import { getBoardErrorMessage } from '../utils/boardError';

export default function QuestionEditPage() {
  const { questionId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const question = useQuestion(questionId);
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (value: { title: string; content: string }) => updateQuestion(questionId, { ...value, expectedUpdatedAt: question.data!.updatedAt }),
    onSuccess: (updated) => {
      queryClient.setQueryData(boardKeys.detail(questionId), updated);
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      navigate(`/board/${questionId}`);
    },
    onError: (reason) => setError(getBoardErrorMessage(reason)),
  });

  if (question.isLoading) return <div className="py-24 text-center text-slate-500">질문을 불러오는 중입니다...</div>;
  if (question.isError || !question.data) return <div className="py-24 text-center text-red-600">{getBoardErrorMessage(question.error)}</div>;
  if (!question.data.canEdit) return <Navigate to={`/board/${questionId}`} replace />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <button type="button" onClick={() => navigate(`/board/${questionId}`)} className="text-sm font-semibold text-slate-500 hover:text-slate-900">← 질문으로</button>
      <h1 className="mb-6 mt-5 text-3xl font-black text-slate-950">질문 수정</h1>
      <QuestionForm initialValue={{ title: question.data.title, content: question.data.content }} submitLabel="수정 저장" isSubmitting={mutation.isPending} serverError={error} onSubmit={(value) => { setError(null); mutation.mutate(value); }} onCancel={() => navigate(`/board/${questionId}`)} />
    </div>
  );
}
