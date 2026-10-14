import { useState } from 'react';
import type { Answer } from '../../types/board';
import AnswerForm from './AnswerForm';

interface AnswerItemProps {
  answer: Answer;
  isPending: boolean;
  error?: string | null;
  onUpdate: (answer: Answer, content: string) => void | Promise<void>;
  onDelete: (answer: Answer) => void;
  onAccept: (answer: Answer) => void;
  onCancelAccept: () => void;
  canCancelAccept: boolean;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function AnswerItem({ answer, isPending, error, onUpdate, onDelete, onAccept, onCancelAccept, canCancelAccept }: AnswerItemProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <AnswerForm
        initialValue={answer.content}
        submitLabel="수정 저장"
        isSubmitting={isPending}
        error={error}
        onSubmit={async (content) => {
          await onUpdate(answer, content);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${answer.accepted ? 'border-emerald-300 ring-4 ring-emerald-50' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{answer.authorNickname}</span>
            {answer.accepted && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">✓ 채택된 답변</span>}
          </div>
          <p className="mt-1 text-xs text-slate-400">{formatDate(answer.createdAt)}{answer.updatedAt !== answer.createdAt ? ' · 수정됨' : ''}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {answer.canAccept && <button type="button" onClick={() => onAccept(answer)} disabled={isPending} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">답변 채택</button>}
          {answer.accepted && canCancelAccept && <button type="button" onClick={onCancelAccept} disabled={isPending} className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">채택 취소</button>}
          {answer.canEdit && <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">수정</button>}
          {answer.canDelete && <button type="button" onClick={() => onDelete(answer)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">삭제</button>}
        </div>
      </div>
      <p className="mt-5 whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-700">{answer.content}</p>
    </article>
  );
}
