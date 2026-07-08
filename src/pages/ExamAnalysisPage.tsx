import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AnalysisForm from '../components/exam/AnalysisForm';
import AnalysisResult from '../components/exam/AnalysisResult';
import { useExamAnalysis } from '../hooks/useExamAnalysis';
import SearchBar from '../components/search/SearchBar';
import SearchResult from '../components/search/SearchResult';
import { useSearch } from '../hooks/useSearch';
import { getUserDashboard } from '../api/dashboard';

const MAX_THEORY_CREDITS = 20;
const MAX_EXAM_CREDITS = 10;

export default function ExamAnalysisPage() {
  const { analyze, result, isLoading, error } = useExamAnalysis();
  const { search, result: searchResult, isLoading: isSearchLoading, error: searchError } = useSearch();
  const [activeTab, setActiveTab] = useState<'analysis' | 'search'>('analysis');
  const [formResetSignal, setFormResetSignal] = useState(0);
  const queryClient = useQueryClient();
  const { data: dashboard } = useQuery({
    queryKey: ['userDashboard'],
    queryFn: getUserDashboard,
  });

  useEffect(() => {
    if (result) {
      setFormResetSignal((value) => value + 1);
      queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
    }
  }, [queryClient, result]);

  useEffect(() => {
    if (searchResult) {
      queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
    }
  }, [queryClient, searchResult]);

  const handleAnalysisSubmit = (file: File | undefined, query: string) => {
    analyze({ file, query });
  };

  const handleSearchSubmit = (query: string) => {
    search(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            함수 및 문제 풀이
          </h2>
        </div>
      </div>

      {dashboard?.credit && (
        <CreditSummary
          activeTab={activeTab}
          theoryCredits={dashboard.credit.theoryCredits ?? MAX_THEORY_CREDITS}
          examCredits={dashboard.credit.examCredits ?? dashboard.credit.dailyCredits}
        />
      )}

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
            함수 및 문제 풀이
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            컴활 1급/2급 이론 질문
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AnalysisForm
              onSubmit={handleAnalysisSubmit}
              isLoading={isLoading}
              resetSignal={formResetSignal}
            />
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

function CreditSummary({
  activeTab,
  theoryCredits,
  examCredits,
}: {
  activeTab: 'analysis' | 'search';
  theoryCredits: number;
  examCredits: number;
}) {
  const currentLabel = activeTab === 'analysis' ? '함수 및 문제 풀이' : '컴활 이론 질문';
  const currentCredits = activeTab === 'analysis' ? examCredits : theoryCredits;
  const currentMaxCredits = activeTab === 'analysis' ? MAX_EXAM_CREDITS : MAX_THEORY_CREDITS;

  return (
    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">현재 메뉴 남은 질문 횟수</p>
          <p className="mt-1 text-2xl font-bold text-blue-950">
            {currentLabel}: {currentCredits} / {currentMaxCredits}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="rounded-md bg-white px-3 py-2 text-gray-700 shadow-sm">
            이론 {theoryCredits}/{MAX_THEORY_CREDITS}
          </span>
          <span className="rounded-md bg-white px-3 py-2 text-gray-700 shadow-sm">
            문제풀이 {examCredits}/{MAX_EXAM_CREDITS}
          </span>
        </div>
      </div>
    </div>
  );
}
