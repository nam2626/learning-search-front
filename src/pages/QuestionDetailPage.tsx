import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  acceptAnswer,
  cancelAcceptedAnswer,
  createAnswer,
  deleteAnswer,
  deleteQuestion,
  updateAnswer,
} from '../api/board';
import AnswerForm from '../components/board/AnswerForm';
import AnswerItem from '../components/board/AnswerItem';
import ConfirmDialog from '../components/board/ConfirmDialog';
import StatusBadge from '../components/board/StatusBadge';
import { useQuestion } from '../hooks/useQuestion';
import { boardKeys } from '../hooks/useQuestions';
import type { Answer } from '../types/board';
import { getBoardErrorMessage } from '../utils/boardError';

type DeleteTarget = { type: 'question' } | { type: 'answer'; answer: Answer } | null;

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function QuestionDetailPage() {
  const { questionId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const question = useQuestion(questionId);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(questionId) }),
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() }),
    ]);
  };

  const answerCreate = useMutation({
    mutationFn: (content: string) => createAnswer(questionId, { content }),
    onSuccess: refresh,
    onError: (reason) => setActionError(getBoardErrorMessage(reason)),
  });
  const answerUpdate = useMutation({
    mutationFn: ({ answer, content }: { answer: Answer; content: string }) =>
      updateAnswer(questionId, answer.id, { content, expectedUpdatedAt: answer.updatedAt }),
    onSuccess: refresh,
    onError: (reason) => setActionError(getBoardErrorMessage(reason)),
  });
  const answerAccept = useMutation({
    mutationFn: (answerId: string) => acceptAnswer(questionId, answerId),
    onSuccess: refresh,
    onError: (reason) => setActionError(getBoardErrorMessage(reason)),
  });
  const acceptCancel = useMutation({
    mutationFn: () => cancelAcceptedAnswer(questionId),
    onSuccess: refresh,
    onError: (reason) => setActionError(getBoardErrorMessage(reason)),
  });
  const removal = useMutation({
    mutationFn: async (target: Exclude<DeleteTarget, null>) => {
      if (target.type === 'question') return deleteQuestion(questionId);
      return deleteAnswer(questionId, target.answer.id);
    },
    onSuccess: async (_, target) => {
      setDeleteTarget(null);
      if (target.type === 'question') {
        await queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
        navigate('/board');
        return;
      }
      await refresh();
    },
    onError: (reason) => setActionError(getBoardErrorMessage(reason)),
  });

  if (question.isLoading) {
    return <div className="py-24 text-center text-slate-500">질문을 불러오는 중입니다...</div>;
  }
  if (question.isError || !question.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-red-600">{getBoardErrorMessage(question.error)}</p>
        <Link to="/board" className="mt-5 inline-block font-semibold text-blue-600">목록으로 돌아가기</Link>
      </div>
    );
  }

  const data = question.data;
  const isPending = answerUpdate.isPending || answerAccept.isPending || acceptCancel.isPending || removal.isPending;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <Link to="/board" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← 질문 목록</Link>

        <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <StatusBadge status={data.status} />
              <h1 className="mt-4 break-words text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{data.title}</h1>
              <p className="mt-3 text-sm text-slate-500">{data.authorNickname} · {formatDate(data.createdAt)}</p>
            </div>
            {(data.canEdit || data.canDelete) && (
              <div className="flex gap-2">
                {data.canEdit && <Link to={`/board/${questionId}/edit`} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">수정</Link>}
                {data.canDelete && <button type="button" onClick={() => setDeleteTarget({ type: 'question' })} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">삭제</button>}
              </div>
            )}
          </div>
          <div className="mt-7 border-t border-slate-100 pt-7">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-slate-700">{data.content}</p>
          </div>
        </article>

        <section className="mt-8" aria-labelledby="answers-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="answers-heading" className="text-xl font-black text-slate-950">답변 {data.answerCount}개</h2>
            {data.status === 'RESOLVED' && <span className="text-sm font-semibold text-emerald-700">해결된 질문입니다</span>}
          </div>

          {actionError && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>}

          <div className="space-y-4">
            {data.answers.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">아직 답변이 없습니다. 첫 답변을 남겨 보세요.</div>}
            {data.answers.map((answer) => (
              <AnswerItem
                key={answer.id}
                answer={answer}
                isPending={isPending}
                error={answerUpdate.isError ? actionError : null}
                canCancelAccept={data.canEdit}
                onUpdate={async (target, content) => {
                  setActionError(null);
                  await answerUpdate.mutateAsync({ answer: target, content });
                }}
                onDelete={(target) => setDeleteTarget({ type: 'answer', answer: target })}
                onAccept={(target) => { setActionError(null); answerAccept.mutate(target.id); }}
                onCancelAccept={() => { setActionError(null); acceptCancel.mutate(); }}
              />
            ))}
          </div>

          <div className="mt-6">
            <AnswerForm
              isSubmitting={answerCreate.isPending}
              error={answerCreate.isError ? actionError : null}
              onSubmit={async (content) => {
                setActionError(null);
                await answerCreate.mutateAsync(content);
              }}
            />
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget?.type === 'question' ? '질문을 삭제할까요?' : '답변을 삭제할까요?'}
        description={deleteTarget?.type === 'question' ? '질문과 등록된 답변이 모두 삭제되며 되돌릴 수 없습니다.' : '삭제한 답변은 복구할 수 없습니다.'}
        isPending={removal.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && removal.mutate(deleteTarget)}
      />
    </div>
  );
}
