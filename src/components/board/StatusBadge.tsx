import type { QuestionStatus } from '../../types/board';

const STATUS_STYLE: Record<QuestionStatus, { label: string; className: string }> = {
  WAITING: { label: '답변 대기', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  ANSWERED: { label: '답변 있음', className: 'bg-blue-50 text-blue-700 ring-blue-200' },
  RESOLVED: { label: '해결됨', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
};

export default function StatusBadge({ status }: { status: QuestionStatus }) {
  const style = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style.className}`}>
      {style.label}
    </span>
  );
}
