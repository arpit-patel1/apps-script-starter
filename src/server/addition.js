import { ADDITION_RANGES } from './config.js';
import { scaleRange } from './difficulty.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateAddition = ({ grade, difficulty } = {}) => {
  const base = ADDITION_RANGES[Number(grade)] || ADDITION_RANGES[3];
  const range = scaleRange(base, difficulty);
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);
  return { a, b, sum: a + b };
};
