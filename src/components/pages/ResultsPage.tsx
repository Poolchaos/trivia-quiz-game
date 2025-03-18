import { Container } from '@/components/layout/Container';
import { QuizResult } from '@/components/game/QuizResult';
import { useQuizContext } from '@/contexts/QuizContext';

interface ResultsPageProps {
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

export default function ResultsPage({ onRestart, onViewLeaderboard }: ResultsPageProps) {
  const { result, resetQuiz } = useQuizContext();

  const handleRestart = () => {
    resetQuiz();
    onRestart();
  };

  if (!result) {
    return (
      <Container>
        <p className="text-center py-8">No results available. Please complete a quiz first.</p>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <QuizResult
        score={result.score}
        totalQuestions={result.totalQuestions}
        percentage={result.percentage}
        timeTaken={result.timeTaken}
        onRestart={handleRestart}
        onViewLeaderboard={onViewLeaderboard}
      />
    </Container>
  );
}