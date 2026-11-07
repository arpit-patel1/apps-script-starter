import { normalizeDifficulty } from './difficulty.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (items) => items[Math.floor(Math.random() * items.length)];

export const normalizeIoRule = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/−/g, '-')
    .replace(/×/g, 'x')
    .replace(/\*/g, 'x')
    .replace(/\s+/g, ' ');

export const FRACTION_TYPES = [
  { id: 'add', label: 'Add' },
  { id: 'subtract', label: 'Subtract' },
  { id: 'multiply', label: 'Multiply' },
  { id: 'compare', label: 'Compare' },
];

export const INPUT_OUTPUT_TYPES = [
  { id: 'fill', label: 'Fill missing' },
  { id: 'find_rule', label: 'Find the rule' },
];

export const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

export const simplifyFraction = (num, den) => {
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
};

export const formatFraction = (num, den) => {
  const s = simplifyFraction(num, den);
  if (s.den === 1) return String(s.num);
  if (Math.abs(s.num) > s.den) {
    const whole = Math.trunc(s.num / s.den);
    const rem = Math.abs(s.num % s.den);
    if (rem === 0) return String(whole);
    return `${whole} ${rem}/${s.den}`;
  }
  return `${s.num}/${s.den}`;
};

/** Normalize kid fraction answers: 1/2, 3/4, 1 1/2, 1-1/2, 0.5 (limited). */
export const normalizeFractionAnswer = (value) => {
  const text = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/−/g, '-')
    .replace(/\s+/g, ' ');
  if (!text) return '';

  const mixed = text.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const num = Number(mixed[2]);
    const den = Number(mixed[3]);
    if (!den) return '';
    const sign = whole < 0 ? -1 : 1;
    const improper = sign * (Math.abs(whole) * den + num);
    return formatFraction(improper, den);
  }

  const mixedDash = text.match(/^(-?\d+)\s*-\s*(\d+)\s*\/\s*(\d+)$/);
  if (mixedDash) {
    const whole = Number(mixedDash[1]);
    const num = Number(mixedDash[2]);
    const den = Number(mixedDash[3]);
    if (!den) return '';
    const improper = whole * den + (whole < 0 ? -num : num);
    return formatFraction(improper, den);
  }

  const simple = text.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (simple) {
    const num = Number(simple[1]);
    const den = Number(simple[2]);
    if (!den) return '';
    return formatFraction(num, den);
  }

  if (/^-?\d+$/.test(text)) return text;

  return text;
};

const randomProper = (maxDen) => {
  const den = randomInt(2, maxDen);
  const num = randomInt(1, den - 1);
  return simplifyFraction(num, den);
};

