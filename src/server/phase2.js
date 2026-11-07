import { normalizeDifficulty, scaleRange } from './difficulty.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (items) => items[Math.floor(Math.random() * items.length)];
const fmt = (n) => Number(n).toLocaleString('en-US');

export const ROUNDING_TYPES = [
  { id: 'forward', label: 'Round' },
  { id: 'reverse', label: 'Which rounds?' },
];

export const FACTORS_TYPES = [
  { id: 'pairs', label: 'Factor pairs' },
  { id: 'multiples', label: 'Multiples' },
  { id: 'list_multiples', label: 'List multiples' },
  { id: 'prime_composite', label: 'Prime or composite' },
];

export const TIMES_AS_MANY_TYPES = [
  { id: 'equation', label: 'Equation' },
  { id: 'word', label: 'Word problem' },
  { id: 'write_equation', label: 'Write equation' },
];

export const roundToPlace = (n, to) => Math.round(n / to) * to;

const roundOptionsForGrade = (grade) => {
  if (Number(grade) <= 3) return [10, 100];
  if (Number(grade) === 4) return [10, 100, 1000];
  return [10, 100, 1000, 10000];
};

export const generateRounding = ({ grade, type, difficulty } = {}) => {
  const kind = type === 'reverse' ? 'reverse' : 'forward';
  const g = Number(grade) || 3;
  const baseMax = g <= 3 ? 9999 : g === 4 ? 99999 : 1000000;
  const { max } = scaleRange({ min: 20, max: baseMax }, difficulty);
  const roundTo = pick(roundOptionsForGrade(g));
  const number = randomInt(roundTo + 1, Math.max(roundTo + 2, max));
  const answer = roundToPlace(number, roundTo);

  if (kind === 'reverse') {
    const low = answer - Math.floor(roundTo / 2);
    const high = answer + Math.ceil(roundTo / 2) - 1;
    const min = Math.max(0, low);
    return {
      type: kind,
      prompt: `Name a number that rounds to ${fmt(answer)} when rounded to the nearest ${fmt(roundTo)}.`,
      answer: String(answer),
      acceptedRange: { min, max: high },
      answerKind: 'range',
      hint: `Numbers from ${fmt(min)} to ${fmt(high)} round to ${fmt(answer)}.`,
    };
  }

  return {
    type: kind,
    prompt: `Round ${fmt(number)} to the nearest ${fmt(roundTo)}.`,
    answer: String(answer),
    hint: `Look at the digit one place to the right of the ${fmt(roundTo)}s place.`,
  };
};

export const factorPairs = (n) => {
  const pairs = [];
  for (let i = 1; i * i <= n; i += 1) {
    if (n % i === 0) pairs.push([i, n / i]);
  }
  return pairs;
};

export const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i += 1) {
    if (n % i === 0) return false;
  }
  return true;
};

export const normalizeFactorPairsAnswer = (value) => {
  const text = String(value ?? '')
    .toLowerCase()
    .replace(/×/g, 'x')
    .replace(/\*/g, 'x')
    .replace(/\s+/g, '');
  const parts = text
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^(\d+)x(\d+)$/);
      if (!m) return null;
      const a = Number(m[1]);
      const b = Number(m[2]);
      return a <= b ? `${a}x${b}` : `${b}x${a}`;
    })
    .filter(Boolean)
    .sort();
  return [...new Set(parts)].join(',');
};

export const normalizeListAnswer = (value) =>
  String(value ?? '')
    .replace(/,/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => String(Number(part.replace(/[^\d-]/g, ''))))
    .filter((part) => part !== 'NaN')
    .join(',');

