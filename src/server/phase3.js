import { normalizeDifficulty } from './difficulty.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (items) => items[Math.floor(Math.random() * items.length)];

export const MONEY_COUNT_TYPES = [
  { id: 'count', label: 'Count coins & bills' },
  { id: 'make', label: 'Make an amount' },
];

export const MEASUREMENT_TYPES = [
  { id: 'length', label: 'Length' },
  { id: 'volume', label: 'Volume' },
  { id: 'weight', label: 'Weight' },
];

export const TIME_TYPES = [
  { id: 'read', label: 'Read the clock' },
  { id: 'elapsed', label: 'Elapsed time' },
  { id: 'convert', label: 'Convert units' },
];

export const MONEY_DENOMS = {
  penny: { id: 'penny', label: 'penny', plural: 'pennies', cents: 1 },
  nickel: { id: 'nickel', label: 'nickel', plural: 'nickels', cents: 5 },
  dime: { id: 'dime', label: 'dime', plural: 'dimes', cents: 10 },
  quarter: { id: 'quarter', label: 'quarter', plural: 'quarters', cents: 25 },
  dollar1: { id: 'dollar1', label: '$1 bill', plural: '$1 bills', cents: 100 },
  dollar5: { id: 'dollar5', label: '$5 bill', plural: '$5 bills', cents: 500 },
  dollar10: { id: 'dollar10', label: '$10 bill', plural: '$10 bills', cents: 1000 },
};

const COIN_IDS = ['penny', 'nickel', 'dime', 'quarter'];
const NAMES = ['Maya', 'Leo', 'Sam', 'Priya', 'Jordan', 'Ava', 'Noah', 'Sofia'];
const PURCHASES = [
  'a notebook',
  'a snack',
  'stickers',
  'a pencil pack',
  'cafeteria lunch',
  'art supplies',
  'a water bottle',
  'a book fair book',
];

export const formatCents = (cents) => `$${(cents / 100).toFixed(2)}`;

export const parseMoneyToCents = (input) => {
  const trimmed = String(input ?? '').trim();
  if (!trimmed) return null;

  const centsMatch = trimmed.match(/^(\d+)\s*¢$/);
  if (centsMatch) {
    const n = Number(centsMatch[1]);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }

  const cleaned = trimmed.replace(/[$\s,]/g, '');
  if (!cleaned) return null;
  if (!/^(\d+(\.\d{0,2})?|\.\d{1,2})$/.test(cleaned)) return null;
  const dollars = Number(cleaned);
  if (!Number.isFinite(dollars) || dollars < 0) return null;
  return Math.round(dollars * 100);
};

export const sumItems = (items) =>
  items.reduce((sum, item) => sum + MONEY_DENOMS[item.denom].cents * item.count, 0);

const describeItems = (items) =>
  items
    .map((item) => {
      const meta = MONEY_DENOMS[item.denom];
      const name = item.count === 1 ? meta.label : meta.plural;
      return `${item.count} ${name}`;
    })
    .join(', ');

const consolidate = (counts, order) => {
  const items = [];
  for (const id of order) {
    const count = counts[id] || 0;
    if (count > 0) items.push({ denom: id, count });
  }
  return items;
};

const allowedForGrade = (grade) => {
  const g = Number(grade) || 3;
  if (g <= 3) return COIN_IDS.slice();
  if (g === 4) return [...COIN_IDS, 'dollar1'];
  return [...COIN_IDS, 'dollar1', 'dollar5', 'dollar10'];
};

const randomPile = (allowed, minPieces, maxPieces) => {
  const counts = {};
  const pieces = randomInt(minPieces, maxPieces);
  for (let i = 0; i < pieces; i += 1) {
    const id = pick(allowed);
    counts[id] = (counts[id] || 0) + 1;
  }
  return consolidate(counts, [
    'dollar10',
    'dollar5',
    'dollar1',
    'quarter',
    'dime',
    'nickel',
    'penny',
  ]);
};

const fewestCoins = (cents) => {
  let remaining = cents;
  const counts = {};
  for (const id of ['quarter', 'dime', 'nickel', 'penny']) {
    const value = MONEY_DENOMS[id].cents;
    const count = Math.floor(remaining / value);
    if (count > 0) {
      counts[id] = count;
      remaining -= count * value;
    }
  }
  const items = consolidate(counts, ['quarter', 'dime', 'nickel', 'penny']);
  return { items, count: items.reduce((sum, item) => sum + item.count, 0) };
};