export const generateFractions = ({ grade, type, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  let maxDen = g <= 3 ? 8 : g === 4 ? 12 : 16;
  if (level === 'easy') maxDen = Math.min(maxDen, 6);
  if (level === 'hard') maxDen = g <= 3 ? 12 : g === 4 ? 16 : 20;
  let kind = type;
  if (!['add', 'subtract', 'multiply', 'compare'].includes(kind)) {
    kind = g <= 3 ? pick(['add', 'subtract', 'compare']) : pick(['add', 'subtract', 'multiply', 'compare']);
  }
  if (kind === 'multiply' && g <= 3) kind = 'add';

  if (kind === 'compare') {
    let left;
    let right;
    if (Math.random() < 0.4) {
      const den = randomInt(3, maxDen);
      left = { num: randomInt(1, den - 1), den };
      right = { num: randomInt(1, den - 1), den };
    } else {
      left = randomProper(maxDen);
      right = randomProper(maxDen);
    }
    const lv = left.num * right.den;
    const rv = right.num * left.den;
    const answer = lv < rv ? '<' : lv > rv ? '>' : '=';
    return {
      type: kind,
      prompt: `Compare. Write <, >, or =\n${left.num}/${left.den}  ____  ${right.num}/${right.den}`,
      answer,
      answerKind: 'symbol',
      hint: 'Same denominator → compare numerators. Different → use a common denominator.',
    };
  }

  if (kind === 'multiply') {
    const a = randomProper(Math.min(maxDen, 10));
    const b = randomProper(Math.min(maxDen, 10));
    const product = simplifyFraction(a.num * b.num, a.den * b.den);
    return {
      type: kind,
      prompt: `Multiply. Write the answer in simplest form.\n${a.num}/${a.den} × ${b.num}/${b.den}`,
      answer: formatFraction(product.num, product.den),
      answerKind: 'fraction',
      hint: 'Multiply numerators, multiply denominators, then simplify.',
    };
  }

  // add / subtract — prefer related denominators
  let a = randomProper(maxDen);
  let b = randomProper(maxDen);
  if (g <= 3 || Math.random() < 0.45) {
    const den = randomInt(3, maxDen);
    a = { num: randomInt(1, den - 1), den };
    b = { num: randomInt(1, den - 1), den };
  }
  if (kind === 'subtract' && a.num * b.den < b.num * a.den) {
    [a, b] = [b, a];
  }

  const common = (a.den * b.den) / gcd(a.den, b.den);
  const left = (a.num * common) / a.den;
  const right = (b.num * common) / b.den;
  const resultNum = kind === 'add' ? left + right : left - right;
  const result = simplifyFraction(resultNum, common);
  const op = kind === 'add' ? '+' : '−';

  return {
    type: kind,
    prompt: `${kind === 'add' ? 'Add' : 'Subtract'}. Write the answer in simplest form.\n${a.num}/${a.den} ${op} ${b.num}/${b.den}`,
    answer: formatFraction(result.num, result.den),
    answerKind: 'fraction',
    hint:
      a.den === b.den
        ? `${kind === 'add' ? 'Add' : 'Subtract'} the numerators; keep denominator ${a.den}.`
        : 'Find a common denominator, then add or subtract.',
  };
};

const TIMES = '×';
const DIV = '÷';
const MINUS = '−';

const applyOp = (left, op, right) => {
  if (op === '+') return left + right;
  if (op === MINUS) return left - right;
  if (op === TIMES) return left * right;
  if (right === 0 || left % right !== 0) return null;
  return left / right;
};

const evalExpr = (tokens) => {
  const current = tokens.slice();

  const reduceMulDiv = () => {
    for (let i = 0; i < current.length; i += 1) {
      if (current[i].kind === 'op' && (current[i].op === TIMES || current[i].op === DIV)) {
        const value = applyOp(current[i - 1].n, current[i].op, current[i + 1].n);
        if (value === null || !Number.isInteger(value) || value < 0) return false;
        current.splice(i - 1, 3, { kind: 'num', n: value });
        return true;
      }
    }
    return false;
  };

  const reduceAddSub = () => {
    for (let i = 0; i < current.length; i += 1) {
      if (current[i].kind === 'op' && (current[i].op === '+' || current[i].op === MINUS)) {
        const value = applyOp(current[i - 1].n, current[i].op, current[i + 1].n);
        if (value === null || !Number.isInteger(value) || value < 0) return false;
        current.splice(i - 1, 3, { kind: 'num', n: value });
        return true;
      }
    }
    return false;
  };

  // parentheses
  while (current.some((t) => t.kind === 'lparen')) {
    const end = current.findIndex((t) => t.kind === 'rparen');
    if (end < 0) return null;
    let start = -1;
    for (let i = end - 1; i >= 0; i -= 1) {
      if (current[i].kind === 'lparen') {
        start = i;
        break;
      }
    }
    if (start < 0) return null;
    const inner = current.slice(start + 1, end);
    const innerVal = evalExpr(inner);
    if (innerVal === null) return null;
    current.splice(start, end - start + 1, { kind: 'num', n: innerVal });
  }

  while (reduceMulDiv()) {
    /* keep reducing */
  }
  while (reduceAddSub()) {
    /* keep reducing */
  }

  if (current.length === 1 && current[0].kind === 'num') return current[0].n;
  return null;
};

const tokenize = (expression) => {
  const tokens = [];
  const source = String(expression).replace(/-/g, MINUS).replace(/\s+/g, '');
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch >= '0' && ch <= '9') {
      let end = i + 1;
      while (end < source.length && source[end] >= '0' && source[end] <= '9') end += 1;
      tokens.push({ kind: 'num', n: Number(source.slice(i, end)) });
      i = end;
      continue;
    }
    if (ch === '(') tokens.push({ kind: 'lparen' });
    else if (ch === ')') tokens.push({ kind: 'rparen' });
    else if (ch === '+' || ch === MINUS || ch === TIMES || ch === DIV) tokens.push({ kind: 'op', op: ch });
    else return null;
    i += 1;
  }
  return tokens;
};

const n = (max, min = 1) => randomInt(min, max);

