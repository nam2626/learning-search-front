import { useState, type FormEvent } from 'react';
import type { QuestionInput } from '../../types/board';
import MarkdownEditor from './MarkdownEditor';

interface QuestionFormProps {
  initialValue?: QuestionInput;
  submitLabel: string;
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (value: QuestionInput) => void;
  onCancel: () => void;
}

export default function QuestionForm({ initialValue, submitLabel, isSubmitting, serverError, onSubmit, onCancel }: QuestionFormProps) {
  const [title, setTitle] = useState(initialValue?.title || '');
  const [content, setContent] = useState(initialValue?.content || '');
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();
    if (normalizedTitle.length < 5) return setError('제목은 5자 이상 입력해 주세요.');
    if (normalizedContent.length < 10) return setError('본문은 10자 이상 입력해 주세요.');
    if (normalizedContent.length > 5000) return setError('본문은 5,000자 이하로 입력해 주세요.');
    setError(null);
    onSubmit({ title: normalizedTitle, content: normalizedContent });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="question-title" className="text-sm font-semibold text-slate-800">제목</label>
          <span className="text-xs text-slate-400">{title.length}/100</span>
        </div>
        <input id="question-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} disabled={isSubmitting} placeholder="무엇이 궁금한지 한눈에 알 수 있게 적어주세요" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50" />
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <span id="question-content-label" className="text-sm font-semibold text-slate-800">질문 내용</span>
          <span className="text-xs text-slate-400">{content.length}/5,000</span>
        </div>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          label="질문 내용"
          placeholder="시도한 방법, 오류 메시지, 원하는 결과를 함께 적으면 더 좋은 답변을 받을 수 있어요."
          minHeight="340px"
          disabled={isSubmitting}
        />
        <p className="mt-2 text-xs text-slate-500">WYSIWYG로 작성하거나 하단의 Markdown 탭에서 원문을 편집할 수 있습니다.</p>
      </div>
      {(error || serverError) && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error || serverError}</p>}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">취소</button>
        <button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
