import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.grade !== 2) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한 없음</h2>
          <p className="text-gray-600 mb-4">관리자만 접근할 수 있습니다.</p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
