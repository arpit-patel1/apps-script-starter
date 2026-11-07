export const DIFFICULTIES = [
  { id: 'easy', label: 'E', full: 'Easy' },
  { id: 'medium', label: 'M', full: 'Medium' },
  { id: 'hard', label: 'H', full: 'Hard' },
];

export const normalizeDifficulty = (value) => {
  const text = String(value || '').toLowerCase();
  if (text === 'easy' || text === 'e') return 'easy';
  if (text === 'hard' || text === 'h') return 'hard';
  return 'medium';
};

/** Shrink/expand a {min,max} range for easy / medium / hard. */
export const scaleRange = (range, difficulty) => {
  const min = Number(range.min);
  const max = Number(range.max);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return { min, max };
  }
  const span = max - min;
  const level = normalizeDifficulty(difficulty);
  if (level === 'easy') {
    return { min, max: Math.max(min + 1, min + Math.floor(span * 0.4)) };
  }
  if (level === 'hard') {
    return { min: Math.max(min, min + Math.floor(span * 0.5)), max };
  }
  return { min, max };
};

/** Scale nested algorithm ranges like { multiplicand: {min,max}, multiplier: {min,max} }. */
export const scaleAlgorithmRange = (range, difficulty) => ({
  multiplicand: scaleRange(range.multiplicand, difficulty),
  multiplier: scaleRange(range.multiplier, difficulty),
});
