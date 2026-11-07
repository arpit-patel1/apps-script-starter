import { normalizeDifficulty } from './difficulty.js';
import {
  COUNTRY_CONTINENTS,
  INDIA_STATES_AND_CAPITALS,
  US_STATES_AND_ABBREVIATIONS,
  US_STATES_AND_CAPITALS,
  WORLD_CAPITALS,
} from './geography-data.js';

export const GEOGRAPHY_TYPES = [
  { id: 'us_capital', label: 'US capitals' },
  { id: 'us_abbrev', label: 'US abbreviations' },
  { id: 'continent', label: 'Continents' },
  { id: 'world_capital', label: 'World capitals' },
  { id: 'india_capital', label: 'India capitals' },
];

const pick = (items) => items[Math.floor(Math.random() * items.length)];

/** Normalize place-name answers for forgiving comparison. */
export const normalizeGeoAnswer = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^st /g, 'saint ')
    .replace(/\bst\b/g, 'saint');

const reverseCapital = (kind, pool, item, placeLabel, hint) => {
  const same = pool.filter((row) => normalizeGeoAnswer(row.capital) === normalizeGeoAnswer(item.capital));
  if (same.length > 1) {
    return {
      type: kind,
      prompt: `Name a ${placeLabel} with the capital ${item.capital}.`,
      answer: item.state,
      accepted: same.map((row) => row.state),
      answerKind: 'geo_list',
      hint,
    };
  }
  return {
    type: kind,
    prompt: `Which ${placeLabel} has the capital ${item.capital}?`,
    answer: item.state,
    answerKind: 'geo',
    hint,
  };
};

const poolSlice = (items, grade, difficulty) => {
  const level = normalizeDifficulty(difficulty);
  const g = Number(grade) || 3;
  if (level === 'easy' || g <= 3) {
    return items.slice(0, Math.min(items.length, 20));
  }
  if (level === 'medium' || g === 4) {
    return items.slice(0, Math.min(items.length, 35));
  }
  return items.slice();
};

const normalizeType = (type) => {
  const ids = GEOGRAPHY_TYPES.map((item) => item.id);
  return ids.includes(type) ? type : 'us_capital';
};

export const generateGeography = ({ grade, type, difficulty } = {}) => {
  const kind = normalizeType(type);
  const level = normalizeDifficulty(difficulty);
  const reverse = level === 'hard' && Math.random() < 0.55;

  if (kind === 'us_capital') {
    const pool = poolSlice(US_STATES_AND_CAPITALS, grade, difficulty);
    const item = pick(pool);
    if (reverse) {
      return reverseCapital(kind, pool, item, 'U.S. state', 'Type the state name.');
    }
    return {
      type: kind,
      prompt: `What is the capital of ${item.state}?`,
      answer: item.capital,
      answerKind: 'geo',
      hint: 'Type the capital city.',
    };
  }

  if (kind === 'us_abbrev') {
    const pool = poolSlice(US_STATES_AND_ABBREVIATIONS, grade, difficulty);
    const item = pick(pool);
    if (reverse) {
      return {
        type: kind,
        prompt: `Which U.S. state uses the abbreviation ${item.abbreviation}?`,
        answer: item.state,
        answerKind: 'geo',
        hint: 'Type the full state name.',
      };
    }
    return {
      type: kind,
      prompt: `What is the 2-letter abbreviation for ${item.state}?`,
      answer: item.abbreviation,
      answerKind: 'geo',
      hint: 'Use the USPS 2-letter code (example: CA).',
    };
  }

  if (kind === 'continent') {
    const pool = poolSlice(COUNTRY_CONTINENTS, grade, difficulty);
    const item = pick(pool);
    if (reverse) {
      const same = COUNTRY_CONTINENTS.filter((row) => row.continent === item.continent);
      const answerCountry = pick(same);
      return {
        type: kind,
        prompt: `Name a country on the continent of ${item.continent}.`,
        answer: answerCountry.country,
        accepted: same.map((row) => row.country),
        answerKind: 'geo_list',
        hint: 'Any country on that continent from our list is OK.',
      };
    }
    return {
      type: kind,
      prompt: `On which continent is ${item.country}?`,
      answer: item.continent,
      answerKind: 'geo',
      hint: 'Africa, Antarctica, Asia, Europe, North America, Oceania, or South America.',
    };
  }

  if (kind === 'india_capital') {
    const pool = poolSlice(INDIA_STATES_AND_CAPITALS, grade, difficulty);
    const item = pick(pool);
    if (reverse) {
      return reverseCapital(
        kind,
        pool,
        item,
        'Indian state or UT',
        'Type the state or union territory name.',
      );
    }
    const aliases =
      item.capital === 'Bengaluru'
        ? ['Bengaluru', 'Bangalore']
        : item.capital === 'Mumbai'
          ? ['Mumbai', 'Bombay']
          : item.capital === 'Kolkata'
            ? ['Kolkata', 'Calcutta']
            : item.capital === 'Chennai'
              ? ['Chennai', 'Madras']
              : item.state === 'Jammu and Kashmir'
                ? ['Srinagar', 'Jammu']
                : null;
    if (aliases) {
      return {
        type: kind,
        prompt: `What is the capital of ${item.state}?`,
        answer: item.capital,
        accepted: aliases,
        answerKind: 'geo_list',
        hint: 'Type the capital city.',
      };
    }
    return {
      type: kind,
      prompt: `What is the capital of ${item.state}?`,
      answer: item.capital,
      answerKind: 'geo',
      hint: 'Type the capital city.',
    };
  }

  // world_capital
  const pool = poolSlice(WORLD_CAPITALS, grade, difficulty);
  const item = pick(pool);
  if (reverse) {
    const same = pool.filter(
      (row) => normalizeGeoAnswer(row.capital) === normalizeGeoAnswer(item.capital),
    );
    if (same.length > 1) {
      return {
        type: kind,
        prompt: `Name a country with the capital ${item.capital}.`,
        answer: item.country,
        accepted: same.map((row) => row.country),
        answerKind: 'geo_list',
        hint: 'Type the country name.',
      };
    }
    return {
      type: kind,
      prompt: `Which country has the capital ${item.capital}?`,
      answer: item.country,
      answerKind: 'geo',
      hint: 'Type the country name.',
    };
  }
  return {
    type: kind,
    prompt: `What is the capital of ${item.country}?`,
    answer: item.capital,
    answerKind: 'geo',
    hint: 'Type the capital city.',
  };
};
