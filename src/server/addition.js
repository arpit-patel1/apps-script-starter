import { ADDITION_RANGES } from './config.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateAddition = ({ grade } = {}) => {
  const range = ADDITION_RANGES[Number(grade)] || ADDITION_RANGES[3];
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);
  return { a, b, sum: a + b };
};
