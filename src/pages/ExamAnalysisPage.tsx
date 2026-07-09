import { useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AnalysisForm from '../components/exam/AnalysisForm';
import AnalysisResult from '../components/exam/AnalysisResult';
import FunctionDictionary from '../components/functionDictionary/FunctionDictionary';
import SearchBar from '../components/search/SearchBar';
import SearchResult from '../components/search/SearchResult';
import { useExamAnalysis } from '../hooks/useExamAnalysis';
import { useSearch } from '../hooks/useSearch';
import { getUserDashboard } from '../api/dashboard';

const MAX_THEORY_CREDITS = 20;
const MAX_EXAM_CREDITS = 10;

type ActiveTab = 'analysis' | 'search' | 'dictionary';

export default function ExamAnalysisPage() {
  const { analyze, result, isLoading, error } = useExamAnalysis();
  const { search, result: searchResult, isLoading: isSearchLoading, error: searchError } = useSearch();
  const [activeTab, setActiveTab] = useState<ActiveTab>('analysis');
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

  const handleDictionaryQuestion = (query: string) => {
    setActiveTab('search');
    search(query);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">함수 및 문제 풀이</h2>
        </div>
      </div>

      {dashboard?.credit && (
        <CreditSummary
          activeTab={activeTab}
          theoryCredits={dashboard.credit.theoryCredits ?? MAX_THEORY_CREDITS}
          examCredits={dashboard.credit.examCredits ?? dashboard.credit.dailyCredits}
        />
      )}

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-8 overflow-x-auto" aria-label="Tabs">
          <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
            문제 분석
          </TabButton>
          <TabButton active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
            이론 질문
          </TabButton>
          <TabButton active={activeTab === 'dictionary'} onClick={() => setActiveTab('dictionary')}>
            함수 사전
          </TabButton>
        </nav>
      </div>

      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <AnalysisForm
              onSubmit={handleAnalysisSubmit}
              isLoading={isLoading}
              resetSignal={formResetSignal}
            />
            {error && (
              <div className="relative mt-4 rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
                <span className="block sm:inline">오류가 발생했습니다: {error.message}</span>
              </div>
            )}
          </div>
          <div>
            {result ? (
              <AnalysisResult result={result} />
            ) : (
              <div className="flex h-full flex-col justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
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

      {activeTab === 'dictionary' && (
        <FunctionDictionary onAskQuestion={handleDictionaryQuestion} isAsking={isSearchLoading} />
      )}
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function CreditSummary({
  activeTab,
  theoryCredits,
  examCredits,
}: {
  activeTab: ActiveTab;
  theoryCredits: number;
  examCredits: number;
}) {
  const currentLabel =
    activeTab === 'analysis' ? '문제 분석' : activeTab === 'dictionary' ? '함수 사전' : '이론 질문';
  const currentCredits = activeTab === 'analysis' ? examCredits : theoryCredits;
  const currentMaxCredits = activeTab === 'analysis' ? MAX_EXAM_CREDITS : MAX_THEORY_CREDITS;

  return (
    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">현재 메뉴 사용 가능 횟수</p>
          <p className="mt-1 text-2xl font-bold text-blue-950">
            {currentLabel}: {currentCredits} / {currentMaxCredits}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="rounded-md bg-white px-3 py-2 text-gray-700 shadow-sm">
            이론 {theoryCredits}/{MAX_THEORY_CREDITS}
          </span>
          <span className="rounded-md bg-white px-3 py-2 text-gray-700 shadow-sm">
            문제 분석 {examCredits}/{MAX_EXAM_CREDITS}
          </span>
        </div>
      </div>
    </div>
  );
}
