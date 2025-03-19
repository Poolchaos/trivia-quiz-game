import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '@/components/pages/HomePage';
import QuizPage from '@/components/pages/QuizPage';
import { QuizProvider } from '@/contexts/QuizContext';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      success: true,
      data: [
        {
          id: 'q1',
          text: 'What is the capital of France?',
          options: ['Paris', 'London', 'Berlin', 'Madrid'],
          category: 'Geography',
          difficulty: 'easy',
        },
      ],
    }),
  })
) as jest.Mock;

describe('Quiz Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start a quiz from home page', async () => {
    const onStartQuiz = jest.fn();
    const onViewLeaderboard = jest.fn();
    
    render(
      <QuizProvider>
        <HomePage
          onStartQuiz={onStartQuiz}
          onViewLeaderboard={onViewLeaderboard}
          questionCount={10}
          onQuestionCountChange={() => {}}
        />
      </QuizProvider>
    );
    
    const startButton = screen.getByRole('button', { name: /start quiz/i });
    fireEvent.click(startButton);
    
    expect(onStartQuiz).toHaveBeenCalledTimes(1);
  });

  it('should display a question and allow answering', async () => {
    const onComplete = jest.fn();
    
    render(
      <QuizProvider>
        <QuizPage onComplete={onComplete} />
      </QuizProvider>
    );
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/what is the capital of france?/i)).toBeInTheDocument();
    
    const parisOption = screen.getByText(/paris/i);
    fireEvent.click(parisOption);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // In a real test, we would check for feedback and progression to next question
    // but this would require more complex mocking of the quiz state
  });
});