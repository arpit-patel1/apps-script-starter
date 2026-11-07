import {
  DIFFICULTIES,
  DIVISION_TYPES,
  FACTORS_TYPES,
  FRACTION_TYPES,
  GEOGRAPHY_TYPES,
  GRADES,
  INPUT_OUTPUT_TYPES,
  MEASUREMENT_TYPES,
  MONEY_COUNT_TYPES,
  MULTIPLICATION_TYPES,
  PATTERN_TYPES,
  PLACE_VALUE_TYPES,
  ROUNDING_TYPES,
  TIME_TYPES,
  TIMES_AS_MANY_TYPES,
  WORD_PROBLEM_TYPES,
  normalizeDifficulty,
} from './config.js';
import { requireUser } from './auth.js';
import { answersMatch } from './grading.js';
import {
  createAdditionProblem,
  createDivisionProblem,
  createEstimateProblem,
  createFactorsProblem,
  createFillBlankProblem,
  createFractionsProblem,
  createGeographyProblem,
  createInputOutputProblem,
  createMeasurementProblem,
  createMissingSymbolProblem,
  createMoneyChangeProblem,
  createMoneyCompareProblem,
  createMoneyCountProblem,
  createMultiplicationProblem,
  createOrderOfOperationsProblem,
  createPatternProblem,
  createPlaceValueProblem,
  createRiddleProblem,
  createRoundingProblem,
  createScienceQuizProblem,
  createSubtractionProblem,
  createTimeProblem,
  createTimesAsManyProblem,
  createWordProblem,
  formatCents,
  lookupWordProblemAnswer,
  recallAnswer,
  recallAnswerExtra,
  recallAnswerKind,
} from './problems.js';
import { getScienceQuizKeys } from './modal.js';
import { ensureDatabase } from './seed.js';
import { getConfigMap, getQuotes } from './sheets.js';

const shuffle = (items) => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export { getSession, login, logout } from './auth.js';

