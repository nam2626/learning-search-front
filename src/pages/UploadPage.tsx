import FileUpload from '../components/upload/FileUpload';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            자료 업로드
          </h1>
          <p className="text-lg text-gray-600">
            학습 자료를 업로드하여 검색 가능하게 만드세요
          </p>
        </div>

        <FileUpload />
      </div>
    </div>
  );
}
