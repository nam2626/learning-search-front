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
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            학습 검색
          </Link>

          <nav className="flex items-center space-x-4">
            {user?.grade && user.grade >= 1 && (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  검색
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  대시보드
                </Link>
                <Link
                  to="/exam-analysis"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  이미지 + 검색
                </Link>
              </>
            )}
            {user?.grade === 2 && (
              <>
                <Link
                  to="/upload"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  업로드
                </Link>
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  회원관리
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  관리대시보드
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {user?.nickname || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
