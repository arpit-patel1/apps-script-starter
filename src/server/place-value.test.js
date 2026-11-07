import {
  expandedForm,
  generatePlaceValue,
  normalizeExpandedAnswer,
  numberToWord,
} from './place-value.js';

describe('place-value helpers', () => {
  it('builds expanded form', () => {
    expect(expandedForm(3205)).toBe('3000 + 200 + 5');
  });

  it('normalizes expanded answers', () => {
    expect(normalizeExpandedAnswer('3,000 + 200 + 5')).toBe('3000+200+5');
    expect(normalizeExpandedAnswer('5+200+3000')).toBe('3000+200+5');
  });

  it('converts numbers to words', () => {
    expect(numberToWord(42)).toBe('forty-two');
    expect(numberToWord(105)).toContain('hundred');
  });
});

describe('generatePlaceValue', () => {
  it('creates digit value questions', () => {
    const q = generatePlaceValue({ grade: 3, type: 'digit_value' });
    expect(q.type).toBe('digit_value');
    expect(Number(q.answer)).toBeGreaterThan(0);
  });

  it('creates compare answers as symbols', () => {
    const q = generatePlaceValue({ grade: 4, type: 'compare' });
    expect(['<', '>', '=']).toContain(q.answer);
  });
});
