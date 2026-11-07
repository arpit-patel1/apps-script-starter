import { generateAddition } from './addition.js';
import { formatDivisionAnswer, generateDivision } from './division.js';
import { generateSubtraction } from './subtraction.js';

describe('generateAddition', () => {
  it('sums within grade 3 ranges', () => {
    const q = generateAddition({ grade: 3 });
    expect(q.sum).toBe(q.a + q.b);
    expect(q.a).toBeGreaterThanOrEqual(10);
  });
});

describe('generateSubtraction', () => {
  it('keeps positive differences', () => {
    for (let i = 0; i < 20; i += 1) {
      const q = generateSubtraction({ grade: 4 });
      expect(q.difference).toBe(q.a - q.b);
      expect(q.difference).toBeGreaterThan(0);
      expect(q.a).toBeGreaterThan(q.b);
    }
  });
});

describe('generateDivision', () => {
  it('formats facts with no remainder', () => {
    const q = generateDivision({ grade: 3, type: 'facts' });
    expect(q.remainder).toBe(0);
    expect(q.answer).toBe(String(q.quotient));
    expect(q.dividend).toBe(q.divisor * q.quotient);
  });

  it('formats remainders as q r r', () => {
    expect(formatDivisionAnswer(12, 3)).toBe('12 r 3');
    expect(formatDivisionAnswer(12, 0)).toBe('12');
  });
});
