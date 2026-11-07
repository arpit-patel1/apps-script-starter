import {
  normalizeEquation,
  normalizeFactorPairsAnswer,
  normalizeListAnswer,
} from './phase2.js';
import { normalizeTimeAnswer, parseMoneyToCents } from './phase3.js';
import { normalizeGeoAnswer } from './geography.js';
import { normalizeFractionAnswer, normalizeIoRule } from './phase4.js';
import { normalizeExpandedAnswer } from './place-value.js';

const normalizeYesNo = (value) => {
  const text = String(value ?? '')
    .trim()
    .toLowerCase();
  if (['yes', 'y', 'true', '1'].includes(text)) return 'yes';
  if (['no', 'n', 'false', '0'].includes(text)) return 'no';
  return text;
};

const normalizeSymbol = (value) => {
  const text = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/−/g, '-')
    .replace(/×/g, 'x')
    .replace(/\*/g, 'x')
    .replace(/÷/g, '/');
  if (text === '==') return '=';
  if (text === 'x') return '×';
  if (text === '/') return '÷';
  if (text === '-') return '−';
  if (text === '+') return '+';
  if (text === '<' || text === '>' || text === '=') return text;
  return text;
};

/**
 * Normalize a kid's answer for comparison.
 * Handles currency symbols, commas, whitespace, casing, and division remainders.
 */
export const normalizeAnswer = (value, options = {}) => {
  if (value === null || value === undefined) {
    return '';
  }

  if (options.kind === 'expanded') {
    return normalizeExpandedAnswer(value);
  }

  if (options.kind === 'factor_pairs') {
    return normalizeFactorPairsAnswer(value);
  }

  if (options.kind === 'list') {
    return normalizeListAnswer(value);
  }

  if (options.kind === 'yesno') {
    return normalizeYesNo(value);
  }

  if (options.kind === 'equation' || options.kind === 'equation_list') {
    return normalizeEquation(value);
  }

  if (options.kind === 'symbol') {
    return normalizeSymbol(value);
  }

  if (options.kind === 'money') {
    const cents = parseMoneyToCents(value);
    return cents === null ? '' : String(cents);
  }

  if (options.kind === 'time') {
    return normalizeTimeAnswer(value);
  }

  if (options.kind === 'fraction') {
    return normalizeFractionAnswer(value);
  }

  if (options.kind === 'io_rule') {
    return normalizeIoRule(value);
  }

  if (options.kind === 'geo' || options.kind === 'geo_list') {
    return normalizeGeoAnswer(value);
  }

  let text = String(value).trim().toLowerCase();
  text = text.replace(/[$,]/g, '');
  text = text.replace(/\s+/g, ' ');

  const asSymbol = normalizeSymbol(text);
  if (['+', '−', '×', '÷', '=', '<', '>'].includes(asSymbol)) {
    return asSymbol;
  }

  // Division remainders: "12r3", "12 R 3", "12 remainder 3" → "12 r 3"
  const remainderMatch = text.match(/^(\d+)\s*(?:r|rem|remainder)\s*(\d+)$/i);
  if (remainderMatch) {
    return `${Number(remainderMatch[1])} r ${Number(remainderMatch[2])}`;
  }

  const asNumber = Number(text);
  if (text !== '' && Number.isFinite(asNumber)) {
    return String(asNumber);
  }

  return text;
};

export const answersMatch = (userAnswer, correctAnswer, options = {}) => {
  const kind = options.kind;

  if (kind === 'range' && options.range) {
    const n = Number(String(userAnswer).replace(/[$,\s]/g, ''));
    if (!Number.isFinite(n)) return false;
    return n >= options.range.min && n <= options.range.max;
  }

  if (kind === 'accepted_list' && Array.isArray(options.accepted)) {
    const n = Number(String(userAnswer).replace(/[$,\s]/g, ''));
    if (!Number.isFinite(n)) return false;
    return options.accepted.map(Number).includes(n);
  }

  if (kind === 'equation_list' && Array.isArray(options.accepted)) {
    const got = normalizeEquation(userAnswer);
    return options.accepted.some((form) => normalizeEquation(form) === got);
  }

  if (kind === 'money') {
    const userCents = parseMoneyToCents(userAnswer);
    const expected = Number(correctAnswer);
    return userCents !== null && Number.isFinite(expected) && userCents === expected;
  }

  if (kind === 'geo_list' && Array.isArray(options.accepted)) {
    const got = normalizeGeoAnswer(userAnswer);
    return options.accepted.some((item) => normalizeGeoAnswer(item) === got);
  }

  return normalizeAnswer(userAnswer, options) === normalizeAnswer(correctAnswer, options);
};
