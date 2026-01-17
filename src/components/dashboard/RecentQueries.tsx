import type { SearchLog } from '../../types';

interface RecentQueriesProps {
  queries: SearchLog[];
}

export default function RecentQueries({ queries }: RecentQueriesProps) {
  if (queries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 질문 내역</h3>
        <p className="text-gray-500 text-center py-8">아직 질문 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 질문 내역</h3>

      <div className="space-y-4">
        {queries.map((log) => (
          <div key={log.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium text-gray-900">{log.query}</p>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                {new Date(log.createdAt).toLocaleString('ko-KR')}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{log.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
