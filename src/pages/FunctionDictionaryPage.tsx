import { useNavigate } from 'react-router-dom';
import FunctionDictionary from '../components/functionDictionary/FunctionDictionary';

export default function FunctionDictionaryPage() {
  const navigate = useNavigate();

  const handleAskQuestion = (query: string) => {
    navigate('/exam-analysis', {
      state: {
        initialTab: 'search',
        initialQuery: query,
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">함수 사전</h2>
      </div>
      <FunctionDictionary onAskQuestion={handleAskQuestion} isAsking={false} />
    </div>
  );
}
