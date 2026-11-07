import { answersMatch } from './grading.js';
import {
  factorPairs,
  generateEstimate,
  generateFactors,
  generateMissingSymbol,
  generateRounding,
  generateTimesAsMany,
  isPrime,
  normalizeEquation,
  normalizeFactorPairsAnswer,
  normalizeListAnswer,
  roundToPlace,
} from './phase2.js';

describe('rounding helpers', () => {
  it('rounds to place', () => {
    expect(roundToPlace(347, 10)).toBe(350);
    expect(roundToPlace(347, 100)).toBe(300);
  });

  it('generates forward rounding', () => {
    const q = generateRounding({ grade: 3, type: 'forward' });
    expect(q.type).toBe('forward');
    expect(Number(q.answer) % 10).toBe(0);
    expect(q.prompt).toMatch(/Round/);
  });

  it('generates reverse with a range', () => {
    const q = generateRounding({ grade: 4, type: 'reverse' });
    expect(q.answerKind).toBe('range');
    expect(q.acceptedRange.max).toBeGreaterThanOrEqual(q.acceptedRange.min);
    expect(
      answersMatch(String(q.acceptedRange.min), q.answer, {
        kind: 'range',
        range: q.acceptedRange,
      }),
    ).toBe(true);
  });
});

describe('factors helpers', () => {
  it('lists factor pairs', () => {
    expect(factorPairs(12)).toEqual([
      [1, 12],
      [2, 6],
      [3, 4],
    ]);
  });

  it('detects primes', () => {
    expect(isPrime(17)).toBe(true);
    expect(isPrime(15)).toBe(false);
  });

  it('normalizes factor pair answers in any order', () => {
    expect(normalizeFactorPairsAnswer('3x4, 1×12, 2*6')).toBe('1x12,2x6,3x4');
  });

  it('normalizes list answers', () => {
    expect(normalizeListAnswer('2, 4, 6, 8, 10')).toBe('2,4,6,8,10');
  });

  it('generates each factors type', () => {
    expect(generateFactors({ grade: 3, type: 'pairs' }).answerKind).toBe('factor_pairs');
    expect(generateFactors({ grade: 4, type: 'multiples' }).answerKind).toBe('yesno');
    expect(generateFactors({ grade: 5, type: 'list_multiples' }).answerKind).toBe('list');
    expect(['prime', 'composite', 'neither']).toContain(
      generateFactors({ grade: 4, type: 'prime_composite' }).answer,
    );
  });
});

describe('missing symbol', () => {
  it('returns a valid symbol', () => {
    const q = generateMissingSymbol({ grade: 3 });
    expect(['+', '−', '×', '÷', '=', '<', '>']).toContain(q.answer);
  });

  it('matches symbol variants', () => {
    expect(answersMatch('x', '×', { kind: 'symbol' })).toBe(true);
    expect(answersMatch('-', '−', { kind: 'symbol' })).toBe(true);
    expect(answersMatch('/', '÷', { kind: 'symbol' })).toBe(true);
  });
});

describe('estimate', () => {
  it('produces accepted answers', () => {
    const q = generateEstimate({ grade: 4 });
    expect(q.accepted.length).toBeGreaterThan(0);
    expect(
      answersMatch(String(q.accepted[0]), q.answer, {
        kind: 'accepted_list',
        accepted: q.accepted,
      }),
    ).toBe(true);
  });
});

describe('times as many', () => {
  it('normalizes equations', () => {
    expect(normalizeEquation('24 = 3 × 8')).toBe('24=3x8');
  });

  it('accepts write-equation variants', () => {
    const q = generateTimesAsMany({ grade: 3, type: 'write_equation' });
    expect(q.answerKind).toBe('equation_list');
    expect(
      answersMatch(q.accepted[0], q.answer, {
        kind: 'equation_list',
        accepted: q.accepted,
      }),
    ).toBe(true);
  });

  it('generates numeric answers for equation/word', () => {
    expect(Number(generateTimesAsMany({ grade: 3, type: 'equation' }).answer)).toBeGreaterThan(0);
    expect(Number(generateTimesAsMany({ grade: 4, type: 'word' }).answer)).toBeGreaterThan(0);
  });
});