export const generateMoneyCount = ({ grade, type, difficulty } = {}) => {
  const kind = type === 'make' ? 'make' : 'count';
  const level = normalizeDifficulty(difficulty);
  const allowed = allowedForGrade(grade);
  const name = pick(NAMES);

  if (kind === 'make') {
    let max = Number(grade) <= 3 ? 99 : Number(grade) === 4 ? 199 : 499;
    if (level === 'easy') max = Math.min(max, 50);
    if (level === 'hard') max = Number(grade) <= 3 ? 150 : max + 100;
    const amount = randomInt(level === 'easy' ? 10 : 15, max);
    const { items, count } = fewestCoins(amount);
    return {
      type: kind,
      prompt: `Make ${formatCents(amount)} using the fewest coins.\nHow many coins do you need in total?`,
      answer: String(count),
      hint: `Greedy way: ${describeItems(items)}.`,
    };
  }

  const maxPieces = level === 'easy' ? 3 : level === 'hard' ? (Number(grade) <= 3 ? 7 : 9) : Number(grade) <= 3 ? 5 : 7;
  const items = randomPile(allowed, level === 'easy' ? 1 : 2, maxPieces);
  const total = sumItems(items);
  return {
    type: kind,
    prompt: `${name} has: ${describeItems(items)}.\nHow much money is that?`,
    answer: String(total),
    answerKind: 'money',
    hint: 'Add the value of each coin or bill.',
  };
};

export const generateMoneyChange = ({ grade, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  const name = pick(NAMES);
  const purchase = pick(PURCHASES);
  let cost =
    level === 'easy'
      ? randomInt(1, 2) * 100 + pick([0, 25, 50, 75])
      : g <= 3
        ? randomInt(1, level === 'hard' ? 6 : 4) * 100 + pick([0, 25, 50, 75])
        : g === 4
          ? Math.round(randomInt(level === 'hard' ? 200 : 50, level === 'hard' ? 1500 : 950) / 5) * 5
          : randomInt(level === 'hard' ? 200 : 35, level === 'hard' ? 2499 : 1499);
  const bills =
    g <= 3 ? [100, 500, 1000].filter((b) => b > cost) : [100, 200, 500, 1000, 2000].filter((b) => b > cost);
  const paid = pick(bills.length ? bills : [Math.ceil((cost + 1) / 100) * 100]);
  if (paid <= cost) cost = paid - pick([25, 50, 75]);
  const change = paid - cost;
  return {
    type: 'change',
    prompt: `${name} bought ${purchase} for ${formatCents(cost)}. ${name} paid with ${formatCents(paid)}. How much change should ${name} get?`,
    answer: String(change),
    answerKind: 'money',
    hint: `Change = money paid − cost.`,
  };
};

export const generateMoneyCompare = ({ grade, difficulty } = {}) => {
  const level = normalizeDifficulty(difficulty);
  const allowed = allowedForGrade(grade);
  const maxPieces = level === 'easy' ? 3 : level === 'hard' ? 7 : 5;
  const leftItems = randomPile(allowed, 1, maxPieces);
  let rightItems = randomPile(allowed, 1, maxPieces);
  if (Math.random() < 0.15) {
    rightItems = fewestCoins(sumItems(leftItems)).items;
    if (!rightItems.length) rightItems = [{ denom: 'penny', count: sumItems(leftItems) || 1 }];
  }
  const left = sumItems(leftItems);
  const right = sumItems(rightItems);
  const answer = left < right ? '<' : left > right ? '>' : '=';
  return {
    type: 'compare',
    prompt: `Compare the two amounts. Write <, >, or =\nLeft: ${describeItems(leftItems)}\nRight: ${describeItems(rightItems)}`,
    answer,
    answerKind: 'symbol',
    hint: 'Total each side, then compare.',
  };
};

const LENGTH_FACTS = [
  { from: 'feet', to: 'inches', factor: 12, tip: '1 foot = 12 inches' },
  { from: 'yards', to: 'feet', factor: 3, tip: '1 yard = 3 feet' },
  { from: 'meters', to: 'centimeters', factor: 100, tip: '1 meter = 100 centimeters' },
  { from: 'centimeters', to: 'millimeters', factor: 10, tip: '1 centimeter = 10 millimeters' },
];

const VOLUME_FACTS = [
  { from: 'gallons', to: 'quarts', factor: 4, tip: '1 gallon = 4 quarts' },
  { from: 'quarts', to: 'pints', factor: 2, tip: '1 quart = 2 pints' },
  { from: 'pints', to: 'cups', factor: 2, tip: '1 pint = 2 cups' },
  { from: 'liters', to: 'milliliters', factor: 1000, tip: '1 liter = 1,000 milliliters' },
];

const WEIGHT_FACTS = [
  { from: 'pounds', to: 'ounces', factor: 16, tip: '1 pound = 16 ounces' },
  { from: 'kilograms', to: 'grams', factor: 1000, tip: '1 kilogram = 1,000 grams' },
];

export const generateMeasurement = ({ grade, type, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  const category =
    type === 'volume' || type === 'weight' || type === 'length' ? type : pick(['length', 'volume', 'weight']);
  let facts = LENGTH_FACTS;
  if (category === 'volume') facts = VOLUME_FACTS;
  if (category === 'weight') facts = WEIGHT_FACTS;

  // Grade 3: prefer smaller customary facts
  if (g <= 3 && category === 'length') {
    facts = LENGTH_FACTS.filter((f) => f.from === 'feet' || f.from === 'yards');
  }
  if (g <= 3 && category === 'volume') {
    facts = VOLUME_FACTS.filter((f) => f.from !== 'liters' && f.from !== 'gallons');
  }

  const fact = pick(facts);
  const quantity = randomInt(2, level === 'easy' ? 4 : level === 'hard' ? (g <= 3 ? 12 : 20) : g <= 3 ? 8 : 12);
  const answer = quantity * fact.factor;
  return {
    type: category,
    prompt: `Convert:\n${quantity} ${fact.from} = ____ ${fact.to}`,
    answer: String(answer),
    hint: fact.tip,
  };
};

const pad2 = (n) => String(n).padStart(2, '0');
const formatTime = (hour, minute) => `${hour}:${pad2(minute)}`;

const wordClock = (hour, minute) => {
  const hours = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
  ];
  const h = hour % 12 || 12;
  if (minute === 0) return `${hours[h]} o'clock`;
  if (minute === 15) return `quarter past ${hours[h]}`;
  if (minute === 30) return `half past ${hours[h]}`;
  if (minute === 45) {
    const next = (h % 12) + 1;
    return `quarter to ${hours[next]}`;
  }
  if (minute < 10) return `${hours[h]} oh ${['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][minute]}`;
  return `${hours[h]} ${minute}`;
};

export const normalizeTimeAnswer = (value) => {
  const text = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    // also accept bare minutes totals for convert
    const n = Number(text.replace(/,/g, ''));
    return Number.isFinite(n) ? String(n) : text;
  }
  return `${Number(match[1])}:${match[2]}`;
};