const buildExpression = (grade, difficulty = 'medium') => {
  const level = normalizeDifficulty(difficulty);
  let max = grade <= 3 ? 9 : grade === 4 ? 10 : 12;
  if (level === 'easy') max = Math.min(max, 6);
  if (level === 'hard') max = grade <= 3 ? 12 : 15;
  const a = n(max);
  const b = n(max, 2);
  const c = n(max, 2);
  const d = n(max);

  if (grade <= 3) {
    return pick([
      `${a} + ${b} ${TIMES} ${c}`,
      `${b} ${TIMES} ${c} + ${a}`,
      `${b} ${TIMES} ${c} ${MINUS} ${n(Math.min(b * c - 1, 8), 1)}`,
      `(${a} + ${d}) ${TIMES} ${c}`,
    ]);
  }

  const divB = n(Math.min(max, 9), 2);
  const divA = divB * n(8, 2);

  if (grade === 4) {
    return pick([
      `${a} + ${b} ${TIMES} ${c}`,
      `${divA} ${DIV} ${divB} + ${a}`,
      `(${a} + ${d}) ${TIMES} ${c} ${MINUS} ${n(6, 1)}`,
      `${b} ${TIMES} ${c} + ${divA} ${DIV} ${divB}`,
    ]);
  }

  return pick([
    `(${a} + ${d}) ${TIMES} ${c}`,
    `(${a} + ${b}) ${TIMES} (${c} + ${n(max)})`,
    `${a} + ${b} ${TIMES} ${c} ${MINUS} ${n(6, 1)} + ${d}`,
    `${divA} ${DIV} ${divB} + ${b} ${TIMES} ${c}`,
  ]);
};

export const generateOrderOfOperations = ({ grade, difficulty } = {}) => {
  const g = Number(grade) || 3;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const expression = buildExpression(g, difficulty);
    const tokens = tokenize(expression);
    if (!tokens) continue;
    const answer = evalExpr(tokens);
    if (answer !== null && Number.isInteger(answer) && answer >= 0) {
      return {
        type: 'pemdas',
        prompt: `Solve using order of operations.\n${expression}`,
        answer: String(answer),
        hint: 'Parentheses, then ×÷ left to right, then +− left to right.',
      };
    }
  }
  return {
    type: 'pemdas',
    prompt: `Solve using order of operations.\n3 + 4 × 2`,
    answer: '11',
    hint: 'Parentheses, then ×÷ left to right, then +− left to right.',
  };
};

const applyRule = (input, op, amount) => {
  if (op === '+') return input + amount;
  if (op === '−') return input - amount;
  return input * amount;
};

const ruleLabel = (op, amount) => `${op} ${amount}`;

export const generateInputOutput = ({ grade, type, difficulty } = {}) => {
  const g = Number(grade) || 3;
  const level = normalizeDifficulty(difficulty);
  const kind = type === 'find_rule' ? 'find_rule' : 'fill';
  const ops = g <= 3 || level === 'easy' ? ['+', '−'] : ['+', '−', '×'];
  const op = pick(ops);
  const amount =
    op === '×'
      ? randomInt(2, level === 'easy' ? 4 : g >= 5 ? 10 : 6)
      : level === 'easy'
        ? randomInt(1, 5)
        : g <= 3
          ? randomInt(1, 9)
          : randomInt(2, level === 'hard' ? 30 : 20);
  const maxIn = op === '×' ? (level === 'easy' ? 8 : 12) : level === 'easy' ? 12 : g <= 3 ? 20 : 50;
  const used = new Set();
  const rows = [];
  while (rows.length < 4) {
    let input = randomInt(1, maxIn);
    if (op === '−') input = Math.max(input, amount);
    if (used.has(input)) continue;
    used.add(input);
    rows.push({ input, output: applyRule(input, op, amount) });
  }
  rows.sort((a, b) => a.input - b.input);
  const label = ruleLabel(op, amount);

  if (kind === 'find_rule') {
    const distractors = new Set();
    while (distractors.size < 3) {
      const dOp = pick(ops);
      const dAmount =
        dOp === '×' ? randomInt(2, 10) : randomInt(1, g <= 3 ? 12 : 25);
      const dLabel = ruleLabel(dOp, dAmount);
      if (dLabel !== label) distractors.add(dLabel);
    }
    const choices = [label, ...distractors];
    for (let i = choices.length - 1; i > 0; i -= 1) {
      const j = randomInt(0, i);
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    const table = rows.map((r) => `${r.input} → ${r.output}`).join('\n');
    return {
      type: kind,
      prompt: `Find the rule for this input/output table.\n${table}\n\nChoices: ${choices.join('  |  ')}\nType the rule exactly (example: + 5 or × 3).`,
      answer: label,
      answerKind: 'io_rule',
      hint: 'Look at how each input becomes the output.',
    };
  }

  const blankIndexes = new Set();
  while (blankIndexes.size < 2) blankIndexes.add(randomInt(0, rows.length - 1));
  const answers = [];
  const lines = rows.map((row, index) => {
    if (!blankIndexes.has(index)) return `${row.input} → ${row.output}`;
    if (Math.random() < 0.5) {
      answers.push(row.output);
      return `${row.input} → ____`;
    }
    answers.push(row.input);
    return `____ → ${row.output}`;
  });

  return {
    type: kind,
    prompt: `Rule: ${label}\nFill the missing numbers (in order, comma-separated).\n${lines.join('\n')}`,
    answer: answers.join(','),
    answerKind: 'list',
    hint: `Use the rule ${label} on each row.`,
  };
};
