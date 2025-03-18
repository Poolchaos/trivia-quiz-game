import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatTime } from '@/utils/quizUtils';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

export function QuizResult({
  score,
  totalQuestions,
  percentage,
  timeTaken,
  onRestart,
  onViewLeaderboard,
}: QuizResultProps) {
  let resultMessage = '';
  let resultClass = '';

  if (percentage >= 90) {
    resultMessage = 'Excellent! You are a trivia master!';
    resultClass = 'text-green-600';
  } else if (percentage >= 70) {
    resultMessage = 'Great job! You know your stuff!';
    resultClass = 'text-blue-600';
  } else if (percentage >= 50) {
    resultMessage = 'Not bad! Keep learning!';
    resultClass = 'text-yellow-600';
  } else {
    resultMessage = 'You can do better! Try again!';
    resultClass = 'text-red-600';
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2">{Math.round(percentage)}%</div>
          <p className={`text-lg font-medium ${resultClass}`}>{resultMessage}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Score:</span>
            <span className="font-medium">{score} / {totalQuestions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time taken:</span>
            <span className="font-medium">{formatTime(timeTaken)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onRestart}
            className="w-full"
          >
            Play Again
          </Button>
          <Button
            onClick={onViewLeaderboard}
            variant="secondary"
            className="w-full"
          >
            View Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}