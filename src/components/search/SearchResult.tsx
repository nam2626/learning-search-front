interface SearchResultProps {
  result: string | null;
  error: string | null;
  isLoading: boolean;
}

export default function SearchResult({ result, error, isLoading }: SearchResultProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">답변</h3>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
        </div>
      </div>
    </div>
  );
}
