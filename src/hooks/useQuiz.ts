import { useState, useCallback } from 'react';

interface Question {
  id: string;
  text: string;
  options: string[];
  category?: string;
  difficulty?: string;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  startTime: number | null;
  endTime: number | null;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
}

export function useQuiz(questionCount = 10) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    isLoading: false,
    error: null,
    startTime: null,
    endTime: null,
  });

  const [result, setResult] = useState<QuizResult | null>(null);

  const fetchQuestions = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`/api/questions?limit=${questionCount}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions');
      }

      setState((prev) => ({
        ...prev,
        questions: data.data,
        isLoading: false,
        startTime: Date.now(),
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false,
      }));
    }
  }, [questionCount]);

  const startQuiz = useCallback(() => {
    setState({
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      isLoading: false,
      error: null,
      startTime: null,
      endTime: null,
    });
    setResult(null);
    fetchQuestions();
  }, [fetchQuestions]);

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      }
      return prev;
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setState((prev) => {
      if (index >= 0 && index < prev.questions.length) {
        return { ...prev, currentQuestionIndex: index };
      }
      return prev;
    });
  }, []);

  const endQuiz = useCallback(async () => {
    setState((prev) => ({ ...prev, endTime: Date.now() }));
    
    try {
      const { questions, startTime } = state;
      
      if (!startTime) return;
      
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      const correctCount = Math.floor(Math.random() * (questions.length + 1));
      
      const quizResult: QuizResult = {
        score: correctCount,
        totalQuestions: questions.length,
        percentage: (correctCount / questions.length) * 100,
        timeTaken,
      };
      
      setResult(quizResult);
      
      const username = `Player${Math.floor(Math.random() * 10000)}`;
      await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          score: correctCount,
          totalQuestions: questions.length,
          percentage: (correctCount / questions.length) * 100,
          timeTaken,
        }),
      });
    } catch (error) {
      console.error('Error ending quiz:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, [state]);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isCompleted = Object.keys(state.answers).length === state.questions.length;
  
  const resetQuiz = useCallback(() => {
    setState({
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      isLoading: false,
      error: null,
      startTime: null,
      endTime: null,
    });
    setResult(null);
  }, []);

  return {
    currentQuestion,
    currentQuestionIndex: state.currentQuestionIndex,
    questions: state.questions,
    answers: state.answers,
    isLoading: state.isLoading,
    error: state.error,
    result,
    isCompleted,
    startQuiz,
    answerQuestion,
    goToNextQuestion,
    goToQuestion,
    endQuiz,
    resetQuiz,
  };
}