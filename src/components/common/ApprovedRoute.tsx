import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ApprovedRoute({ children }: { children: React.ReactNode }) {
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

  if (user?.grade === undefined || user.grade < 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">계정 승인 대기 중</h2>
          <p className="text-gray-600 mb-4">
            관리자의 승인을 기다리고 있습니다.
            <br />
            승인 후 서비스를 이용하실 수 있습니다.
          </p>
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            로그아웃
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