export const generateFactors = ({ grade, type, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const baseMax = g <= 3 ? 24 : g === 4 ? 60 : 100;
  const { max } = scaleRange({ min: 6, max: baseMax }, difficulty);
  const kind =
    type === 'multiples' || type === 'list_multiples' || type === 'prime_composite'
      ? type
      : 'pairs';

  if (kind === 'pairs') {
    const number = randomInt(6, max);
    const pairs = factorPairs(number);
    const canonical = pairs.map(([a, b]) => (a <= b ? `${a}x${b}` : `${b}x${a}`)).sort().join(',');
    return {
      type: kind,
      prompt: `List all factor pairs of ${number}.\nExample style: 1x12, 2x6, 3x4`,
      answer: canonical,
      answerKind: 'factor_pairs',
      hint: 'Include every pair that multiplies to the number.',
    };
  }

  if (kind === 'multiples') {
    const factor = randomInt(2, 9);
    let number = randomInt(6, max);
    const isMultiple = Math.random() < 0.55;
    if (isMultiple) number = factor * randomInt(2, Math.floor(max / factor));
    else if (number % factor === 0) number = Math.min(max, number + 1);
    return {
      type: kind,
      prompt: `Is ${number} a multiple of ${factor}? (yes or no)`,
      answer: number % factor === 0 ? 'yes' : 'no',
      answerKind: 'yesno',
      hint: `Does ${factor} divide ${number} with no remainder?`,
    };
  }

  if (kind === 'list_multiples') {
    const factor = randomInt(2, 9);
    const count = 5;
    const multiples = Array.from({ length: count }, (_, i) => factor * (i + 1));
    return {
      type: kind,
      prompt: `List the first ${count} multiples of ${factor}.`,
      answer: multiples.join(','),
      answerKind: 'list',
      hint: `Start with ${factor}, ${factor * 2}, …`,
    };
  }

  const number = randomInt(1, 50);
  let kindLabel = 'composite';
  if (number < 2) kindLabel = 'neither';
  else if (isPrime(number)) kindLabel = 'prime';
  return {
    type: kind,
    prompt: `Is ${number} prime, composite, or neither?`,
    answer: kindLabel,
    hint: 'Primes have exactly two factors: 1 and itself. 1 is neither.',
  };
};

export const generateMissingSymbol = ({ grade, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  const compareMax = level === 'easy' ? 20 : level === 'hard' ? (g <= 3 ? 100 : 200) : g <= 3 ? 50 : 100;
  const kind = pick(['op', 'op', 'compare', 'expr']);

  if (kind === 'compare') {
    const a = randomInt(1, compareMax);
    let b = randomInt(1, compareMax);
    if (Math.random() < 0.2) b = a;
    const answer = a < b ? '<' : a > b ? '>' : '=';
    return {
      type: 'compare',
      prompt: `Pick the missing symbol:\n${a}  ____  ${b}`,
      answer,
      hint: 'Use <, >, or =.',
    };
  }

  if (kind === 'expr') {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    const leftVal = a * b;
    const right = Math.max(1, leftVal + pick([-3, -1, 0, 0, 1, 2]));
    const answer = leftVal < right ? '<' : leftVal > right ? '>' : '=';
    return {
      type: 'expr',
      prompt: `Pick the missing symbol:\n${a} × ${b}  ____  ${right}`,
      answer,
      hint: 'Solve the left side, then compare.',
    };
  }

  const op = pick(['+', '−', '×', '÷']);
  if (op === '+') {
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    return {
      type: 'op',
      prompt: `Pick the missing symbol:\n${a}  ____  ${b} = ${a + b}`,
      answer: '+',
      hint: 'Which operation makes the sentence true?',
    };
  }
  if (op === '−') {
    const b = randomInt(1, 12);
    const a = b + randomInt(1, 12);
    return {
      type: 'op',
      prompt: `Pick the missing symbol:\n${a}  ____  ${b} = ${a - b}`,
      answer: '−',
      hint: 'Which operation makes the sentence true?',
    };
  }
  if (op === '×') {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    return {
      type: 'op',
      prompt: `Pick the missing symbol:\n${a}  ____  ${b} = ${a * b}`,
      answer: '×',
      hint: 'Which operation makes the sentence true?',
    };
  }
  const divisor = randomInt(2, 9);
  const quotient = randomInt(2, 12);
  const dividend = divisor * quotient;
  return {
    type: 'op',
    prompt: `Pick the missing symbol:\n${dividend}  ____  ${divisor} = ${quotient}`,
    answer: '÷',
    hint: 'Which operation makes the sentence true?',
  };
};

export const generateEstimate = ({ grade, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  const op = pick(g <= 3 || level === 'easy' ? ['add', 'sub'] : ['add', 'sub', 'mult']);

  if (op === 'mult') {
    const a = level === 'easy' ? randomInt(11, 40) : level === 'hard' ? randomInt(50, 99) : randomInt(11, 99);
    const b = level === 'easy' ? randomInt(3, 5) : randomInt(3, 9);
    const ra = roundToPlace(a, 10);
    const answer = ra * b;
    return {
      type: 'estimate',
      prompt: `Estimate ${fmt(a)} × ${b} by rounding ${fmt(a)} to the nearest 10.`,
      answer: String(answer),
      accepted: [answer, a * roundToPlace(b, 10)].filter((n, i, arr) => n > 0 && arr.indexOf(n) === i),
      answerKind: 'accepted_list',
      hint: `${fmt(a)} → ${fmt(ra)}, then multiply by ${b}.`,
    };
  }

  const baseMax = g <= 3 ? 9999 : g === 4 ? 99999 : 999999;
  const { max } = scaleRange({ min: Math.floor(baseMax / 20), max: baseMax }, level);
  let a = randomInt(Math.max(20, Math.floor(max / 10)), max);
  let b = randomInt(Math.max(10, Math.floor(max / 20)), Math.max(11, Math.floor(max / 2)));
  if (op === 'sub' && b > a) [a, b] = [b, a];
  const roundTo = a >= 1000 ? 100 : 10;
  const ra = roundToPlace(a, roundTo);
  const rb = roundToPlace(b, roundTo);
  const answer = op === 'add' ? ra + rb : ra - rb;
  const symbol = op === 'add' ? '+' : '−';
  return {
    type: 'estimate',
    prompt: `Estimate ${fmt(a)} ${symbol} ${fmt(b)} by rounding to the nearest ${fmt(roundTo)}.`,
    answer: String(answer),
    accepted: [answer],
    answerKind: 'accepted_list',
    hint: `${fmt(a)} → ${fmt(ra)}, ${fmt(b)} → ${fmt(rb)}.`,
  };
};

const NAMES = [
  { a: 'Maya', b: 'Leo', thing: 'stickers' },
  { a: 'Sam', b: 'Priya', thing: 'cards' },
  { a: 'Jordan', b: 'Ava', thing: 'points' },
];

export const normalizeEquation = (input) =>
  String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/×/g, 'x')
    .replace(/\*/g, 'x')
    .replace(/\s+/g, '');

export const generateTimesAsMany = ({ grade, type, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  let timesMax = g <= 3 ? 5 : g === 4 ? 8 : 12;
  let smallMax = g <= 3 ? 12 : 20;
  if (level === 'easy') {
    timesMax = Math.min(timesMax, 4);
    smallMax = Math.min(smallMax, 10);
  }
  if (level === 'hard') {
    timesMax = g <= 3 ? 8 : 12;
    smallMax = g <= 3 ? 20 : 30;
  }
  const times = randomInt(2, timesMax);
  const smaller = randomInt(2, smallMax);
  const larger = smaller * times;
  const names = pick(NAMES);
  const kind =
    type === 'word' || type === 'write_equation' || type === 'equation' ? type : 'equation';

  if (kind === 'write_equation') {
    const accepted = [
      `${larger}=${times}x${smaller}`,
      `${larger}=${smaller}x${times}`,
      `${times}x${smaller}=${larger}`,
      `${smaller}x${times}=${larger}`,
    ];
    return {
      type: kind,
      prompt: `${larger} is ${times} times as many as ${smaller}. Write a multiplication equation.`,
      answer: `${larger} = ${times} × ${smaller}`,
      accepted,
      answerKind: 'equation_list',
      hint: 'Example: 24 = 3 × 8',
    };
  }

  if (kind === 'word') {
    const unknown = pick(['larger', 'smaller', 'times']);
    if (unknown === 'larger') {
      return {
        type: kind,
        prompt: `${names.a} has ${smaller} ${names.thing}. ${names.b} has ${times} times as many. How many ${names.thing} does ${names.b} have?`,
        answer: String(larger),
        hint: 'Multiply the smaller amount by how many times as many.',
      };
    }
    if (unknown === 'smaller') {
      return {
        type: kind,
        prompt: `${names.b} has ${larger} ${names.thing}, which is ${times} times as many as ${names.a}. How many does ${names.a} have?`,
        answer: String(smaller),
        hint: 'Divide the larger amount by the times factor.',
      };
    }
    return {
      type: kind,
      prompt: `${names.a} has ${smaller} ${names.thing}. ${names.b} has ${larger}. ${names.b} has how many times as many as ${names.a}?`,
      answer: String(times),
      hint: 'Divide larger ÷ smaller.',
    };
  }

  return {
    type: kind,
    prompt: `${fmt(smaller)} × ${times} = ____\n(${fmt(larger)} is ${times} times as many as ${fmt(smaller)})`,
    answer: String(larger),
    hint: 'Multiply to find the larger amount.',
  };
};
