import ProfileSettings from '../components/dashboard/ProfileSettings';

export default function AccountSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">내 정보</h1>
        <p className="mb-8 text-sm text-gray-600">
          회원 정보를 수정하거나 회원 탈퇴를 진행할 수 있습니다.
        </p>
        <ProfileSettings />
      </div>
    </div>
  );
}
