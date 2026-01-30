import { useState, useRef } from 'react';

interface Props {
  onSubmit: (image: File | undefined, query: string) => void;
  isLoading: boolean;
}

export default function AnalysisForm({ onSubmit, isLoading }: Props) {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError('이미지 크기는 1MB를 초과할 수 없습니다.');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(undefined);
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }
    onSubmit(image, query);
  };

  const handleClearImage = () => {
    setImage(undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="query" className="block text-sm font-medium text-gray-700">
          질문
        </label>
        <div className="mt-1">
          <textarea
            id="query"
            name="query"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="질문을 입력하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={2000}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">이미지 업로드 (선택)</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {preview && (
            <div className="relative">
              <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
              >
                <span className="sr-only">Remove</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">PNG, JPG up to 1MB</p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              분석 중...
            </>
          ) : (
            '분석하기'
          )}
        </button>
      </div>
    </form>
  );
}