export const getMeta = (options = {}) => {
  requireUser(options.token);
  ensureDatabase();
  return {
    grades: GRADES,
    difficulties: DIFFICULTIES,
    modes: [
      { id: 'addition', label: 'Addition' },
      { id: 'subtraction', label: 'Subtraction' },
      { id: 'multiplication', label: 'Multiplication' },
      { id: 'division', label: 'Division' },
      { id: 'place_value', label: 'Place value' },
      { id: 'rounding', label: 'Rounding' },
      { id: 'factors', label: 'Factors & multiples' },
      { id: 'missing_symbol', label: 'Missing symbol' },
      { id: 'estimate', label: 'Estimate' },
      { id: 'times_as_many', label: 'Times as many' },
      { id: 'money_count', label: 'Money — coins & bills' },
      { id: 'money_change', label: 'Money — change' },
      { id: 'money_compare', label: 'Money — compare' },
      { id: 'measurement', label: 'Measurement' },
      { id: 'time', label: 'Time' },
      { id: 'fractions', label: 'Fractions' },
      { id: 'order_of_operations', label: 'Order of operations' },
      { id: 'input_output', label: 'Input/output' },
      { id: 'word', label: 'Word problem' },
      { id: 'geography', label: 'Geography' },
      { id: 'pattern', label: 'Patterns' },
      { id: 'riddle', label: 'Riddles' },
      { id: 'fill_blank', label: 'Fill in the blank' },
      { id: 'science_quiz', label: 'Science quiz' },
    ],
    types: WORD_PROBLEM_TYPES,
    multiplicationTypes: MULTIPLICATION_TYPES,
    divisionTypes: DIVISION_TYPES,
    placeValueTypes: PLACE_VALUE_TYPES,
    roundingTypes: ROUNDING_TYPES,
    factorsTypes: FACTORS_TYPES,
    timesAsManyTypes: TIMES_AS_MANY_TYPES,
    moneyCountTypes: MONEY_COUNT_TYPES,
    measurementTypes: MEASUREMENT_TYPES,
    timeTypes: TIME_TYPES,
    fractionTypes: FRACTION_TYPES,
    inputOutputTypes: INPUT_OUTPUT_TYPES,
    geographyTypes: GEOGRAPHY_TYPES,
    patternTypes: PATTERN_TYPES,
    scienceQuizTypes: getScienceQuizKeys().map((key) => ({
      id: key,
      label: key.replace(/[-_]/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
    })),
  };
};

/** Homepage content: random active quotes from the Quotes sheet. */
export const getHomeContent = (options = {}) => {
  requireUser(options.token);
  ensureDatabase();
  const config = getConfigMap();
  const requested = Number(config.home_quote_count);
  const count = Number.isFinite(requested) && requested > 0 ? Math.min(requested, 6) : 3;
  const quotes = shuffle(getQuotes()).slice(0, count);

  return {
    quotes,
    featured: quotes[0] || null,
  };
};

export const getNextProblem = (options = {}) => {
  requireUser(options.token);
  ensureDatabase();
  const mode = String(options.mode || 'multiplication');
  const grade = Number(options.grade || 3);
  const type = options.type || null;
  const difficulty = normalizeDifficulty(options.difficulty);
  const excludeId = options.excludeId || null;

  if (!GRADES.includes(grade)) {
    throw new Error(`Unsupported grade: ${options.grade}`);
  }

  if (mode === 'addition') {
    return createAdditionProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'subtraction') {
    return createSubtractionProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'multiplication') {
    return createMultiplicationProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'division') {
    return createDivisionProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'place_value') {
    return createPlaceValueProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'rounding') {
    return createRoundingProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'factors') {
    return createFactorsProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'missing_symbol') {
    return createMissingSymbolProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'estimate') {
    return createEstimateProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'times_as_many') {
    return createTimesAsManyProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'money_count') {
    return createMoneyCountProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'money_change') {
    return createMoneyChangeProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'money_compare') {
    return createMoneyCompareProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'measurement') {
    return createMeasurementProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'time') {
    return createTimeProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'fractions') {
    return createFractionsProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'order_of_operations') {
    return createOrderOfOperationsProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'input_output') {
    return createInputOutputProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'word') {
    return createWordProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'geography') {
    return createGeographyProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'pattern') {
    return createPatternProblem({ grade, type, difficulty, excludeId });
  }
  if (mode === 'riddle') {
    return createRiddleProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'fill_blank') {
    return createFillBlankProblem({ grade, difficulty, excludeId });
  }
  if (mode === 'science_quiz') {
    return createScienceQuizProblem({ grade, type, difficulty, excludeId });
  }

  throw new Error(`Unsupported mode: ${mode}`);
};

export const checkAnswer = (options = {}) => {
  requireUser(options.token);
  const mode = String(options.mode || '');
  const id = String(options.id || '');
  const userAnswer = options.userAnswer;

  if (!id) {
    throw new Error('Missing problem id.');
  }

  let correctAnswer = recallAnswer(id);

  if (correctAnswer === null || correctAnswer === undefined || correctAnswer === '') {
    if (mode === 'word') {
      correctAnswer = lookupWordProblemAnswer(id);
    }
  }

  if (correctAnswer === null || correctAnswer === undefined || correctAnswer === '') {
    throw new Error('Problem expired. Tap Next for a new one.');
  }

  const answerKind = recallAnswerKind(id) || options.answerKind || null;
  const extra = recallAnswerExtra(id) || {};
  const correct = answersMatch(userAnswer, correctAnswer, {
    kind: answerKind || undefined,
    range: extra.range,
    accepted: extra.accepted,
  });

  let reveal = String(correctAnswer);
  if (answerKind === 'range' && extra.range) {
    reveal = `any number from ${extra.range.min} to ${extra.range.max}`;
  } else if (answerKind === 'accepted_list' && Array.isArray(extra.accepted)) {
    reveal = extra.accepted.join(' or ');
  } else if (answerKind === 'geo_list' && Array.isArray(extra.accepted)) {
    reveal = extra.accepted.slice(0, 6).join(', ') + (extra.accepted.length > 6 ? ', …' : '');
  } else if (answerKind === 'money' && Number.isFinite(Number(correctAnswer))) {
    reveal = formatCents(Number(correctAnswer));
  }

  return {
    correct,
    correctAnswer: correct ? undefined : reveal,
  };
};

/** Reveal the stored answer without grading (e.g. riddles). */
export const revealAnswer = (options = {}) => {
  requireUser(options.token);
  const mode = String(options.mode || '');
  const id = String(options.id || '');

  if (!id) {
    throw new Error('Missing problem id.');
  }

  let correctAnswer = recallAnswer(id);
  if (correctAnswer === null || correctAnswer === undefined || correctAnswer === '') {
    if (mode === 'word') {
      correctAnswer = lookupWordProblemAnswer(id);
    }
  }

  if (correctAnswer === null || correctAnswer === undefined || correctAnswer === '') {
    throw new Error('Problem expired. Tap Next for a new one.');
  }

  const answerKind = recallAnswerKind(id) || options.answerKind || null;
  const extra = recallAnswerExtra(id) || {};
  let reveal = String(correctAnswer);
  if (answerKind === 'range' && extra.range) {
    reveal = `any number from ${extra.range.min} to ${extra.range.max}`;
  } else if (answerKind === 'accepted_list' && Array.isArray(extra.accepted)) {
    reveal = extra.accepted.join(' or ');
  } else if (answerKind === 'geo_list' && Array.isArray(extra.accepted)) {
    reveal = extra.accepted.slice(0, 6).join(', ') + (extra.accepted.length > 6 ? ', …' : '');
  } else if (answerKind === 'money' && Number.isFinite(Number(correctAnswer))) {
    reveal = formatCents(Number(correctAnswer));
  }

  return { correctAnswer: reveal };
};
