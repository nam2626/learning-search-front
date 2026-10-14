import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import QuestionFilters from '../components/board/QuestionFilters';
import QuestionList from '../components/board/QuestionList';
import { useQuestions } from '../hooks/useQuestions';
import { getBoardErrorMessage } from '../utils/boardError';
import type { QuestionSort, QuestionStatus } from '../types/board';

export default function BoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
  const query = searchParams.get('query') || '';
  const status = (searchParams.get('status') || undefined) as QuestionStatus | undefined;
  const sort = (searchParams.get('sort') || 'LATEST') as QuestionSort;
  const params = useMemo(() => ({ limit: 20, cursor, query: query || undefined, status, sort }), [cursor, query, status, sort]);
  const questions = useQuestions(params);

  const changeFilters = (filters: { query: string; status?: QuestionStatus; sort: QuestionSort }) => {
    const next = new URLSearchParams();
    if (filters.query) next.set('query', filters.query);
    if (filters.status) next.set('status', filters.status);
    if (filters.sort !== 'LATEST') next.set('sort', filters.sort);
    setCursor(undefined);
    setCursorHistory([]);
    setSearchParams(next);
  };

  const nextPage = () => {
    if (!questions.data?.nextCursor) return;
    setCursorHistory((history) => [...history, cursor]);
    setCursor(questions.data.nextCursor || undefined);
  };

  const previousPage = () => {
    const previous = cursorHistory.at(-1);
    setCursorHistory((history) => history.slice(0, -1));
    setCursor(previous);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Community Q&amp;A</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">함께 해결하는 학습 질문</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">막힌 부분을 구체적으로 남기고, 다른 학습자의 경험으로 해결해 보세요.</p>
          </div>
          <Link to="/board/new" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700">+ 질문하기</Link>
        </div>

        <QuestionFilters key={`${query}-${status || 'ALL'}-${sort}`} query={query} status={status} sort={sort} onChange={changeFilters} />

        <div className="mt-5" aria-live="polite">
          {questions.isLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">질문을 불러오는 중입니다...</div>
          )}
          {questions.isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm font-medium text-red-700">{getBoardErrorMessage(questions.error)}</p>
              <button type="button" onClick={() => questions.refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">다시 시도</button>
            </div>
          )}
          {questions.data && <QuestionList questions={questions.data.items} />}
        </div>

        {questions.data && (cursorHistory.length > 0 || questions.data.hasNext) && (
          <nav className="mt-6 flex items-center justify-center gap-3" aria-label="질문 목록 페이지">
            <button type="button" onClick={previousPage} disabled={cursorHistory.length === 0 || questions.isFetching} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">이전</button>
            <span className="px-2 text-sm text-slate-500">{cursorHistory.length + 1} 페이지</span>
            <button type="button" onClick={nextPage} disabled={!questions.data.hasNext || questions.isFetching} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">다음</button>
          </nav>
        )}
      </div>
    </div>
  );
}
