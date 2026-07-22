import type { AdminSearchLog } from '../../types';

interface SearchLogsTableProps {
  logs: AdminSearchLog[];
}

const formatKoreanTime = (timestamp?: string) => {
  if (!timestamp) return '-';

  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);
  const date = new Date(hasTimezone ? timestamp : `${timestamp}Z`);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
};

export default function SearchLogsTable({ logs }: SearchLogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">검색 로그</h3>
        <p className="text-gray-500 text-center py-8">검색 로그가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">검색 로그 (최근 100건)</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                검색 시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                질문
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                답변 요약
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={`${log.uid ?? 'unknown'}-${log.timestamp ?? index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatKoreanTime(log.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <p className="text-gray-900">
                    {log.username ?? log.uid ?? '알 수 없는 사용자'}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <p className="truncate max-w-md" title={log.question ?? '-'}>
                    {log.question ?? '-'}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <p className="max-w-md">{log.answerSummary ?? '-'}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
