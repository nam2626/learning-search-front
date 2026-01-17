import { useState } from 'react';
import type { UserCreditInfo } from '../../types';
import { setUserCredits } from '../../api/dashboard';

interface UserCreditsTableProps {
  users: UserCreditInfo[];
  onUpdate: () => void;
}

export default function UserCreditsTable({ users, onUpdate }: UserCreditsTableProps) {
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditStart = (user: UserCreditInfo) => {
    setEditingUid(user.uid);
    setEditValue(user.remainingCredits);
  };

  const handleEditCancel = () => {
    setEditingUid(null);
    setEditValue(0);
  };

  const handleEditSave = async (uid: string) => {
    setIsUpdating(true);
    try {
      await setUserCredits(uid, editValue);
      setEditingUid(null);
      onUpdate();
    } catch (err) {
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
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                남은 크레딧
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                마지막 리셋
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.nickname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingUid === user.uid ? (
                    <input
                      type="number"
                      min="0"
                      max={user.maxCredits}
                      value={editValue}
                      onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className={user.remainingCredits === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                      {user.remainingCredits} / {user.maxCredits}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastResetDate).toLocaleDateString('ko-KR')}
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
