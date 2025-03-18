import { NextRequest } from 'next/server';
import { getTopScores } from '@/lib/database/operations';
import { successResponse, errorResponse } from '@/utils/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 10;

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return errorResponse('Limit must be between 1 and 100', 400);
    }

    const scores = await getTopScores(limit);
    return successResponse(scores, 'Leaderboard retrieved successfully');
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return errorResponse('Failed to fetch leaderboard', 500);
  }
}