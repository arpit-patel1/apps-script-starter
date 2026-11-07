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

export const generateDivision = ({ grade, type } = {}) => {
  const kind = normalizeDivisionType(type);
  const g = Number(grade) || 3;

  if (kind === 'facts') {
    const divisor = g <= 3 ? randomInt(2, 10) : randomInt(6, 12);
    const quotient = g <= 3 ? randomInt(2, 10) : randomInt(6, 12);
    return {
      type: kind,
      dividend: divisor * quotient,
      divisor,
      quotient,
      remainder: 0,
      answer: String(quotient),
    };
  }

  const divisor = randomInt(2, 9);
  let quotient;
  if (g <= 3) {
    quotient = randomInt(2, 99);
  } else if (g === 4) {
    quotient = randomInt(10, 99);
  } else {
    quotient = randomInt(100, 999);
  }

  const remainder = kind === 'long_division' && Math.random() < 0.35 ? 0 : randomInt(0, divisor - 1);
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
