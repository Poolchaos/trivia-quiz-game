import { NextRequest } from 'next/server';
import { getQuestions } from '@/lib/database/operations';
import { successResponse, errorResponse } from '@/utils/api';
import { Types } from 'mongoose';

interface LeanQuestionDocument {
  _id: Types.ObjectId | string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 10;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | undefined;

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return errorResponse('Limit must be between 1 and 50', 400);
    }

    const questions = await getQuestions(limit, category, difficulty);
    const questionData = questions.map((q: unknown) => {
      const question = q as LeanQuestionDocument;
      return {
        id: question._id.toString(),
        text: question.text,
        options: question.options,
        category: question.category,
        difficulty: question.difficulty,
      };
    });

    return successResponse(questionData, 'Questions retrieved successfully');
  } catch (error) {
    console.error('Error fetching questions:', error);
    return errorResponse('Failed to fetch questions', 500);
  }
}