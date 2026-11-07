import { SUBTRACTION_RANGES } from './config.js';
import { scaleRange } from './difficulty.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateSubtraction = ({ grade, difficulty } = {}) => {
  const base = SUBTRACTION_RANGES[Number(grade)] || SUBTRACTION_RANGES[3];
  const range = scaleRange(base, difficulty);
  const a = randomInt(range.min, range.max);
  const b = randomInt(1, a - 1);
  return { a, b, difference: a - b };
};
