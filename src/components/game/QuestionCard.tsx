import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getDifficultyInfo } from '@/utils/quizUtils';

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
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setSelected(selectedAnswer || null);
  }, [selectedAnswer, question.id]);

  useEffect(() => {
    if (showFeedback) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return; // Prevent changing after submission
    setSelected(option);
    onAnswer(question.id, option);
  };

  const getOptionClasses = (option: string) => {
    let classes = 'border p-4 rounded-md cursor-pointer transition-colors flex items-center';

    if (selected === option) {
      classes += ' border-primary-600 bg-primary-50';
    } else {
      classes += ' border-gray-300 hover:border-primary-400';
    }

    if (showFeedback) {
      if (option === correctAnswer) {
        classes += ' border-green-600 bg-green-50';
        if (animate) classes += ' animate-pulse';
      } else if (selected === option && option !== correctAnswer) {
        classes += ' border-red-600 bg-red-50';
        if (animate) classes += ' animate-pulse';
      }
    }

    return classes;
  };

  const difficultyInfo = getDifficultyInfo(question.difficulty);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          {question.category && (
            <span className="text-sm text-gray-500">{question.category}</span>
          )}
          {question.difficulty && (
            <span className={`px-2 py-1 text-xs rounded-full ${difficultyInfo.color}`}>
              {difficultyInfo.text}
            </span>
          )}
        </div>
        <CardTitle className="text-xl">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={option}
              className={getOptionClasses(option)}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
              {showFeedback && option === correctAnswer && (
                <svg className="w-5 h-5 text-green-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {showFeedback && selected === option && option !== correctAnswer && (
                <svg className="w-5 h-5 text-red-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      {showFeedback && (
        <CardFooter>
          <div className="w-full">
            {isCorrect === true && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-green-700 font-medium">Correct answer!</p>
              </div>
            )}
            {isCorrect === false && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700 font-medium">
                  Incorrect. The correct answer is: {correctAnswer}
                </p>
              </div>
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