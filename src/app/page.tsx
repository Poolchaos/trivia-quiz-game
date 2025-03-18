'use client';

import { useState } from 'react';
import { QuizProvider } from '@/contexts/QuizContext';
import HomePage from '@/components/pages/HomePage';
import QuizPage from '@/components/pages/QuizPage';
import ResultsPage from '@/components/pages/ResultsPage';
import LeaderboardPage from '@/components/pages/LeaderboardPage';

// Define the possible pages in the application
type AppPage = 'home' | 'quiz' | 'results' | 'leaderboard';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [questionCount, setQuestionCount] = useState(10);

  // Navigate to a different page
  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };

  // Update question count
  const updateQuestionCount = (count: number) => {
    setQuestionCount(count);
  };

  return (
    <QuizProvider questionCount={questionCount}>
      <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
        {currentPage === 'home' && (
          <HomePage 
            onStartQuiz={() => navigateTo('quiz')} 
            onViewLeaderboard={() => navigateTo('leaderboard')}
            questionCount={questionCount}
            onQuestionCountChange={updateQuestionCount}
          />
        )}
        
        {currentPage === 'quiz' && (
          <QuizPage 
            onComplete={() => navigateTo('results')} 
          />
        )}
        
        {currentPage === 'results' && (
          <ResultsPage 
            onRestart={() => {
              navigateTo('home');
            }}
            onViewLeaderboard={() => navigateTo('leaderboard')}
          />
        )}
        
        {currentPage === 'leaderboard' && (
          <LeaderboardPage 
            onBack={() => navigateTo('home')} 
          />
        )}
      </main>
    </QuizProvider>
  );
}