export const generateTime = ({ grade, type, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  const kind =
    type === 'elapsed' || type === 'convert' || type === 'read' ? type : pick(['read', 'elapsed', 'convert']);

  if (kind === 'convert') {
    const hours = randomInt(1, level === 'easy' ? 2 : g <= 3 ? 3 : 5);
    const minutes = level === 'easy' ? pick([0, 30]) : pick([0, 15, 30, 45]);
    const total = hours * 60 + minutes;
    if (Math.random() < 0.5) {
      return {
        type: kind,
        prompt: `How many minutes are in ${hours} hour${hours === 1 ? '' : 's'}${
          minutes ? ` ${minutes} minutes` : ''
        }?`,
        answer: String(total),
        hint: '1 hour = 60 minutes.',
      };
    }
    const h = Math.floor(total / 60);
    const m = total % 60;
    return {
      type: kind,
      prompt: `${total} minutes = ____ hours and ____ minutes.\nWrite your answer like ${h}:${pad2(m)} (hours:minutes).`,
      answer: formatTime(h, m),
      answerKind: 'time',
      hint: 'Divide by 60 for hours; the remainder is minutes.',
    };
  }

  if (kind === 'elapsed') {
    const startHour = randomInt(1, 10);
    const startMinute = pick(
      level === 'easy' || g <= 3 ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 30, 45],
    );
    const elapsed = pick(
      level === 'easy'
        ? [15, 30, 60]
        : level === 'hard'
          ? [35, 45, 50, 75, 90]
          : g <= 3
            ? [15, 30, 45, 60]
            : [20, 25, 35, 45, 50, 75, 90],
    );
    const startTotal = startHour * 60 + startMinute;
    const endTotal = startTotal + elapsed;
    const endHour = Math.floor(endTotal / 60);
    const endMinute = endTotal % 60;
    const name = pick(NAMES);
    return {
      type: kind,
      prompt: `${name} starts at ${formatTime(startHour, startMinute)}. After ${elapsed} minutes, what time is it?`,
      answer: formatTime(endHour, endMinute),
      answerKind: 'time',
      hint: 'Add the minutes, then regroup 60 minutes as 1 hour if needed.',
    };
  }

  const hour = randomInt(1, 12);
  const minute = pick(
    level === 'easy' || g <= 3
      ? [0, 15, 30, 45]
      : level === 'hard'
        ? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
        : [0, 5, 10, 15, 20, 30, 45],
  );
  return {
    type: kind,
    prompt: `A clock shows ${wordClock(hour, minute)}.\nWrite the time digitally (h:mm).`,
    answer: formatTime(hour, minute),
    answerKind: 'time',
    hint: 'Example: half past 3 → 3:30',
  };
};
