export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Score {
  id: string;
  username: string;
  score: number;
  totalQuestions: number;
  timestamp: Date;
}