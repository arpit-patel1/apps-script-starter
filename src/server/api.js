import {
  DIVISION_TYPES,
  FACTORS_TYPES,
  GRADES,
  MULTIPLICATION_TYPES,
  PLACE_VALUE_TYPES,
  ROUNDING_TYPES,
  TIMES_AS_MANY_TYPES,
  WORD_PROBLEM_TYPES,
} from './config.js';
import { answersMatch } from './grading.js';
import {
  createAdditionProblem,
  createDivisionProblem,
  createEstimateProblem,
  createFactorsProblem,
  createMissingSymbolProblem,
  createMultiplicationProblem,
  createPlaceValueProblem,
  createRoundingProblem,
  createSubtractionProblem,
  createTimesAsManyProblem,
  createWordProblem,
  lookupWordProblemAnswer,
  recallAnswer,
  recallAnswerExtra,
  recallAnswerKind,
} from './problems.js';
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

export const getMeta = () => {
  ensureDatabase();
  return {
    grades: GRADES,
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
      { id: 'word', label: 'Word problem' },
    ],
    types: WORD_PROBLEM_TYPES,
    multiplicationTypes: MULTIPLICATION_TYPES,
    divisionTypes: DIVISION_TYPES,
    placeValueTypes: PLACE_VALUE_TYPES,
    roundingTypes: ROUNDING_TYPES,
    factorsTypes: FACTORS_TYPES,
    timesAsManyTypes: TIMES_AS_MANY_TYPES,
  };
};

/** Homepage content: random active quotes from the Quotes sheet. */
export const getHomeContent = () => {
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
  ensureDatabase();
  const mode = String(options.mode || 'multiplication');
  const grade = Number(options.grade || 3);
  const type = options.type || null;
  const excludeId = options.excludeId || null;

  if (!GRADES.includes(grade)) {
    throw new Error(`Unsupported grade: ${options.grade}`);
  }

  if (mode === 'addition') {
    return createAdditionProblem({ grade, excludeId });
  }
  if (mode === 'subtraction') {
    return createSubtractionProblem({ grade, excludeId });
  }
  if (mode === 'multiplication') {
    return createMultiplicationProblem({ grade, type, excludeId });
  }
  if (mode === 'division') {
    return createDivisionProblem({ grade, type, excludeId });
  }
  if (mode === 'place_value') {
    return createPlaceValueProblem({ grade, type, excludeId });
  }
  if (mode === 'rounding') {
    return createRoundingProblem({ grade, type, excludeId });
  }
  if (mode === 'factors') {
    return createFactorsProblem({ grade, type, excludeId });
  }
  if (mode === 'missing_symbol') {
    return createMissingSymbolProblem({ grade, excludeId });
  }
  if (mode === 'estimate') {
    return createEstimateProblem({ grade, excludeId });
  }
  if (mode === 'times_as_many') {
    return createTimesAsManyProblem({ grade, type, excludeId });
  }
  if (mode === 'word') {
    return createWordProblem({ grade, type, excludeId });
  }

  throw new Error(`Unsupported mode: ${mode}`);
};

export const checkAnswer = (options = {}) => {
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
  }

  return {
    correct,
    correctAnswer: correct ? undefined : reveal,
  };
};
