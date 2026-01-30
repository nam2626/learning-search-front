import { useState } from 'react';
import AnalysisForm from '../components/exam/AnalysisForm';
import AnalysisResult from '../components/exam/AnalysisResult';
import { useExamAnalysis } from '../hooks/useExamAnalysis';
import SearchBar from '../components/search/SearchBar';
import SearchResult from '../components/search/SearchResult';
import { useSearch } from '../hooks/useSearch';

export default function ExamAnalysisPage() {
  const { analyze, result, isLoading, error } = useExamAnalysis();
  const { search, result: searchResult, isLoading: isSearchLoading, error: searchError } = useSearch();
  const [activeTab, setActiveTab] = useState<'analysis' | 'search'>('analysis');

  const handleAnalysisSubmit = (image: File | undefined, query: string) => {
    analyze({ image, query });
  };

  const handleSearchSubmit = (query: string) => {
    search(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            학습 도우미
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            이미지 분석
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            일반 검색
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AnalysisForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} />
            {error && (
              <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">오류가 발생했습니다: {error.message}</span>
              </div>
            )}
          </div>
          <div>
            {result ? (
              <AnalysisResult result={result} />
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center h-full flex flex-col justify-center">
                <span className="text-gray-500">분석 결과가 여기에 표시됩니다.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div>
          <div className="mb-8">
            <SearchBar onSearch={handleSearchSubmit} isLoading={isSearchLoading} />
          </div>
          <SearchResult result={searchResult} error={searchError} isLoading={isSearchLoading} />
        </div>
      )}
    </div>
  );
}
