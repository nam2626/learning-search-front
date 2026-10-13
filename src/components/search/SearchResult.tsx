import type { ConversationTurn } from '../../types';
import ConversationThread from '../common/ConversationThread';

interface SearchResultProps {
  result: string | null;
  turns: ConversationTurn[];
  error: string | null;
  isLoading: boolean;
}

export default function SearchResult({ result, turns, error, isLoading }: SearchResultProps) {
  if (isLoading) {
    return (
      <div className="mx-auto mt-8 w-full max-w-3xl">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 w-full max-w-3xl">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!result || turns.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl">
      <ConversationThread turns={turns} />
    </div>
  );
}
