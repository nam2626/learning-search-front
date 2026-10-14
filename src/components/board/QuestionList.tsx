import { Link } from 'react-router-dom';
import type { QuestionSummary } from '../../types/board';
import StatusBadge from './StatusBadge';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    .format(new Date(value));
}

export default function QuestionList({ questions }: { questions: QuestionSummary[] }) {
  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl" aria-hidden="true">?</div>
        <h2 className="text-lg font-semibold text-slate-900">조건에 맞는 질문이 없습니다</h2>
        <p className="mt-2 text-sm text-slate-500">검색 조건을 바꾸거나 첫 질문을 남겨보세요.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <ul className="divide-y divide-slate-100">
        {questions.map((question) => (
          <li key={question.id}>
            <Link to={`/board/${question.id}`} className="group block px-5 py-5 transition hover:bg-slate-50 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={question.status} />
                    <span className="text-xs font-medium text-slate-500">답변 {question.answerCount}</span>
                  </div>
                  <h2 className="break-words text-base font-semibold text-slate-900 transition group-hover:text-blue-700 sm:text-lg">
                    {question.title}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500 sm:flex-col sm:items-end">
                  <span className="font-medium text-slate-700">{question.authorNickname}</span>
                  <span>{formatDate(question.createdAt)}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
