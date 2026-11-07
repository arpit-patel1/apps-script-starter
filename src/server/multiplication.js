import { MULTIPLICATION_ALGORITHM_RANGES } from './config.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const normalizeMultiplicationType = (type) =>
  type === '2_digit' ? '2_digit' : '1_digit';

export const getAlgorithmRange = (type, grade) => {
  const byType = MULTIPLICATION_ALGORITHM_RANGES[normalizeMultiplicationType(type)] || {};
  return byType[Number(grade)] || byType[3];
};

/** Build multiplicand × multiplier for standard-algorithm practice. */
export const generateAlgorithmFactors = ({ type, grade } = {}) => {
  const kind = normalizeMultiplicationType(type);
  const range = getAlgorithmRange(kind, grade);
  const multiplicand = randomInt(range.multiplicand.min, range.multiplicand.max);
  const multiplier = randomInt(range.multiplier.min, range.multiplier.max);

  return {
    type: kind,
    multiplicand,
    multiplier,
    product: multiplicand * multiplier,
  };
};
