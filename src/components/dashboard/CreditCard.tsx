import type { CreditInfo } from '../../types';

interface CreditCardProps {
  credit: CreditInfo;
}

const MAX_THEORY_CREDITS = 20;
const MAX_EXAM_CREDITS = 10;

export default function CreditCard({ credit }: CreditCardProps) {
  const theoryCredits = credit.theoryCredits ?? 20;
  const examCredits = credit.examCredits ?? credit.dailyCredits;
  const theoryPercentage = (theoryCredits / MAX_THEORY_CREDITS) * 100;
  const examPercentage = (examCredits / MAX_EXAM_CREDITS) * 100;

  const getBarColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">오늘의 질문 가능 횟수</h3>

      <div className="mb-5">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">컴활 이론 질문</span>
          <span className="text-gray-500">
            <span className="text-xl font-bold text-gray-900">{theoryCredits}</span> / {MAX_THEORY_CREDITS}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getBarColor(theoryPercentage)}`}
            style={{ width: `${theoryPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">함수 및 문제 풀이</span>
          <span className="text-gray-500">
            <span className="text-xl font-bold text-gray-900">{examCredits}</span> / {MAX_EXAM_CREDITS}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getBarColor(examPercentage)}`}
            style={{ width: `${examPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-500">
        <p>마지막 활동: {credit.lastActiveDate}</p>
        <p>총 사용량: {credit.totalUsage}회</p>
      </div>
    </div>
  );
}
