import { answersMatch, normalizeAnswer } from './grading.js';

describe('normalizeAnswer', () => {
  it('trims and lowercases text', () => {
    expect(normalizeAnswer('  Yes ')).toBe('yes');
  });

  it('strips currency and commas from numbers', () => {
    expect(normalizeAnswer('$1,250')).toBe('1250');
  });

  it('keeps numeric zero', () => {
    expect(normalizeAnswer('0')).toBe('0');
  });
});

describe('answersMatch', () => {
  it('matches equivalent number formats', () => {
    expect(answersMatch('$12.00', '12')).toBe(true);
  });

  it('rejects wrong answers', () => {
    expect(answersMatch('11', '12')).toBe(false);
  });

  it('matches division remainders with flexible spacing', () => {
    expect(answersMatch('12r3', '12 r 3')).toBe(true);
    expect(answersMatch('12 R 3', '12 r 3')).toBe(true);
  });
});
