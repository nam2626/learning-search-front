import { useState, useEffect } from 'react';
import UserCreditsTable from '../components/admin/UserCreditsTable';
import SearchLogsTable from '../components/admin/SearchLogsTable';
import { getAdminUsersCredits, getAdminSearchLogs } from '../api/dashboard';
import type { UserCreditInfo, AdminSearchLog } from '../types';

type TabType = 'credits' | 'logs';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('credits');
  const [usersCredits, setUsersCredits] = useState<UserCreditInfo[]>([]);
  const [searchLogs, setSearchLogs] = useState<AdminSearchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [credits, logs] = await Promise.all([
        getAdminUsersCredits(),
        getAdminSearchLogs(),
      ]);
      setUsersCredits(credits);
      setSearchLogs(logs);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [
    { id: 'credits' as TabType, label: '회원 크레딧' },
    { id: 'logs' as TabType, label: '검색 로그' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="mt-2 text-gray-600">크레딧 사용량 및 검색 로그 모니터링</p>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'credits' && (
              <UserCreditsTable users={usersCredits} onUpdate={fetchData} />
            )}
            {activeTab === 'logs' && <SearchLogsTable logs={searchLogs} />}
          </>
        )}
      </div>
    </div>
  );
}
