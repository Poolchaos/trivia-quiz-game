import { shuffleArray, formatDate } from '../index';

describe('shuffleArray', () => {
  it('should return an array of the same length', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(array);
    expect(shuffled.length).toBe(array.length);
  });

  it('should contain the same elements as the original array', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(array);
    expect(shuffled).toEqual(expect.arrayContaining(array));
    expect(array).toEqual(expect.arrayContaining(shuffled));
  });

  it('should not mutate the original array', () => {
    const array = [1, 2, 3, 4, 5];
    const original = [...array];
    shuffleArray(array);
    expect(array).toEqual(original);
  });

  it('should return a new array reference', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(array);
    expect(shuffled).not.toBe(array);
  });
});

describe('formatDate', () => {
  it('should format a date correctly', () => {
    const date = new Date('2023-05-15T12:00:00Z');
    const formatted = formatDate(date);
    
    // The exact format can vary by locale, so we check for patterns
    expect(formatted).toContain('2023');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('should handle current date', () => {
    const today = new Date();
    const formatted = formatDate(today);
    expect(formatted.length).toBeGreaterThan(0);
  });
});