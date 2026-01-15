import { useState } from 'react';
import { search as searchApi } from '../api/search';

export function useSearch() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchApi(query);
      setResult(response);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    isLoading,
    error,
    search,
    clearResult,
  };
}
