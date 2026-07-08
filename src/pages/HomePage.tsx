import SearchBar from '../components/search/SearchBar';
import SearchResult from '../components/search/SearchResult';
import { useSearch } from '../hooks/useSearch';

export default function HomePage() {
  const { result, isLoading, error, search } = useSearch();

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

        <SearchBar onSearch={search} isLoading={isLoading} />
        <SearchResult result={result} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
}
