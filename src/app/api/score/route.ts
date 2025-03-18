import { NextRequest } from 'next/server';
import { z } from 'zod';
import { saveScore } from '@/lib/database/operations';
import { successResponse, errorResponse } from '@/utils/api';

const ScoreSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
  score: z.number().int().min(0, "Score cannot be negative"),
  totalQuestions: z.number().int().min(1, "Total questions must be at least 1"),
  percentage: z.number().min(0, "Percentage cannot be negative").max(100, "Percentage cannot exceed 100"),
  timeTaken: z.number().min(0, "Time taken cannot be negative"),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = ScoreSchema.safeParse(data);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return errorResponse(`Invalid request data: ${errorMessages}`, 400);
    }

    const savedScore = await saveScore(result.data);
    return successResponse(savedScore, 'Score saved successfully');
  } catch (error) {
    console.error('Error saving score:', error);
    return errorResponse('Failed to save score', 500);
  }
}