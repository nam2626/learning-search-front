import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileSettings() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password !== passwordConfirm) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (password && password.length < 6) {
      setError('새 비밀번호는 6자 이상 입력해주세요.');
      return;
    }

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname && !password) {
      setError('수정할 닉네임 또는 새 비밀번호를 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        nickname: trimmedNickname || undefined,
        password: password || undefined,
      });
      setPassword('');
      setPasswordConfirm('');
      setMessage('회원 정보가 수정되었습니다.');
    } catch (err) {
      setError(getErrorMessage(err, '회원 정보 수정에 실패했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('정말 회원 탈퇴하시겠습니까? 계정 정보가 삭제됩니다.');
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError('');
    setMessage('');

    try {
      await deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, '회원 탈퇴에 실패했습니다.'));
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">회원 정보</h2>
        <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
      </div>

      {message && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profileNickname" className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <input
            id="profileNickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="profilePassword" className="block text-sm font-medium text-gray-700">
            새 비밀번호
          </label>
          <input
            id="profilePassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="변경할 때만 입력"
          />
        </div>

        <div>
          <label htmlFor="profilePasswordConfirm" className="block text-sm font-medium text-gray-700">
            새 비밀번호 확인
          </label>
          <input
            id="profilePasswordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="새 비밀번호 다시 입력"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving || isDeleting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '정보 수정'}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isSaving || isDeleting}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? '탈퇴 처리 중...' : '회원 탈퇴'}
          </button>
        </div>
      </form>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const detail = data.error || data.message;
      if (typeof detail === 'string' && detail.trim()) {
        return detail;
      }
    }
  }

  return fallback;
}
