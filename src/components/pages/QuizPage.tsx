import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { QuestionCard } from '@/components/game/QuestionCard';
import { ProgressBar } from '@/components/game/ProgressBar';
import { Timer } from '@/components/game/Timer';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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
    goToQuestion,
    answers,
    endQuiz,
    result,
  } = useQuizContext();

  const [showFeedback, setShowFeedback] = useState(false);
  const [isQuizPaused, setIsQuizPaused] = useState(false);
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false);

  // This would be replaced with server validation in a real app
  const [mockCorrectAnswers, setMockCorrectAnswers] = useState<Record<string, string>>({});
  
  // Timer settings - 30 seconds per question
  const { resetTimer, pauseTimer, resumeTimer } = useQuestionTimer({
    duration: 30,
    onTimeout: () => {
      if (!showFeedback && currentQuestion) {
        // Auto-submit current answer on timeout
        handleAnswerSubmit();
      }
    },
    isActive: !showFeedback && !isQuizPaused,
  });

  // Set up mock correct answers for demo purposes
  useEffect(() => {
    if (questions.length > 0) {
      const correctAnswers: Record<string, string> = {};
      questions.forEach((q) => {
        // For demo, choose a random option as "correct"
        correctAnswers[q.id] = q.options[Math.floor(Math.random() * q.options.length)];
      });
      setMockCorrectAnswers(correctAnswers);
    }
  }, [questions]);

  // Navigate to results page when quiz is complete
  useEffect(() => {
    if (result) {
      onComplete();
    }
  }, [result, onComplete]);

  // Reset timer when moving to a new question
  useEffect(() => {
    resetTimer();
    setShowFeedback(false);
  }, [currentQuestionIndex, resetTimer]);

  const handleAnswerSubmit = () => {
    // If no answer selected, don't submit
    if (!currentQuestion || !answers[currentQuestion.id]) return;
    
    setShowFeedback(true);
    pauseTimer();
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    
    // If this is the last question, end the quiz
    if (currentQuestionIndex === questions.length - 1) {
      endQuiz();
    } else {
      goToNextQuestion();
    }
  };

  const togglePause = () => {
    if (isQuizPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
    setIsQuizPaused(!isQuizPaused);
  };

  const handleQuit = () => {
    setShowQuitConfirmation(true);
    pauseTimer();
  };

  const confirmQuit = () => {
    endQuiz();
    onComplete();
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

  // const progress = Math.floor(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <>
      <Container className="py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h1>
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                onClick={togglePause}
                size="sm"
              >
                {isQuizPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleQuit}
                size="sm"
              >
                Quit
              </Button>
            </div>
          </div>
          
          <div className="mb-6 space-y-3">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={questions.length}
            />
            
            <Timer 
              duration={30} 
              onComplete={handleAnswerSubmit} 
              className={isQuizPaused ? 'opacity-50' : ''}
            />
          </div>
          
          {isQuizPaused ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz Paused</h2>
              <p className="mb-6 text-gray-600">Take a breath. The timer has been paused.</p>
              <Button onClick={togglePause}>Resume Quiz</Button>
            </div>
          ) : (
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
          )}
          
          {!isQuizPaused && !showFeedback && (
            <div className="mt-6 flex justify-between">
              <Button
                variant="secondary"
                disabled={currentQuestionIndex === 0}
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleAnswerSubmit}
                disabled={!answers[currentQuestion.id]}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          )}
          
          {questions.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-center space-x-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                      index === currentQuestionIndex
                        ? 'bg-primary-600 text-white'
                        : answers[questions[index].id]
                        ? 'bg-primary-100 text-primary-800 border border-primary-600'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => !showFeedback && goToQuestion(index)}
                    aria-label={`Go to question ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
      
      {/* Quit Confirmation Modal */}
      <Modal
        isOpen={showQuitConfirmation}
        onClose={() => {
          setShowQuitConfirmation(false);
          if (!showFeedback) resumeTimer();
        }}
        title="Quit Quiz?"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowQuitConfirmation(false);
                if (!showFeedback) resumeTimer();
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmQuit}>Quit</Button>
          </div>
        }
      >
        <p>Are you sure you want to quit? Your progress will be lost.</p>
      </Modal>
    </>
  );
}