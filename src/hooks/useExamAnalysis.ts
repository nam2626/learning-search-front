import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeExam } from '../api/exam';
import type { AnalysisResult } from '../types';

export function useExamAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const mutation = useMutation({
    mutationFn: (params: { image: File | undefined; query: string }) => 
      analyzeExam(params.image, params.query),
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const clearResult = () => {
    setResult(null);
    mutation.reset();
  };

  return {
    analyze: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    result,
    clearResult,
  };
}
