import { useState } from 'react';
import { uploadDocument } from '../api/documents';

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const response = await uploadDocument(file, setProgress);
      setSuccess(response || '파일이 성공적으로 업로드되었습니다.');
    } catch (err) {
      setError('파일 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setProgress(0);
    setError(null);
    setSuccess(null);
  };

  return {
    progress,
    isUploading,
    error,
    success,
    upload,
    reset,
  };
}
