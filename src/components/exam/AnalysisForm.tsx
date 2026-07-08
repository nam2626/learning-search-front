import { useEffect, useState, useRef } from 'react';

interface Props {
  onSubmit: (file: File | undefined, query: string) => void;
  isLoading: boolean;
  resetSignal?: number;
}

export default function AnalysisForm({ onSubmit, isLoading, resetSignal }: Props) {
  const [query, setQuery] = useState('');
  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resetSignal === undefined) {
      return;
    }

    setQuery('');
    setFile(undefined);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [resetSignal]);

  const applySelectedFile = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    if (!isSupportedFile(selectedFile)) {
      setError('PNG, JPG, JPEG, XLS, XLSX, CSV 파일만 업로드할 수 있습니다.');
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (selectedFile) {
      applySelectedFile(selectedFile);
    } else {
      setFile(undefined);
      setPreview(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    const pastedImage = Array.from(e.clipboardData.files).find((item) =>
      item.type.startsWith('image/')
    );

    if (!pastedImage) {
      return;
    }

    e.preventDefault();
    setError(null);
    const extension = pastedImage.type === 'image/png' ? 'png' : 'jpg';
    const pastedFile = new File(
      [pastedImage],
      `pasted-image-${Date.now()}.${extension}`,
      { type: pastedImage.type || 'image/png' }
    );
    applySelectedFile(pastedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }
    onSubmit(file, query);
  };

  const handleClearFile = () => {
    setFile(undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} onPaste={handlePaste} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
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
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full resize-none sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="질문을 입력하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={2000}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">이미지 또는 엑셀 파일 업로드 (선택)</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, .xls, .xlsx, .csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <div className="relative">
              {preview ? (
                <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
              ) : (
                <div className="h-20 w-32 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 flex items-center justify-center text-center">
                  {file.name}
                </div>
              )}
              <button
                type="button"
                onClick={handleClearFile}
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
        <p className="mt-2 text-sm text-gray-500">
          PNG, JPG, XLS, XLSX, CSV up to 10MB. 이미지 캡처는 Ctrl+V로 붙여넣을 수 있습니다.
        </p>
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

function isSupportedFile(file: File) {
  const filename = file.name.toLowerCase();
  return (
    file.type.startsWith('image/') ||
    filename.endsWith('.xls') ||
    filename.endsWith('.xlsx') ||
    filename.endsWith('.csv')
  );
}
