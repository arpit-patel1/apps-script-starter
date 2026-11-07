import { answersMatch } from './grading.js';
import {
  formatFraction,
  generateFractions,
  generateInputOutput,
  generateOrderOfOperations,
  normalizeFractionAnswer,
  simplifyFraction,
} from './phase4.js';

describe('fraction helpers', () => {
  it('simplifies and formats', () => {
    expect(simplifyFraction(2, 4)).toEqual({ num: 1, den: 2 });
    expect(formatFraction(3, 2)).toBe('1 1/2');
    expect(normalizeFractionAnswer('1 1/2')).toBe('1 1/2');
    expect(normalizeFractionAnswer('2/4')).toBe('1/2');
  });

  it('generates ops and compare', () => {
    const add = generateFractions({ grade: 3, type: 'add' });
    expect(add.answerKind).toBe('fraction');
    expect(answersMatch(add.answer, add.answer, { kind: 'fraction' })).toBe(true);

    const compare = generateFractions({ grade: 4, type: 'compare' });
    expect(['<', '>', '=']).toContain(compare.answer);

    const mult = generateFractions({ grade: 5, type: 'multiply' });
    expect(mult.answer).toBeTruthy();
  });
});

describe('order of operations', () => {
  it('returns a non-negative integer answer', () => {
    const q = generateOrderOfOperations({ grade: 4 });
    expect(Number(q.answer)).toBeGreaterThanOrEqual(0);
    expect(q.prompt).toMatch(/order of operations/i);
  });
});

describe('input output', () => {
  it('generates fill lists and find-rule labels', () => {
    const fill = generateInputOutput({ grade: 3, type: 'fill' });
    expect(fill.answerKind).toBe('list');
    expect(fill.answer.split(',').length).toBeGreaterThanOrEqual(1);

    const rule = generateInputOutput({ grade: 4, type: 'find_rule' });
    expect(rule.answerKind).toBe('io_rule');
    expect(rule.answer).toMatch(/^[+−×] \d+$/);
    expect(answersMatch(rule.answer.replace('−', '-').replace('×', 'x'), rule.answer, { kind: 'io_rule' })).toBe(
      true,
    );
  });
});
