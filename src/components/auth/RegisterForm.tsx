import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('이용약관에 동의해야 회원가입을 진행할 수 있습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password, nickname, termsAccepted });
      navigate('/login', { state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } });
    } catch (err) {
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="nickname" className="sr-only">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700">
              <p className="font-medium text-gray-900">이용약관 및 개인정보 처리방침</p>
              <div className="mt-2 max-h-40 overflow-y-auto leading-6">
                <p>시행일: 2026년 4월 28일</p>
                <p className="mt-3 font-medium text-gray-900">1. 수집하는 개인정보 항목</p>
                <p>
                  서비스 이용을 위해 이메일 주소와 비밀번호를 수집합니다. 이메일과
                  비밀번호는 Firebase 인증 시스템에 저장되며, 비밀번호는 암호화되어
                  관리자도 확인할 수 없습니다.
                </p>
                <p className="mt-3 font-medium text-gray-900">2. 자동 수집 및 서비스 이용 기록</p>
                <p>
                  서비스 품질 관리와 이용 내역 확인을 위해 검색 로그를 수집합니다.
                  검색 로그에는 사용자 식별값, 질문 내용, 검색 시각, 답변 요약 등이
                  포함될 수 있습니다.
                </p>
                <p className="mt-3 font-medium text-gray-900">3. 개인정보 수집 및 이용 목적</p>
                <p>
                  회원 식별, 로그인 처리, 학습 자료 검색 및 답변 제공, 크레딧 관리,
                  이용 내역 확인을 위해 개인정보와 검색 로그를 이용합니다.
                </p>
                <p className="mt-3 font-medium text-gray-900">4. 학습 데이터 사용 여부</p>
                <p>
                  본 서비스는 사용자의 질문, 검색 로그, 업로드 자료를 별도 모델 학습
                  목적으로 사용하지 않습니다.
                </p>
                <p className="mt-3 font-medium text-gray-900">5. 개인정보 보관 기간</p>
                <p>
                  회원 탈퇴 시 개인정보는 지체 없이 삭제합니다. 단, 관계 법령에 따라
                  보관이 필요한 정보는 해당 기간 동안 보관할 수 있습니다.
                </p>
                <p className="mt-3 font-medium text-gray-900">6. 개인정보 처리 위탁 및 국외 이전</p>
                <p>
                  본 서비스는 Google LLC의 Firebase를 이용하여 회원 인증, 데이터베이스
                  관리 및 서비스 인프라를 운영합니다. 이 과정에서 데이터가 Firebase
                  서버 소재지인 미국 등 국외 클라우드 환경으로 전송 및 저장될 수
                  있습니다.
                </p>
                <p className="mt-3 font-medium text-gray-900">7. 제3자 제공</p>
                <p>이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.</p>
                <p className="mt-3 font-medium text-gray-900">8. 이용자의 권리</p>
                <p>
                  이용자는 언제든지 자신의 정보 열람, 수정 또는 회원 탈퇴를 요청할 수
                  있으며, 요청 시 지체 없이 조치합니다.
                </p>
                <p className="mt-3 font-medium text-gray-900">9. 개인정보 보호 책임자</p>
                <p>이메일: nam2626@gmail.com</p>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !termsAccepted}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
