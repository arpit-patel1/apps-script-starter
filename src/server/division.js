const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const normalizeDivisionType = (type) => {
  if (type === 'divide') return 'divide';
  if (type === 'long_division' || type === 'longDivision') return 'long_division';
  return 'facts';
};

export const formatDivisionAnswer = (quotient, remainder) => {
  if (!remainder) return String(quotient);
  return `${quotient} r ${remainder}`;
};

export const generateDivision = ({ grade, type, difficulty } = {}) => {
  const kind = normalizeDivisionType(type);
  const g = Number(grade) || 3;
  const level = String(difficulty || 'medium');

  if (kind === 'facts') {
    let divisorMax = g <= 3 ? 10 : 12;
    let divisorMin = g <= 3 ? 2 : 6;
    if (level === 'easy') {
      divisorMax = Math.min(divisorMax, 5);
      divisorMin = 2;
    }
    if (level === 'hard') divisorMin = Math.max(divisorMin, g <= 3 ? 6 : 8);
    const divisor = randomInt(divisorMin, divisorMax);
    const quotient = randomInt(divisorMin, divisorMax);
    return {
      type: kind,
      dividend: divisor * quotient,
      divisor,
      quotient,
      remainder: 0,
      answer: String(quotient),
    };
  }

  const divisor = level === 'easy' ? randomInt(2, 5) : randomInt(2, 9);
  let quotient;
  if (g <= 3) {
    quotient = level === 'easy' ? randomInt(2, 20) : level === 'hard' ? randomInt(20, 99) : randomInt(2, 99);
  } else if (g === 4) {
    quotient = level === 'easy' ? randomInt(10, 40) : level === 'hard' ? randomInt(40, 99) : randomInt(10, 99);
  } else {
    quotient =
      level === 'easy' ? randomInt(100, 300) : level === 'hard' ? randomInt(400, 999) : randomInt(100, 999);
  }

  const remainder =
    kind === 'long_division' && (level === 'hard' || Math.random() < 0.35)
      ? randomInt(0, divisor - 1)
      : level === 'easy'
        ? 0
        : randomInt(0, divisor - 1);
  const dividend = divisor * quotient + remainder;

  return {
    type: kind,
    dividend,
    divisor,
    quotient,
    remainder,
    answer: formatDivisionAnswer(quotient, remainder),
  };
};
