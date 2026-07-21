import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/exam-analysis" className="text-xl font-bold text-gray-900">
            학습 도우미
          </Link>

          <nav className="flex items-center gap-2">
            {user?.grade && user.grade >= 1 && (
              <>
                <Link to="/dashboard" className="rounded-md px-3 py-2 text-gray-600 hover:text-gray-900">
                  대시보드
                </Link>
                <Link
                  to="/exam-analysis"
                  className="whitespace-nowrap rounded-md px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  질문 / 답변
                </Link>
                <Link
                  to="/function-dictionary"
                  className="whitespace-nowrap rounded-md px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  함수 사전
                </Link>
              </>
            )}
            {user?.grade === 2 && (
              <>
                <Link
                  to="/upload"
                  className="whitespace-nowrap rounded-md px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  업로드
                </Link>
                <Link
                  to="/admin"
                  className="whitespace-nowrap rounded-md px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  회원 관리
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="whitespace-nowrap rounded-md px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  관리자 대시보드
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/settings"
                  className="whitespace-nowrap rounded-md px-2 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  내 정보
                </Link>
                <span className="hidden text-gray-600 sm:inline">{user?.nickname || user?.email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="whitespace-nowrap rounded-md px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link to="/login" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                로그인
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
