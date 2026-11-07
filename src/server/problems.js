import { PROBLEM_CACHE_SECONDS } from './config.js';
import { generateAddition } from './addition.js';
import { generateDivision } from './division.js';
import { generateAlgorithmFactors } from './multiplication.js';
import {
  generateEstimate,
  generateFactors,
  generateMissingSymbol,
  generateRounding,
  generateTimesAsMany,
} from './phase2.js';
import {
  formatCents,
  generateMeasurement,
  generateMoneyChange,
  generateMoneyCompare,
  generateMoneyCount,
  generateTime,
} from './phase3.js';
import {
  generateFractions,
  generateInputOutput,
  generateOrderOfOperations,
} from './phase4.js';
import { generatePlaceValue } from './place-value.js';
import { generateSubtraction } from './subtraction.js';
import { getWordProblems } from './sheets.js';

const cacheKey = (id) => `problem:${id}`;
const kindKey = (id) => `problem-kind:${id}`;
const extraKey = (id) => `problem-extra:${id}`;

const rememberAnswer = (id, answer) => {
  CacheService.getScriptCache().put(cacheKey(id), String(answer), PROBLEM_CACHE_SECONDS);
};

const rememberKind = (id, kind) => {
  if (!kind) return;
  CacheService.getScriptCache().put(kindKey(id), kind, PROBLEM_CACHE_SECONDS);
};

const rememberExtra = (id, extra) => {
  if (!extra) return;
  CacheService.getScriptCache().put(extraKey(id), JSON.stringify(extra), PROBLEM_CACHE_SECONDS);
};

export const recallAnswer = (id) => CacheService.getScriptCache().get(cacheKey(id));
export const recallAnswerKind = (id) => CacheService.getScriptCache().get(kindKey(id));
export const recallAnswerExtra = (id) => {
  const raw = CacheService.getScriptCache().get(extraKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

export const createMultiplicationProblem = ({ grade, type, difficulty } = {}) => {
  const factors = generateAlgorithmFactors({ grade: Number(grade), type, difficulty });
  const { multiplicand, multiplier, product, type: kind } = factors;
  const id = `mult-${grade}-${kind}-${multiplicand}x${multiplier}-${Date.now()}`;
  rememberAnswer(id, product);

  return {
    id,
    mode: 'multiplication',
    grade: Number(grade),
    type: kind,
    difficulty: difficulty || 'medium',
    display: 'standard_algorithm',
    prompt: 'Multiply using the standard algorithm.',
    layout: {
      top: multiplicand,
      bottom: multiplier,
      operator: '×',
    },
    hint: 'Write the product (final answer).',
  };
};

export const createAdditionProblem = ({ grade, difficulty } = {}) => {
  const { a, b, sum } = generateAddition({ grade: Number(grade), difficulty });
  const id = `add-${grade}-${a}+${b}-${Date.now()}`;
  rememberAnswer(id, sum);

  return {
    id,
    mode: 'addition',
    grade: Number(grade),
    difficulty: difficulty || 'medium',
    display: 'standard_algorithm',
    prompt: 'Add using the standard algorithm.',
    layout: { top: a, bottom: b, operator: '+' },
    hint: 'Write the sum.',
  };
};

export const createSubtractionProblem = ({ grade, difficulty } = {}) => {
  const { a, b, difference } = generateSubtraction({ grade: Number(grade), difficulty });
  const id = `sub-${grade}-${a}-${b}-${Date.now()}`;
  rememberAnswer(id, difference);

  return {
    id,
    mode: 'subtraction',
    grade: Number(grade),
    difficulty: difficulty || 'medium',
    display: 'standard_algorithm',
    prompt: 'Subtract using the standard algorithm.',
    layout: { top: a, bottom: b, operator: '−' },
    hint: 'Write the difference.',
  };
};

export const createDivisionProblem = ({ grade, type, difficulty } = {}) => {
  const q = generateDivision({ grade: Number(grade), type, difficulty });
  const id = `div-${grade}-${q.type}-${q.dividend}d${q.divisor}-${Date.now()}`;
  rememberAnswer(id, q.answer);

  const display = q.type === 'long_division' ? 'long_division' : 'standard_algorithm';

  return {
    id,
    mode: 'division',
    grade: Number(grade),
    type: q.type,
    difficulty: difficulty || 'medium',
    display,
    prompt:
      q.type === 'facts'
        ? 'Division facts — find the quotient.'
        : q.type === 'long_division'
          ? 'Use long division. Enter quotient (and remainder if needed).'
          : 'Divide. Enter quotient (and remainder if needed).',
    layout: {
      top: q.dividend,
      bottom: q.divisor,
      operator: '÷',
      dividend: q.dividend,
      divisor: q.divisor,
    },
    hint: q.remainder
      ? 'If there is a remainder, write it like: 12 r 3'
      : 'Write the quotient.',
  };
};

export const createPlaceValueProblem = ({ grade, type, difficulty } = {}) => {
  const q = generatePlaceValue({ grade: Number(grade), type, difficulty });
  const id = `pv-${grade}-${q.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  rememberAnswer(id, q.answer);
  rememberKind(id, q.answerKind);

  return {
    id,
    mode: 'place_value',
    grade: Number(grade),
    type: q.type,
    difficulty: difficulty || 'medium',
    display: 'text',
    prompt: q.prompt,
    hint: q.hint || null,
    answerKind: q.answerKind || null,
  };
};

const createTextProblem = ({ mode, grade, type, difficulty, generate }) => {
  const q = generate({ grade: Number(grade), type, difficulty });
  const id = `${mode}-${grade}-${q.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  rememberAnswer(id, q.answer);
  rememberKind(id, q.answerKind || (mode === 'missing_symbol' ? 'symbol' : null));
  const extra = {};
  if (q.acceptedRange) extra.range = q.acceptedRange;
  if (q.accepted) extra.accepted = q.accepted;
  if (Object.keys(extra).length) rememberExtra(id, extra);

  return {
    id,
    mode,
    grade: Number(grade),
    type: q.type,
    difficulty: difficulty || 'medium',
    display: 'text',
    prompt: q.prompt,
    hint: q.hint || null,
    answerKind: q.answerKind || (mode === 'missing_symbol' ? 'symbol' : null),
  };
};

export const createRoundingProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'rounding', grade, type, difficulty, generate: generateRounding });

export const createFactorsProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'factors', grade, type, difficulty, generate: generateFactors });

