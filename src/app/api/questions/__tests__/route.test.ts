import { NextRequest } from 'next/server';
import { GET } from '../route';
import { mockDatabase } from '@/__mocks__/api';

// Mock the Next.js request objects
function createMockRequest(url: string): NextRequest {
  return {
    nextUrl: new URL(url, 'http://localhost'),
  } as unknown as NextRequest;
}

describe('Questions API Route', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should return questions with default limit', async () => {
    const req = createMockRequest('http://localhost/api/questions');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(mockDatabase.questions.length);
    
    // Check that correct answer is not included in response
    expect(data.data[0]).not.toHaveProperty('correctAnswer');
  });

  it('should limit questions based on query parameter', async () => {
    const req = createMockRequest('http://localhost/api/questions?limit=1');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data).toHaveLength(1);
  });

  it('should return error for invalid limit', async () => {
    const req = createMockRequest('http://localhost/api/questions?limit=invalid');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeTruthy();
  });
});