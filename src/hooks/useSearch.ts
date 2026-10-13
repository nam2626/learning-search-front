import { useCallback, useRef, useState } from 'react';
import { search as searchApi } from '../api/search';
import type { ConversationTurn } from '../types';

export function useSearch() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const turnsRef = useRef<ConversationTurn[]>([]);
  const referenceRef = useRef<string | undefined>(undefined);

  const search = useCallback(async (query: string, reference?: string) => {
    if (!query.trim()) return;

    const isNewReferenceConversation = reference !== undefined;
    const history = isNewReferenceConversation ? [] : turnsRef.current;
    if (isNewReferenceConversation) {
      referenceRef.current = reference;
      turnsRef.current = [];
      setTurns([]);
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchApi(query, referenceRef.current, history);
      const nextTurns = [...history, { question: query, answer: response }].slice(-3);
      turnsRef.current = nextTurns;
      setTurns(nextTurns);
      setResult(response);
    } catch {
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setTurns([]);
    turnsRef.current = [];
    referenceRef.current = undefined;
  }, []);

  return {
    result,
    isLoading,
    error,
    turns,
    search,
    clearResult,
  };
}
