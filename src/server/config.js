export const SPREADSHEET_ID = '1IZu9YHE-xtqNPIsVdFZ2r1J92yjsFBdbHHshLkBhJFw';

export const SHEET_NAMES = {
  wordProblems: 'WordProblems',
  quotes: 'Quotes',
  config: 'Config',
};

export const GRADES = [3, 4, 5];

export { DIFFICULTIES, normalizeDifficulty } from './difficulty.js';

export const WORD_PROBLEM_TYPES = [
  { id: 'operations', label: 'Operations' },
  { id: 'add_then_subtract', label: 'Add then subtract' },
  { id: 'multiply_and_divide', label: 'Multiply and divide' },
  { id: 'time', label: 'Time' },
  { id: 'money', label: 'Money' },
  { id: 'measurement', label: 'Measurement' },
];

/** Legacy times-table ranges (Config keys mult_grade_N_min/max). Kept as fallback only. */
export const DEFAULT_MULTIPLICATION_RANGES = {
  3: { min: 1, max: 10 },
  4: { min: 1, max: 12 },
  5: { min: 2, max: 15 },
};

/** Standard-algorithm practice types shown in the Multiplication activity. */
export const MULTIPLICATION_TYPES = [
  { id: '1_digit', label: '1-digit multiplier' },
  { id: '2_digit', label: '2-digit multiplier' },
];

/**
 * Ranges for standard algorithm generation.
 * multiplicand = top number, multiplier = bottom number.
 */
export const MULTIPLICATION_ALGORITHM_RANGES = {
  '1_digit': {
    3: { multiplicand: { min: 10, max: 99 }, multiplier: { min: 2, max: 9 } },
    4: { multiplicand: { min: 10, max: 999 }, multiplier: { min: 2, max: 9 } },
    5: { multiplicand: { min: 100, max: 999 }, multiplier: { min: 2, max: 9 } },
  },
  '2_digit': {
    3: { multiplicand: { min: 10, max: 50 }, multiplier: { min: 10, max: 20 } },
    4: { multiplicand: { min: 10, max: 99 }, multiplier: { min: 10, max: 50 } },
    5: { multiplicand: { min: 10, max: 99 }, multiplier: { min: 10, max: 99 } },
  },
};

/** Addition addend ranges by grade (medium difficulty). */
export const ADDITION_RANGES = {
  3: { min: 10, max: 999 },
  4: { min: 100, max: 9999 },
  5: { min: 1000, max: 99999 },
};

/** Subtraction minuend ranges by grade (medium difficulty). */
export const SUBTRACTION_RANGES = {
  3: { min: 20, max: 999 },
  4: { min: 100, max: 9999 },
  5: { min: 1000, max: 99999 },
};

export const DIVISION_TYPES = [
  { id: 'facts', label: 'Facts' },
  { id: 'divide', label: 'Divide' },
  { id: 'long_division', label: 'Long division' },
];

export { PLACE_VALUE_TYPES } from './place-value.js';

export {
  FACTORS_TYPES,
  ROUNDING_TYPES,
  TIMES_AS_MANY_TYPES,
} from './phase2.js';

export {
  MEASUREMENT_TYPES,
  MONEY_COUNT_TYPES,
  TIME_TYPES,
} from './phase3.js';

export {
  FRACTION_TYPES,
  INPUT_OUTPUT_TYPES,
} from './phase4.js';

export const PROBLEM_CACHE_SECONDS = 30 * 60;
