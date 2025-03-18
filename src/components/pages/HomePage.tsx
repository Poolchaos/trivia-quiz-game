import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { useQuizContext } from '@/contexts/QuizContext';

interface HomePageProps {
  onStartQuiz: () => void;
  onViewLeaderboard: () => void;
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
}
type DifficultyLevel = 'all' | 'easy' | 'medium' | 'hard';

export default function HomePage({
  onStartQuiz,
  onViewLeaderboard,
  questionCount,
  onQuestionCountChange,
}: HomePageProps) {
  const { startQuiz, isLoading } = useQuizContext();
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const handleStartQuiz = () => {
    startQuiz();
    onStartQuiz();
  };

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const questionCountOptions = [5, 10, 15, 20];

  return (
    <Container>
      <div className="flex flex-col items-center py-8 sm:py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
          Trivia Quiz Challenge
        </h1>
        
        <p className="text-xl text-center text-gray-600 max-w-2xl mb-12">
          Test your knowledge with our trivia questions. Choose your settings and see if you can make it to the top of the leaderboard!
        </p>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Game Settings</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`py-2 px-4 rounded-md border transition-colors ${
                      difficulty === option.value
                        ? 'bg-primary-100 border-primary-600 text-primary-800'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}
                    onClick={() => setDifficulty(option.value as DifficultyLevel)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {questionCountOptions.map((count) => (
                  <button
                    key={count}
                    className={`py-2 px-4 rounded-md border transition-colors ${
                      questionCount === count
                        ? 'bg-primary-100 border-primary-600 text-primary-800'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}
                    onClick={() => onQuestionCountChange(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleStartQuiz}
              className="w-full text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Start Quiz'}
            </Button>
            
            <Button
              onClick={onViewLeaderboard}
              variant="secondary"
              className="w-full"
            >
              View Leaderboard
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 rounded-full p-4 mb-4">
                <svg 
                  className="w-8 h-8 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">1. Answer Questions</h3>
              <p className="text-gray-600">
                Read each question carefully and select the answer you think is correct.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 rounded-full p-4 mb-4">
                <svg 
                  className="w-8 h-8 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">2. Beat the Clock</h3>
              <p className="text-gray-600">
                Try to answer quickly for a better score. Each quiz is timed!
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 rounded-full p-4 mb-4">
                <svg 
                  className="w-8 h-8 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">3. Check Your Rank</h3>
              <p className="text-gray-600">
                See how your score compares to others on the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}