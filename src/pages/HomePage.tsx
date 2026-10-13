import SearchBar from '../components/search/SearchBar';
import SearchResult from '../components/search/SearchResult';
import { useSearch } from '../hooks/useSearch';

export default function HomePage() {
  const { result, turns, isLoading, error, search, clearResult } = useSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            컴활 1급/2급 이론 질문
          </h1>
          <p className="text-lg text-gray-600">
            업로드된 학습 자료를 바탕으로 컴활 이론과 개념을 질문하세요
          </p>
        </div>

        <SearchBar onSearch={search} isLoading={isLoading} hasConversation={turns.length > 0} />
        <SearchResult result={result} turns={turns} error={error} isLoading={isLoading} />
        {turns.length > 0 && (
          <div className="mx-auto mt-4 flex w-full max-w-3xl justify-end">
            <button
              type="button"
              onClick={clearResult}
              disabled={isLoading}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              새 이론 질문 시작
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
