import { useEffect, useState } from 'react';
import CreditCard from '../components/dashboard/CreditCard';
import RecentQueries from '../components/dashboard/RecentQueries';
import { getUserDashboard } from '../api/dashboard';
import type { UserDashboard } from '../types';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getUserDashboard();
        setDashboard(data);
      } catch (err) {
        setError('대시보드 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">내 대시보드</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {dashboard?.credit && <CreditCard credit={dashboard.credit} />}
          </div>

          <div className="lg:col-span-2">
            {dashboard?.recentQueries && <RecentQueries queries={dashboard.recentQueries} />}
          </div>
        </div>
      </div>
    </div>
  );
}
