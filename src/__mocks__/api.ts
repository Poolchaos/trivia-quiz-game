// Mock implementation for the database operations
export const mockDatabase = {
  questions: [
    {
      _id: 'q1',
      text: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
      category: 'Geography',
      difficulty: 'easy',
    },
    {
      _id: 'q2',
      text: 'Which planet is known as the Red Planet?',
      options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
      category: 'Science',
      difficulty: 'easy',
    },
  ],
  scores: [
    {
      _id: 's1',
      username: 'TestUser1',
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      timeTaken: 120,
      createdAt: new Date('2023-01-01'),
    },
    {
      _id: 's2',
      username: 'TestUser2',
      score: 6,
      totalQuestions: 10,
      percentage: 60,
      timeTaken: 180,
      createdAt: new Date('2023-01-02'),
    },
  ],
};

// Mock the database operations module
jest.mock('@/lib/database/operations', () => ({
  getQuestions: jest.fn().mockImplementation((limit = 10) => {
    return Promise.resolve(mockDatabase.questions.slice(0, limit));
  }),
  getTopScores: jest.fn().mockImplementation((limit = 10) => {
    return Promise.resolve(mockDatabase.scores.slice(0, limit));
  }),
  saveScore: jest.fn().mockImplementation((scoreData) => {
    const newScore = {
      _id: `s${mockDatabase.scores.length + 1}`,
      ...scoreData,
      createdAt: new Date(),
    };
    mockDatabase.scores.push(newScore);
    return Promise.resolve(newScore);
  }),
}));