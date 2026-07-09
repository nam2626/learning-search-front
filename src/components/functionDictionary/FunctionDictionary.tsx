import { useMemo, useState } from 'react';
import {
  dictionaryStats,
  functionCategories,
  spreadsheetFunctions,
  type FunctionLevel,
  type SpreadsheetFunction,
} from '../../data/functionDictionary';

interface FunctionDictionaryProps {
  onAskQuestion: (query: string) => void;
  isAsking: boolean;
}

type LevelFilter = 'all' | FunctionLevel;

export default function FunctionDictionary({ onAskQuestion, isAsking }: FunctionDictionaryProps) {
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedName, setSelectedName] = useState('VLOOKUP');

  const filteredFunctions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return spreadsheetFunctions.filter((item) => {
      const matchesLevel = levelFilter === 'all' || item.levels.includes(levelFilter);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.summary.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery));

      return matchesLevel && matchesCategory && matchesQuery;
    });
  }, [categoryFilter, levelFilter, query]);

  const selectedFunction =
    spreadsheetFunctions.find((item) => item.name === selectedName) ?? filteredFunctions[0] ?? spreadsheetFunctions[0];

  const handleAsk = (item: SpreadsheetFunction) => {
    onAskQuestion(
      `컴퓨터활용능력 시험 기준으로 ${item.name} 함수의 사용법, 인수 의미, 자주 나오는 문제 유형, 예제를 설명해줘.`,
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-5">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="flex-1">
              <span className="mb-2 block text-sm font-medium text-gray-700">함수 검색</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="함수명, 설명, 키워드로 검색"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="lg:w-40">
              <span className="mb-2 block text-sm font-medium text-gray-700">급수</span>
              <select
                value={levelFilter}
                onChange={(event) => {
                  const value = event.target.value;
                  setLevelFilter(value === 'all' ? 'all' : Number(value) as FunctionLevel);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">전체</option>
                <option value={1}>1급</option>
                <option value={2}>2급</option>
              </select>
            </label>

            <label className="lg:w-56">
              <span className="mb-2 block text-sm font-medium text-gray-700">분류</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">전체 분류</option>
                {functionCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <SummaryTile label="전체" value={dictionaryStats.total} />
          <SummaryTile label="1급" value={dictionaryStats.level1} />
          <SummaryTile label="2급" value={dictionaryStats.level2} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h3 className="text-base font-semibold text-gray-900">함수 목록</h3>
            <span className="text-sm text-gray-500">{filteredFunctions.length}개</span>
          </div>

          {filteredFunctions.length > 0 ? (
            <div className="grid max-h-[640px] grid-cols-1 overflow-y-auto p-3 md:grid-cols-2 2xl:grid-cols-3">
              {filteredFunctions.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedName(item.name)}
                  className={`m-1 rounded-md border p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 ${
                    selectedFunction.name === item.name
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="font-semibold text-gray-950">{item.name}</span>
                    <LevelBadges levels={item.levels} />
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm leading-6 text-gray-600">{item.summary}</p>
                  <span className="text-xs font-medium text-gray-500">{item.category}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-sm text-gray-500">검색 조건에 맞는 함수가 없습니다.</div>
          )}
        </div>
      </section>

      <aside className="xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-950">{selectedFunction.name}</h3>
                <LevelBadges levels={selectedFunction.levels} />
              </div>
              <p className="text-sm font-medium text-blue-700">{selectedFunction.category}</p>
            </div>
          </div>

          <p className="mb-5 leading-7 text-gray-700">{selectedFunction.summary}</p>

          <DetailBlock label="구문" value={selectedFunction.syntax} />
          <DetailBlock label="예제" value={selectedFunction.example} />

          <div className="mb-5">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">키워드</h4>
            <div className="flex flex-wrap gap-2">
              {selectedFunction.keywords.map((keyword) => (
                <span key={keyword} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">관련 함수</h4>
            <div className="flex flex-wrap gap-2">
              {selectedFunction.related.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedName(name)}
                  className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAsk(selectedFunction)}
            disabled={isAsking}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAsking ? '질문 보내는 중' : '이 함수로 AI 질문하기'}
          </button>
        </div>
      </aside>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-950">{value}</p>
    </div>
  );
}

function LevelBadges({ levels }: { levels: FunctionLevel[] }) {
  return (
    <span className="flex shrink-0 gap-1">
      {levels.map((level) => (
        <span
          key={level}
          className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
            level === 1 ? 'bg-slate-900 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {level}급
        </span>
      ))}
    </span>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-5">
      <h4 className="mb-2 text-sm font-semibold text-gray-900">{label}</h4>
      <code className="block overflow-x-auto rounded-md bg-gray-950 px-4 py-3 text-sm text-white">{value}</code>
    </div>
  );
}
