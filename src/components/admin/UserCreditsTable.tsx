import { useState } from 'react';
import type { UserCreditInfo } from '../../types';
import { setUserCredits } from '../../api/dashboard';

interface UserCreditsTableProps {
  users: UserCreditInfo[];
  onUpdate: () => void;
}

const MAX_EXAM_CREDITS = 10;
const MAX_THEORY_CREDITS = 20;

export default function UserCreditsTable({ users, onUpdate }: UserCreditsTableProps) {
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editTheoryCredits, setEditTheoryCredits] = useState(0);
  const [editExamCredits, setEditExamCredits] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditStart = (user: UserCreditInfo) => {
    setEditingUid(user.uid);
    setEditTheoryCredits(user.theoryCredits ?? 0);
    setEditExamCredits(user.examCredits ?? user.dailyCredits ?? 0);
  };

  const handleEditCancel = () => {
    setEditingUid(null);
    setEditTheoryCredits(0);
    setEditExamCredits(0);
  };

  const handleEditSave = async (uid: string) => {
    setIsUpdating(true);
    try {
      await setUserCredits(uid, editTheoryCredits, editExamCredits);
      setEditingUid(null);
      onUpdate();
    } catch {
      alert('크레딧 수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">회원 크레딧 현황</h3>
        <p className="text-gray-500 text-center py-8">회원 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">회원 크레딧 현황</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                남은 횟수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                총 사용량
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                마지막 활동
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  <p className="font-sans text-gray-900">
                    {user.username ?? user.uid ?? '알 수 없는 사용자'}
                  </p>
                  {user.username && (
                    <p className="mt-1 text-xs text-gray-500" title={user.uid}>
                      {user.uid.substring(0, 8)}...
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingUid === user.uid ? (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <span className="w-10 text-gray-700">이론</span>
                        <input
                          type="number"
                          min="0"
                          max={MAX_THEORY_CREDITS}
                          value={editTheoryCredits}
                          onChange={(e) => setEditTheoryCredits(
                            Math.min(MAX_THEORY_CREDITS, Math.max(0, Number(e.target.value)))
                          )}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-10 text-gray-700">문제</span>
                        <input
                          type="number"
                          min="0"
                          max={MAX_EXAM_CREDITS}
                          value={editExamCredits}
                          onChange={(e) => setEditExamCredits(
                            Math.min(MAX_EXAM_CREDITS, Math.max(0, Number(e.target.value)))
                          )}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className={(user.theoryCredits ?? 0) === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        이론: {user.theoryCredits ?? MAX_THEORY_CREDITS} / {MAX_THEORY_CREDITS}
                      </p>
                      <p className={(user.examCredits ?? user.dailyCredits) === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        문제: {user.examCredits ?? user.dailyCredits} / {MAX_EXAM_CREDITS}
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.totalUsage}회
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActiveDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingUid === user.uid ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSave(user.uid)}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleEditCancel}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditStart(user)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      수정
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
