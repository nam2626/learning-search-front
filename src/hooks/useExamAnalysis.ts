import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeExam, followUpExam } from '../api/exam';
import type { AnalysisResult, ConversationTurn } from '../types';

type AnalysisRequest =
  | { type: 'initial'; file: File; query: string }
  | { type: 'follow-up'; query: string; history: ConversationTurn[] };

export function useExamAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const turnsRef = useRef<ConversationTurn[]>([]);

  const mutation = useMutation({
    mutationFn: (params: AnalysisRequest) =>
      params.type === 'initial'
        ? analyzeExam(params.file, params.query)
        : followUpExam(params.query, params.history),
    onSuccess: (data, params) => {
      const history = params.type === 'initial' ? [] : params.history;
      const nextTurns = [...history, { question: params.query, answer: data.answer }].slice(-3);
      turnsRef.current = nextTurns;
      setTurns(nextTurns);
      setResult(data);
    },
  });

  const analyze = (params: { file: File; query: string }) => {
    turnsRef.current = [];
    setTurns([]);
    mutation.mutate({ type: 'initial', ...params });
  };

  const followUp = (query: string) => {
    if (!query.trim() || turnsRef.current.length === 0) return;
    mutation.mutate({ type: 'follow-up', query, history: turnsRef.current });
  };

  const clearResult = () => {
    setResult(null);
    setTurns([]);
    turnsRef.current = [];
    mutation.reset();
  };

  return {
    analyze,
    followUp,
    isLoading: mutation.isPending,
    error: mutation.error,
    result,
    turns,
    clearResult,
  };
}
