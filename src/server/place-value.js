const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS = [
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const PLACES = [
  { label: 'hundred thousands', value: 100000 },
  { label: 'ten thousands', value: 10000 },
  { label: 'thousands', value: 1000 },
  { label: 'hundreds', value: 100 },
  { label: 'tens', value: 10 },
  { label: 'ones', value: 1 },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (items) => items[Math.floor(Math.random() * items.length)];

export const PLACE_VALUE_TYPES = [
  { id: 'digit_value', label: 'Digit value' },
  { id: 'standard', label: 'Standard form' },
  { id: 'expanded', label: 'Expanded form' },
  { id: 'word', label: 'From words' },
  { id: 'compare', label: 'Compare' },
];

export const normalizePlaceValueType = (type) => {
  const ids = PLACE_VALUE_TYPES.map((item) => item.id);
  return ids.includes(type) ? type : 'digit_value';
};

export const formatNumber = (n) => Number(n).toLocaleString('en-US');

export const digitAt = (n, placeValue) => Math.floor(n / placeValue) % 10;

const belowThousand = (n) => {
  if (n <= 0) return '';
  const parts = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) parts.push(`${ONES[hundreds]} hundred`);
  if (rest >= 20) {
    const tens = Math.floor(rest / 10);
    const ones = rest % 10;
    parts.push(ones ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens]);
  } else if (rest >= 10) {
    parts.push(TEENS[rest - 10]);
  } else if (rest > 0) {
    parts.push(ONES[rest]);
  }
  return parts.join(' ');
};

export const numberToWord = (n) => {
  if (n === 0) return 'zero';
  const parts = [];
  let remaining = n;
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000);
    parts.push(`${belowThousand(thousands)} thousand`);
    remaining %= 1000;
  }
  if (remaining > 0) parts.push(belowThousand(remaining));
  return parts.join(' ');
};

export const expandedTerms = (n) =>
  PLACES.map((place) => digitAt(n, place.value) * place.value).filter((term) => term > 0);

export const expandedForm = (n) => expandedTerms(n).join(' + ');

/** Normalize expanded answers like "3000+200+5" or "3,000 + 200 + 5". */
export const normalizeExpandedAnswer = (value) => {
  const text = String(value ?? '')
    .toLowerCase()
    .replace(/,/g, '')
    .replace(/\s+/g, '');
  if (!text) return '';
  const parts = text
    .split('+')
    .map((part) => Number(part))
    .filter((part) => Number.isFinite(part) && part > 0)
    .sort((a, b) => b - a);
  return parts.join('+');
};

const gradeBounds = (grade) => {
  const g = Number(grade) || 3;
  if (g <= 3) return { min: 100, max: 9999 };
  if (g === 4) return { min: 1000, max: 99999 };
  return { min: 10000, max: 999999 };
};

export const randomPlaceNumber = (grade) => {
  const { min, max } = gradeBounds(grade);
  return randomInt(min, max);
};

export const generatePlaceValue = ({ grade, type } = {}) => {
  const kind = normalizePlaceValueType(type);
  const g = Number(grade) || 3;

  if (kind === 'digit_value') {
    const n = randomPlaceNumber(g);
    const nonzero = PLACES.filter((place) => place.value <= n && digitAt(n, place.value) > 0);
    const place = pick(nonzero.length ? nonzero : PLACES.filter((p) => p.value <= n));
    const digit = digitAt(n, place.value);
    const value = digit * place.value;
    return {
      type: kind,
      prompt: `What is the value of the digit ${digit} in ${formatNumber(n)}?`,
      answer: String(value),
      hint: `Think about the ${place.label} place.`,
    };
  }

  if (kind === 'standard') {
    const n = randomPlaceNumber(g);
    const stimulus = expandedForm(n);
    return {
      type: kind,
      prompt: `Write this number in standard form:\n${stimulus}`,
      answer: String(n),
      hint: 'Add the place values together.',
    };
  }

  if (kind === 'expanded') {
    const n = randomPlaceNumber(g);
    return {
      type: kind,
      prompt: `Write ${formatNumber(n)} in expanded form.`,
      answer: expandedForm(n),
      answerKind: 'expanded',
      hint: 'Example: 3,205 → 3000 + 200 + 5',
    };
  }

  if (kind === 'word') {
    const n = randomPlaceNumber(g);
    const word = numberToWord(n);
    return {
      type: kind,
      prompt: `Write this number in standard form:\n${word}`,
      answer: String(n),
      hint: 'Translate the words into digits.',
    };
  }

  // compare
  const left = randomPlaceNumber(g);
  let right = randomPlaceNumber(g);
  if (Math.random() < 0.12) right = left;
  const answer = left < right ? '<' : left > right ? '>' : '=';
  return {
    type: kind,
    prompt: `Compare:\n${formatNumber(left)}  ?  ${formatNumber(right)}\nWrite <, >, or =`,
    answer,
    hint: 'Compare place by place from the left.',
  };
};
