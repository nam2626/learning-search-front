import type { SearchLog } from '../../types';

interface RecentQueriesProps {
  logs: SearchLog[];
}

export default function RecentQueries({ logs }: RecentQueriesProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 질문 내역</h3>
        <p className="text-gray-500 text-center py-8">아직 질문 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 질문 및 답변 내역</h3>

      <div className="space-y-4">
        {logs.map((log, index) => (
          <details
            key={`${log.timestamp}-${index}`}
            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium text-gray-900">{log.query}</p>
                  {!log.answerSummary && (
                    <p className="mt-1 text-sm text-gray-500">저장된 답변 내용이 없습니다.</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('ko-KR')}
                </span>
              </div>
            </summary>
            {log.answerSummary && (
              <div className="mt-3 rounded-md bg-gray-50 p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                {log.answerSummary}
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}
