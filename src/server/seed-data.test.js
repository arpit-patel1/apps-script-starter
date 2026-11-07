import { WORD_PROBLEM_TYPES } from './config.js';
import { WORD_PROBLEM_SEED } from './seed-data.js';

describe('WORD_PROBLEM_SEED', () => {
  const typeIds = new Set(WORD_PROBLEM_TYPES.map((t) => t.id));

  it('has unique ids', () => {
    const ids = WORD_PROBLEM_SEED.map((row) => row[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers grades 3–5, known types, and difficulties', () => {
    const grades = new Set();
    const types = new Set();
    const difficulties = new Set();

    WORD_PROBLEM_SEED.forEach((row) => {
      const [, grade, type, prompt, answer, , difficulty] = row;
      expect(typeIds.has(type)).toBe(true);
      expect(prompt).toBeTruthy();
      expect(answer === 0 || Boolean(answer)).toBe(true);
      expect(['easy', 'medium', 'hard']).toContain(difficulty);
      grades.add(grade);
      types.add(type);
      difficulties.add(difficulty);
    });

    expect(grades.has(3) && grades.has(4) && grades.has(5)).toBe(true);
    expect(types.size).toBe(WORD_PROBLEM_TYPES.length);
    expect(difficulties.has('easy') && difficulties.has('medium') && difficulties.has('hard')).toBe(
      true,
    );
  });

  it('is substantially larger than the original 16-row seed', () => {
    expect(WORD_PROBLEM_SEED.length).toBeGreaterThanOrEqual(50);
  });
});
