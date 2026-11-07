import {
  generateAlgorithmFactors,
  getAlgorithmRange,
  normalizeMultiplicationType,
} from './multiplication.js';

describe('normalizeMultiplicationType', () => {
  it('defaults unknown values to 1_digit', () => {
    expect(normalizeMultiplicationType(null)).toBe('1_digit');
    expect(normalizeMultiplicationType('2_digit')).toBe('2_digit');
  });
});

describe('getAlgorithmRange', () => {
  it('returns 1-digit grade 3 ranges', () => {
    expect(getAlgorithmRange('1_digit', 3)).toEqual({
      multiplicand: { min: 10, max: 99 },
      multiplier: { min: 2, max: 9 },
    });
  });

  it('returns 2-digit grade 5 ranges', () => {
    expect(getAlgorithmRange('2_digit', 5).multiplier).toEqual({ min: 10, max: 99 });
  });
});

describe('generateAlgorithmFactors', () => {
  it('keeps 1-digit multipliers in range', () => {
    for (let i = 0; i < 30; i += 1) {
      const problem = generateAlgorithmFactors({ type: '1_digit', grade: 4 });
      expect(problem.multiplier).toBeGreaterThanOrEqual(2);
      expect(problem.multiplier).toBeLessThanOrEqual(9);
      expect(problem.product).toBe(problem.multiplicand * problem.multiplier);
    }
  });

  it('keeps 2-digit multipliers in range', () => {
    for (let i = 0; i < 30; i += 1) {
      const problem = generateAlgorithmFactors({ type: '2_digit', grade: 3 });
      expect(problem.multiplier).toBeGreaterThanOrEqual(10);
      expect(problem.multiplier).toBeLessThanOrEqual(20);
    }
  });
});
