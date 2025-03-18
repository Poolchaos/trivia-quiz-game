import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(
  error: string,
  status = 400
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}