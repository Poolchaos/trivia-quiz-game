import { validateAnswer, calculateScore, formatTime, getDifficultyInfo } from '../quizUtils';

describe('validateAnswer', () => {
  it('should return true for correct answers', () => {
    const correctAnswers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    expect(validateAnswer('q1', 'a', correctAnswers)).toBe(true);
  });

  it('should return false for incorrect answers', () => {
    const correctAnswers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    expect(validateAnswer('q1', 'b', correctAnswers)).toBe(false);
  });

  it('should return false for non-existent questions', () => {
    const correctAnswers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    expect(validateAnswer('q3', 'a', correctAnswers)).toBe(false);
  });
});

describe('calculateScore', () => {
  it('should calculate correct score when all answers are correct', () => {
    const answers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    const correctAnswers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    const result = calculateScore(answers, correctAnswers);
    
    expect(result.correct).toBe(2);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(100);
  });

  it('should calculate correct score when some answers are incorrect', () => {
    const answers = {
      'q1': 'a',
      'q2': 'c', // Incorrect
    };
    
    const correctAnswers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    const result = calculateScore(answers, correctAnswers);
    
    expect(result.correct).toBe(1);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(50);
  });

  it('should handle empty answers', () => {
    const answers = {};
    
    const correctAnswers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    const result = calculateScore(answers, correctAnswers);
    
    expect(result.correct).toBe(0);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(0);
  });

  it('should handle empty correct answers', () => {
    const answers = {
      'q1': 'a',
      'q2': 'b',
    };
    
    const correctAnswers = {};
    
    const result = calculateScore(answers, correctAnswers);
    
    expect(result.correct).toBe(0);
    expect(result.total).toBe(0);
    expect(result.percentage).toBe(0);
  });
});

describe('formatTime', () => {
  it('should format seconds correctly', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(30)).toBe('00:30');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(3600)).toBe('60:00');
  });

  it('should pad numbers with leading zeros', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(65)).toBe('01:05');
  });
});

describe('getDifficultyInfo', () => {
  it('should return correct info for easy difficulty', () => {
    const info = getDifficultyInfo('easy');
    expect(info.text).toBe('Easy');
    expect(info.color).toContain('green');
  });

  it('should return correct info for medium difficulty', () => {
    const info = getDifficultyInfo('medium');
    expect(info.text).toBe('Medium');
    expect(info.color).toContain('yellow');
  });

  it('should return correct info for hard difficulty', () => {
    const info = getDifficultyInfo('hard');
    expect(info.text).toBe('Hard');
    expect(info.color).toContain('red');
  });

  it('should return default info for unknown difficulty', () => {
    const info = getDifficultyInfo(undefined);
    expect(info.text).toBe('Unknown');
    expect(info.color).toContain('gray');
  });
});