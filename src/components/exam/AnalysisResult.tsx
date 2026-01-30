import type { AnalysisResult as AnalysisResultType } from '../../types';

interface Props {
  result: AnalysisResultType;
}

export default function AnalysisResult({ result }: Props) {
  return (
    <div className="space-y-6">
      {/* Answer Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">AI 분석 결과</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            신뢰도: {(result.confidence * 100).toFixed(1)}%
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="prose max-w-none text-gray-900 whitespace-pre-wrap">
            {result.answer}
          </div>
        </div>
      </div>

      {/* Warning Section (Conditional) */}
      {result.warning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {result.warning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}