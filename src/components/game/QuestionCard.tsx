import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: string[];
    category?: string;
    difficulty?: string;
  };
  onAnswer: (questionId: string, answer: string) => void;
  showFeedback?: boolean;
  isCorrect?: boolean | null;
  correctAnswer?: string;
  selectedAnswer?: string;
  isLast?: boolean;
  onNext?: () => void;
}

export function QuestionCard({
  question,
  onAnswer,
  showFeedback = false,
  isCorrect = null,
  correctAnswer,
  selectedAnswer,
  isLast = false,
  onNext,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(selectedAnswer || null);

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return; // Prevent changing after submission
    setSelected(option);
    onAnswer(question.id, option);
  };

  const getOptionClasses = (option: string) => {
    let classes = 'border p-3 rounded-md cursor-pointer transition-colors';

    if (selected === option) {
      classes += ' border-primary-600 bg-primary-50';
    } else {
      classes += ' border-gray-300 hover:border-primary-400';
    }

    if (showFeedback) {
      if (option === correctAnswer) {
        classes += ' border-green-600 bg-green-50';
      } else if (selected === option && option !== correctAnswer) {
        classes += ' border-red-600 bg-red-50';
      }
    }

    return classes;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          {question.category && (
            <span className="text-sm text-gray-500">{question.category}</span>
          )}
          {question.difficulty && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
              {question.difficulty}
            </span>
          )}
        </div>
        <CardTitle>{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option) => (
            <div
              key={option}
              className={getOptionClasses(option)}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </CardContent>
      {showFeedback && (
        <CardFooter>
          <div className="w-full">
            {isCorrect === true && (
              <p className="text-green-600 font-medium mb-3">Correct answer!</p>
            )}
            {isCorrect === false && (
              <p className="text-red-600 font-medium mb-3">
                Incorrect. The correct answer is: {correctAnswer}
              </p>
            )}
            {onNext && (
              <Button
                onClick={onNext}
                className="w-full"
                disabled={!selected}
              >
                {isLast ? 'Finish Quiz' : 'Next Question'}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}