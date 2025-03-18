import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { QuestionCard } from '@/components/game/QuestionCard';
import { ProgressBar } from '@/components/game/ProgressBar';
import { Timer } from '@/components/game/Timer';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useQuizContext } from '@/contexts/QuizContext';
import { useQuestionTimer } from '@/hooks/useQuestionTimer';

interface QuizPageProps {
  onComplete: () => void;
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    error,
    answerQuestion,
    goToNextQuestion,
    answers,
    endQuiz,
    result,
  } = useQuizContext();

  const [showFeedback, setShowFeedback] = useState(false);
  
  const [mockCorrectAnswers, setMockCorrectAnswers] = useState<Record<string, string>>({});
  const { resetTimer } = useQuestionTimer({
    duration: 30,
    onTimeout: () => {
      if (!showFeedback && currentQuestion) {
        handleAnswerSubmit();
      }
    },
  });

  useEffect(() => {
    if (questions.length > 0) {
      const correctAnswers: Record<string, string> = {};
      questions.forEach((q) => {
        correctAnswers[q.id] = q.options[Math.floor(Math.random() * q.options.length)];
      });
      setMockCorrectAnswers(correctAnswers);
    }
  }, [questions]);

  useEffect(() => {
    if (result) {
      onComplete();
    }
  }, [result, onComplete]);

  useEffect(() => {
    resetTimer();
  }, [currentQuestionIndex, resetTimer]);

  const handleAnswerSubmit = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    
    if (currentQuestionIndex === questions.length - 1) {
      endQuiz();
    } else {
      goToNextQuestion();
    }
  };

  if (isLoading) {
    return (
      <Container className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading questions...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <ErrorMessage message={error} />
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container className="py-8">
        <ErrorMessage message="No questions available. Please try again later." />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 space-y-3">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
          />
          
          <Timer duration={30} />
        </div>
        
        <QuestionCard
          question={currentQuestion}
          onAnswer={answerQuestion}
          showFeedback={showFeedback}
          isCorrect={
            showFeedback
              ? answers[currentQuestion.id] === mockCorrectAnswers[currentQuestion.id]
              : null
          }
          correctAnswer={showFeedback ? mockCorrectAnswers[currentQuestion.id] : undefined}
          selectedAnswer={answers[currentQuestion.id]}
          isLast={currentQuestionIndex === questions.length - 1}
          onNext={handleNextQuestion}
        />
      </div>
    </Container>
  );
}