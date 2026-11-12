import { normalizeDifficulty } from './difficulty.js';
import { modalGet } from './modal.js';

export const PATTERN_TYPES = [
  { id: 'number', label: 'Number' },
  { id: 'shape', label: 'Shape' },
  { id: 'color', label: 'Color' },
];

const normalizePatternType = (type) => {
  const ids = PATTERN_TYPES.map((item) => item.id);
  return ids.includes(type) ? type : 'number';
};

/** What comes next in a number / shape / color pattern. */
export const generatePattern = ({ type, difficulty } = {}) => {
  const kind = normalizePatternType(type);
  const level = normalizeDifficulty(difficulty);
  const data = modalGet('/math/pattern', { type: kind, level });
  const sequence = Array.isArray(data.pattern) ? data.pattern.map(String) : [];
  const promptParts = [
    'What comes next in this pattern?',
    sequence.length ? sequence.join(', ') + ', ?' : String(data.pattern ?? ''),
  ];
  if (Array.isArray(data.choices) && data.choices.length) {
    promptParts.push(`Choices: ${data.choices.map(String).join(', ')}`);
  }

  return {
    type: kind,
    prompt: promptParts.filter(Boolean).join('\n'),
    answer: String(data.answer ?? ''),
    hint: data.hint || data.rule || 'Find the rule that repeats.',
    answerKind: null,
  };
};

/** Kid riddle from Modal. */
export const generateRiddle = () => {
  const data = modalGet('/riddles');
  return {
    type: 'riddle',
    prompt: String(data.riddle || data.prompt || '').trim(),
    answer: String(data.answer || '').trim(),
    hint: data.hint || 'Think about the clue words.',
    answerKind: 'geo',
  };
};

/** Fill-in-the-blank sentence from Modal. */
export const generateFillBlank = ({ difficulty } = {}) => {
  const level = normalizeDifficulty(difficulty);
  const data = modalGet('/sentence/fill-blank', { difficulty: level });
  const sentence = String(data.sentence || '').trim();
  const options = Array.isArray(data.options) ? data.options.map(String) : [];
  const promptParts = [sentence];
  if (options.length) {
    promptParts.push(`Choices: ${options.join(', ')}`);
  }

  return {
    type: 'fill_blank',
    prompt: promptParts.join('\n'),
    answer: String(data.correct_answer || data.answer || '').trim(),
    hint: 'Pick the word that fits the blank.',
    answerKind: 'geo',
  };
};

/** Science quiz MCQ from Modal Volume baskets. */
export const generateScienceQuiz = ({ type } = {}) => {
  const key = String(type || '').trim();
  if (!key) {
    throw new Error('Pick a science topic.');
  }
  const data = modalGet('/science/quiz/random', { key });
  const choices = Array.isArray(data.options) ? data.options.map(String) : [];
  const answer = String(data.correctAnswer || data.answer || '').trim();

  return {
    type: key,
    prompt: String(data.question || '').trim(),
    choices,
    answer,
    hint: data.subject ? `Topic: ${data.subject}` : 'Tap A, B, C, or D.',
    answerKind: 'geo',
  };
};
