import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  hasConversation?: boolean;
}

export default function SearchBar({ onSearch, isLoading, hasConversation = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={hasConversation
            ? '이전 답변에 이어서 질문해보세요'
            : '컴퓨터활용능력 1급/2급 이론이나 개념을 질문해보세요'}
          className="w-full rounded-full border border-gray-300 px-6 py-4 pr-28 text-lg shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '답변 중' : hasConversation ? '후속 질문' : '검색'}
        </button>
      </div>
      {hasConversation && (
        <p className="mt-2 text-center text-xs text-gray-500">
          후속 질문은 크레딧이 차감되지 않습니다.
        </p>
      )}
    </form>
  );
}
