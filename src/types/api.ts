import { IQuestion } from '@/lib/database/models/question';
import { IScore } from '@/lib/database/models/score';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type QuestionsResponse = ApiResponse<IQuestion[]>;
export type ScoreResponse = ApiResponse<IScore>;
export type LeaderboardResponse = ApiResponse<IScore[]>;