import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '../api';

describe('API Utilities', () => {
  describe('successResponse', () => {
    it('should return a successful response with data', () => {
      const data = { name: 'Test' };
      const response = successResponse(data);
      
      expect(response).toBeInstanceOf(NextResponse);
      
      const responseData = response.json();
      expect(responseData).resolves.toEqual({
        success: true,
        data,
        message: undefined,
      });
    });

    it('should include a message when provided', () => {
      const data = { name: 'Test' };
      const message = 'Operation successful';
      const response = successResponse(data, message);
      
      const responseData = response.json();
      expect(responseData).resolves.toEqual({
        success: true,
        data,
        message,
      });
    });
  });

  describe('errorResponse', () => {
    it('should return an error response with default status code', () => {
      const error = 'Something went wrong';
      const response = errorResponse(error);
      
      expect(response).toBeInstanceOf(NextResponse);
      
      const responseData = response.json();
      expect(responseData).resolves.toEqual({
        success: false,
        error,
      });
      
      expect(response.status).toBe(400);
    });

    it('should use the provided status code', () => {
      const error = 'Not found';
      const response = errorResponse(error, 404);
      
      expect(response.status).toBe(404);
    });
  });
});