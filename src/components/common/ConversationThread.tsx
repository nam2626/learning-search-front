import type { ConversationTurn } from '../../types';
import MarkdownViewer from './MarkdownViewer';

interface Props {
  turns: ConversationTurn[];
}

export default function ConversationThread({ turns }: Props) {
  return (
    <div className="space-y-4">
      {turns.map((turn, index) => (
        <div key={`${index}-${turn.question}`} className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b border-gray-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-semibold text-blue-700">질문 {index + 1}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">{turn.question}</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <MarkdownViewer content={turn.answer} />
          </div>
        </div>
      ))}
      <p className="text-right text-xs text-gray-500">최근 문답 {turns.length}/3개를 기억하고 있습니다.</p>
    </div>
  );
}
