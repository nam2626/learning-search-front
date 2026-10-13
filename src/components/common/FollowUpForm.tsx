import { useState, type FormEvent } from 'react';

interface Props {
  onSubmit: (query: string) => void;
  onReset: () => void;
  isLoading: boolean;
  resetLabel: string;
}

export default function FollowUpForm({ onSubmit, onReset, isLoading, resetLabel }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setQuery('');
  };

  return (
    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="follow-up-query" className="block text-sm font-medium text-gray-800">
          후속 질문
        </label>
        <textarea
          id="follow-up-query"
          rows={3}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="방금 답변에서 더 궁금한 내용을 입력하세요."
          disabled={isLoading}
          maxLength={2000}
          className="block w-full resize-none rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-600">후속 질문은 크레딧이 차감되지 않습니다.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              disabled={isLoading}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {resetLabel}
            </button>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? '답변 중' : '후속 질문하기'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
