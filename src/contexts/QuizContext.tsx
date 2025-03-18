import { createContext, useContext, ReactNode } from 'react';
import { useQuiz } from '@/hooks/useQuiz';

type QuizContextType = ReturnType<typeof useQuiz> | null;

const QuizContext = createContext<QuizContextType>(null);

export function QuizProvider({ 
  children,
  questionCount = 10,
}: { 
  children: ReactNode;
  questionCount?: number;
}) {
  const quizState = useQuiz(questionCount);
  
  return (
    <QuizContext.Provider value={quizState}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
}