import { normalizeDifficulty, scaleAlgorithmRange, scaleRange } from './difficulty.js';

describe('difficulty helpers', () => {
  it('normalizes difficulty ids', () => {
    expect(normalizeDifficulty('E')).toBe('easy');
    expect(normalizeDifficulty('medium')).toBe('medium');
    expect(normalizeDifficulty('hard')).toBe('hard');
    expect(normalizeDifficulty(undefined)).toBe('medium');
  });

  it('scales ranges for easy and hard', () => {
    const base = { min: 10, max: 100 };
    expect(scaleRange(base, 'easy').max).toBeLessThan(base.max);
    expect(scaleRange(base, 'hard').min).toBeGreaterThan(base.min);
    expect(scaleRange(base, 'medium')).toEqual(base);
  });

  it('scales algorithm ranges', () => {
    const scaled = scaleAlgorithmRange(
      {
        multiplicand: { min: 10, max: 99 },
        multiplier: { min: 2, max: 9 },
      },
      'easy',
    );
    expect(scaled.multiplicand.max).toBeLessThan(99);
  });
});
