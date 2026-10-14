import { useState, type FormEvent } from 'react';
import MarkdownEditor from './MarkdownEditor';

interface AnswerFormProps {
  initialValue?: string;
  submitLabel?: string;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (content: string) => void | Promise<void>;
  onCancel?: () => void;
}

export default function AnswerForm({ initialValue = '', submitLabel = '답변 등록', isSubmitting, error, onSubmit, onCancel }: AnswerFormProps) {
  const [content, setContent] = useState(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = content.trim();
    if (normalized.length < 2) {
      setValidationError('답변은 2자 이상 입력해 주세요.');
      return;
    }
    if (normalized.length > 5000) {
      setValidationError('답변은 5,000자 이하로 입력해 주세요.');
      return;
    }
    setValidationError(null);
    try {
      await onSubmit(normalized);
      if (!initialValue) setContent('');
    } catch {
      // 서버 오류는 상위 컴포넌트가 전달하는 error 메시지로 표시한다.
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-900">{initialValue ? '답변 수정' : '답변 남기기'}</span>
        <span className="text-xs text-slate-400">{content.length}/5,000</span>
      </div>
      <MarkdownEditor
        value={content}
        onChange={setContent}
        label={initialValue ? '답변 수정' : '답변 남기기'}
        placeholder="알고 있는 해결 방법을 구체적으로 공유해 주세요."
        minHeight={initialValue ? '220px' : '260px'}
        disabled={isSubmitting}
      />
      {(validationError || error) && <p role="alert" className="mt-3 text-sm text-red-600">{validationError || error}</p>}
      <div className="mt-4 flex justify-end gap-3">
        {onCancel && <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">취소</button>}
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? '저장 중...' : submitLabel}</button>
      </div>
    </form>
  );
}