export const createMissingSymbolProblem = ({ grade, difficulty } = {}) =>
  createTextProblem({ mode: 'missing_symbol', grade, difficulty, generate: generateMissingSymbol });

export const createEstimateProblem = ({ grade, difficulty } = {}) =>
  createTextProblem({ mode: 'estimate', grade, difficulty, generate: generateEstimate });

export const createTimesAsManyProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'times_as_many', grade, type, difficulty, generate: generateTimesAsMany });

export const createMoneyCountProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'money_count', grade, type, difficulty, generate: generateMoneyCount });

export const createMoneyChangeProblem = ({ grade, difficulty } = {}) =>
  createTextProblem({ mode: 'money_change', grade, difficulty, generate: generateMoneyChange });

export const createMoneyCompareProblem = ({ grade, difficulty } = {}) =>
  createTextProblem({ mode: 'money_compare', grade, difficulty, generate: generateMoneyCompare });

export const createMeasurementProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'measurement', grade, type, difficulty, generate: generateMeasurement });

export const createTimeProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'time', grade, type, difficulty, generate: generateTime });

export const createFractionsProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'fractions', grade, type, difficulty, generate: generateFractions });

export const createOrderOfOperationsProblem = ({ grade, difficulty } = {}) =>
  createTextProblem({
    mode: 'order_of_operations',
    grade,
    difficulty,
    generate: generateOrderOfOperations,
  });

export const createInputOutputProblem = ({ grade, type, difficulty } = {}) =>
  createTextProblem({ mode: 'input_output', grade, type, difficulty, generate: generateInputOutput });

export { formatCents };

export const createWordProblem = ({ grade, type, excludeId } = {}) => {
  let candidates = getWordProblems().filter((problem) => problem.grade === Number(grade));

  if (type) {
    candidates = candidates.filter((problem) => problem.type === type);
  }

  if (excludeId) {
    const withoutLast = candidates.filter((problem) => problem.id !== excludeId);
    if (withoutLast.length > 0) {
      candidates = withoutLast;
    }
  }

  if (candidates.length === 0) {
    throw new Error(
      `No active word problems found for grade ${grade}${type ? ` and type ${type}` : ''}.`,
    );
  }

  const problem = pickRandom(candidates);
  rememberAnswer(problem.id, problem.answer);

  return {
    id: problem.id,
    mode: 'word',
    grade: problem.grade,
    type: problem.type,
    prompt: problem.prompt,
    hint: problem.answerUnit || null,
  };
};

export const lookupWordProblemAnswer = (id) => {
  const problem = getWordProblems().find((item) => item.id === id);
  return problem ? problem.answer : null;
};
