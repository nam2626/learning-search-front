import { useState, type FormEvent } from 'react';
import type { QuestionSort, QuestionStatus } from '../../types/board';

interface QuestionFiltersProps {
  query: string;
  status?: QuestionStatus;
  sort: QuestionSort;
  onChange: (filters: { query: string; status?: QuestionStatus; sort: QuestionSort }) => void;
}

export default function QuestionFilters({ query, status, sort, onChange }: QuestionFiltersProps) {
  const [searchText, setSearchText] = useState(query);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onChange({ query: searchText.trim(), status, sort });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <form onSubmit={submit} className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <label htmlFor="board-search" className="sr-only">질문 검색</label>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400" aria-hidden="true">⌕</span>
          <input
            id="board-search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            minLength={2}
            placeholder="제목과 본문에서 검색해 보세요"
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <label className="sr-only" htmlFor="board-status">답변 상태</label>
        <select
          id="board-status"
          value={status || ''}
          onChange={(event) => onChange({
            query: searchText.trim(),
            status: (event.target.value || undefined) as QuestionStatus | undefined,
            sort,
          })}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="">전체 상태</option>
          <option value="WAITING">답변 대기</option>
          <option value="ANSWERED">답변 있음</option>
          <option value="RESOLVED">해결됨</option>
        </select>
        <label className="sr-only" htmlFor="board-sort">정렬</label>
        <select
          id="board-sort"
          value={sort}
          onChange={(event) => onChange({ query: searchText.trim(), status, sort: event.target.value as QuestionSort })}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="LATEST">최신순</option>
          <option value="ANSWERS_ASC">답변 적은 순</option>
          <option value="ANSWERS_DESC">답변 많은 순</option>
        </select>
        <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200">
          검색
        </button>
      </form>
    </div>
  );
}
