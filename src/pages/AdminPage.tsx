import { useState, useEffect, useMemo } from 'react';
import { deleteMember, getMembers, updateMemberGrade } from '../api/admin';
import type { Member } from '../types';
import { MemberGrade } from '../types';

type SortField = 'createdAt' | 'nickname' | 'email' | 'grade';
type SortDirection = 'asc' | 'desc';

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  const loadMembers = async (token?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMembers(token);

      if (token) {
        setMembers(prev => [...prev, ...response.members]);
      } else {
        setMembers(response.members);
      }

      setPageToken(response.nextPageToken);
      setHasMore(!!response.nextPageToken);
    } catch (err) {
      setError('회원 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleGradeChange = async (uid: string, newGrade: number) => {
    try {
      await updateMemberGrade(uid, newGrade);
      setMembers(prev =>
        prev.map(member =>
          member.uid === uid ? { ...member, grade: newGrade } : member
        )
      );
      alert('등급이 변경되었습니다.');
    } catch (err) {
      alert('등급 변경에 실패했습니다.');
      console.error(err);
    }
  };

  const getGradeLabel = (grade: number) => {
    switch (grade) {
      case MemberGrade.UNAPPROVED:
        return '미승인';
      case MemberGrade.APPROVED:
        return '승인됨';
      case MemberGrade.ADMIN:
        return '관리자';
      default:
        return '알 수 없음';
    }
  };

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case MemberGrade.UNAPPROVED:
        return 'bg-gray-100 text-gray-800';
      case MemberGrade.APPROVED:
        return 'bg-green-100 text-green-800';
      case MemberGrade.ADMIN:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteMember = async (member: Member) => {
    const memberName = member.nickname || member.email || member.uid;
    const confirmed = window.confirm(
      `${memberName} 회원을 강제로 탈퇴시키시겠습니까?\n\n계정과 관련 데이터가 영구 삭제되며 복구할 수 없습니다.`
    );

    if (!confirmed) return;

    setDeletingUid(member.uid);
    try {
      await deleteMember(member.uid);
      setMembers((prev) => prev.filter((item) => item.uid !== member.uid));
      alert('회원이 강제 탈퇴 처리되었습니다.');
    } catch (err) {
      alert('회원 강제 탈퇴에 실패했습니다.');
      console.error(err);
    } finally {
      setDeletingUid(null);
    }
  };

  const displayedMembers = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase('ko-KR');
    const filteredMembers = normalizedSearchTerm
      ? members.filter((member) =>
          [member.uid, member.email, member.nickname, getGradeLabel(member.grade)]
            .some((value) => value.toLocaleLowerCase('ko-KR').includes(normalizedSearchTerm))
        )
      : members;

    return [...filteredMembers].sort((a, b) => {
      if (sortField === 'createdAt') {
        if (!a.createdAt) return b.createdAt ? 1 : 0;
        if (!b.createdAt) return -1;

        const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (sortField === 'grade') {
        const comparison = a.grade - b.grade;
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      const comparison = a[sortField].localeCompare(b[sortField], 'ko-KR');
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [members, searchTerm, sortDirection, sortField]);

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">회원 관리</h1>
        <p className="mt-2 text-gray-600">전체 회원 목록 및 등급 관리</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label htmlFor="member-search" className="sr-only">회원 검색</label>
            <input
              id="member-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="UID, 이메일, 닉네임 또는 등급 검색"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="member-sort-field" className="sr-only">정렬 기준</label>
            <select
              id="member-sort-field"
              value={sortField}
              onChange={(event) => setSortField(event.target.value as SortField)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="createdAt">가입일</option>
              <option value="nickname">닉네임</option>
              <option value="email">이메일</option>
              <option value="grade">등급</option>
            </select>
            <label htmlFor="member-sort-direction" className="sr-only">정렬 방향</label>
            <select
              id="member-sort-direction"
              value={sortDirection}
              onChange={(event) => setSortDirection(event.target.value as SortDirection)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {displayedMembers.length}명 / {members.length}명
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  닉네임
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등급
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리 작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedMembers.map((member) => (
                <tr key={member.uid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {member.uid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.nickname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(member.grade)}`}>
                      {getGradeLabel(member.grade)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleString('ko-KR')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex min-w-32 flex-col gap-2">
                    <select
                      value={member.grade}
                      onChange={(e) => handleGradeChange(member.uid, parseInt(e.target.value))}
                      disabled={deletingUid === member.uid}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value={MemberGrade.UNAPPROVED}>미승인</option>
                      <option value={MemberGrade.APPROVED}>승인됨</option>
                      <option value={MemberGrade.ADMIN}>관리자</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member)}
                      disabled={deletingUid !== null}
                      className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingUid === member.uid ? '탈퇴 처리 중...' : '강제 탈퇴'}
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedMembers.length === 0 && members.length > 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    검색 조건에 맞는 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasMore && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => loadMembers(pageToken)}
              disabled={loading}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}

        {members.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            등록된 회원이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
