import type { CreditInfo } from '../../types';

interface CreditCardProps {
  credit: CreditInfo;
}

export default function CreditCard({ credit }: CreditCardProps) {
  const percentage = (credit.remaining / credit.max) * 100;

  const getBarColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">오늘의 크레딧</h3>

      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-bold text-gray-900">{credit.remaining}</span>
        <span className="text-gray-500">/ {credit.max}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-500">
        마지막 리셋: {new Date(credit.lastResetDate).toLocaleDateString('ko-KR')}
      </p>
    </div>
  );
}
