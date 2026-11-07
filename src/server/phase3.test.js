import { answersMatch } from './grading.js';
import {
  formatCents,
  generateMeasurement,
  generateMoneyChange,
  generateMoneyCompare,
  generateMoneyCount,
  generateTime,
  normalizeTimeAnswer,
  parseMoneyToCents,
  sumItems,
} from './phase3.js';

describe('money helpers', () => {
  it('formats and parses money', () => {
    expect(formatCents(125)).toBe('$1.25');
    expect(parseMoneyToCents('$1.25')).toBe(125);
    expect(parseMoneyToCents('1.25')).toBe(125);
    expect(parseMoneyToCents('125¢')).toBe(125);
  });

  it('counts coin piles', () => {
    expect(sumItems([{ denom: 'quarter', count: 2 }, { denom: 'dime', count: 1 }])).toBe(60);
  });

  it('generates count and make questions', () => {
    const count = generateMoneyCount({ grade: 3, type: 'count' });
    expect(count.answerKind).toBe('money');
    expect(answersMatch(formatCents(Number(count.answer)), count.answer, { kind: 'money' })).toBe(
      true,
    );

    const make = generateMoneyCount({ grade: 4, type: 'make' });
    expect(Number(make.answer)).toBeGreaterThan(0);
  });

  it('generates change and compare', () => {
    const change = generateMoneyChange({ grade: 3 });
    expect(change.answerKind).toBe('money');
    expect(Number(change.answer)).toBeGreaterThanOrEqual(0);

    const compare = generateMoneyCompare({ grade: 4 });
    expect(['<', '>', '=']).toContain(compare.answer);
  });
});

describe('measurement', () => {
  it('converts with integer answers', () => {
    const q = generateMeasurement({ grade: 3, type: 'length' });
    expect(Number(q.answer)).toBeGreaterThan(0);
    expect(q.prompt).toMatch(/Convert/);
  });
});

describe('time', () => {
  it('normalizes digital times', () => {
    expect(normalizeTimeAnswer('3:30')).toBe('3:30');
    expect(normalizeTimeAnswer(' 03:05 ')).toBe('3:05');
  });

  it('generates read/elapsed/convert', () => {
    expect(generateTime({ grade: 3, type: 'read' }).answer).toMatch(/^\d{1,2}:\d{2}$/);
    expect(generateTime({ grade: 4, type: 'elapsed' }).answerKind).toBe('time');
    expect(generateTime({ grade: 5, type: 'convert' }).answer).toBeTruthy();
  });
});
