import type {
  CheckResult,
  HomeContent,
  LoginResult,
  MetaResponse,
  Problem,
  RevealResult,
  SessionResult,
} from '@/types/api';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function isAuthError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || '');
  return /sign in|session expired/i.test(message);
}

type GasFn =
  | 'login'
  | 'logout'
  | 'getSession'
  | 'getMeta'
  | 'getHomeContent'
  | 'getNextProblem'
  | 'checkAnswer'
  | 'revealAnswer';

function runGas<T>(fn: GasFn, payload?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const runner = window.google?.script?.run;
    if (!runner) {
      reject(new Error('google.script.run is not available'));
      return;
    }
    runner
      .withSuccessHandler((result) => resolve(result as T))
      .withFailureHandler((error) => {
        const err = error instanceof Error ? error : new Error(String(error));
        reject(err);
      })
      [fn](payload);
  });
}

const MOCK_META: MetaResponse = {
  grades: [3, 4, 5],
  difficulties: [
    { id: 'easy', label: 'E', full: 'Easy' },
    { id: 'medium', label: 'M', full: 'Medium' },
    { id: 'hard', label: 'H', full: 'Hard' },
  ],
  modes: [],
  types: [
    { id: 'operations', label: 'Operations' },
    { id: 'money', label: 'Money' },
  ],
  multiplicationTypes: [
    { id: '1_digit', label: '1-digit' },
    { id: '2_digit', label: '2-digit' },
  ],
  divisionTypes: [
    { id: 'facts', label: 'Facts' },
    { id: 'divide', label: 'Divide' },
    { id: 'long_division', label: 'Long division' },
  ],
  placeValueTypes: [
    { id: 'digit_value', label: 'Digit value' },
    { id: 'standard', label: 'Standard' },
    { id: 'expanded', label: 'Expanded' },
    { id: 'word', label: 'From words' },
    { id: 'compare', label: 'Compare' },
  ],
  roundingTypes: [
    { id: 'forward', label: 'Round' },
    { id: 'reverse', label: 'Which rounds?' },
  ],
  factorsTypes: [
    { id: 'pairs', label: 'Pairs' },
    { id: 'multiples', label: 'Multiples' },
    { id: 'list_multiples', label: 'List multiples' },
    { id: 'prime_composite', label: 'Prime/composite' },
  ],
  timesAsManyTypes: [
    { id: 'equation', label: 'Equation' },
    { id: 'word', label: 'Word' },
    { id: 'write_equation', label: 'Write equation' },
  ],
  moneyCountTypes: [
    { id: 'count', label: 'Count' },
    { id: 'make', label: 'Make' },
  ],
  measurementTypes: [
    { id: 'length', label: 'Length' },
    { id: 'volume', label: 'Volume' },
    { id: 'weight', label: 'Weight' },
  ],
  timeTypes: [
    { id: 'read', label: 'Read' },
    { id: 'elapsed', label: 'Elapsed' },
    { id: 'convert', label: 'Convert' },
  ],
  fractionTypes: [
    { id: 'add', label: 'Add' },
    { id: 'subtract', label: 'Subtract' },
    { id: 'multiply', label: 'Multiply' },
    { id: 'compare', label: 'Compare' },
  ],
  inputOutputTypes: [
    { id: 'fill', label: 'Fill' },
    { id: 'find_rule', label: 'Find rule' },
  ],
  geographyTypes: [
    { id: 'us_capitals', label: 'US capitals' },
    { id: 'world_capitals', label: 'World capitals' },
  ],
  patternTypes: [
    { id: 'number', label: 'Number' },
    { id: 'shape', label: 'Shape' },
  ],
  scienceQuizTypes: [
    { id: 'plants', label: 'Plants' },
    { id: 'animals', label: 'Animals' },
  ],
};

let mockToken: string | null = null;
let mockProblemCounter = 0;

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function requireMockAuth(payload?: { token?: string | null }) {
  const token = payload?.token || '';
  if (!token || (!String(token).startsWith('mock-') && token !== mockToken)) {
    throw new AuthError('Please sign in to continue.');
  }
  mockToken = String(token);
}

async function mockRun<T>(fn: GasFn, payload?: unknown): Promise<T> {
  const data = (payload || {}) as Record<string, unknown>;

  if (fn === 'login') {
    const username = String(data.username || '').trim() || 'student';
    mockToken = `mock-${Date.now()}`;
    return delay({
      token: mockToken,
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
    } as T);
  }

  if (fn === 'logout') {
    mockToken = null;
    return delay(undefined as T);
  }

  if (fn === 'getSession') {
    const token = String(data.token || '');
    if (!token || (!token.startsWith('mock-') && token !== mockToken)) {
      return delay({ authenticated: false } as T);
    }
    mockToken = token;
    return delay({
      authenticated: true,
      username: 'student',
      displayName: 'Student',
    } as T);
  }

  requireMockAuth(data as { token?: string | null });

  if (fn === 'getMeta') return delay(MOCK_META as T);

  if (fn === 'getHomeContent') {
    return delay({
      featured: {
        quote: 'Small steps every day still take you somewhere new.',
        author: 'Kids Playground',
        theme: 'growth',
      },
      quotes: [
        {
          quote: 'Small steps every day still take you somewhere new.',
          author: 'Kids Playground',
          theme: 'growth',
        },
        {
          quote: 'Curiosity is homework for the heart.',
          author: 'Playground Notes',
          theme: 'curiosity',
        },
      ],
    } as T);
  }

  if (fn === 'getNextProblem') {
    mockProblemCounter += 1;
    const mode = String(data.mode || 'addition');
    const grade = Number(data.grade || 3);
    const difficulty = String(data.difficulty || 'medium');
    const type = data.type ? String(data.type) : undefined;
    const id = `mock-${mode}-${mockProblemCounter}`;

    if (mode === 'multiplication') {
      return delay({
        id,
        mode,
        grade,
        difficulty,
        type: type || '1_digit',
        prompt: '24 × 6',
        display: 'standard_algorithm',
        layout: { top: 24, bottom: 6, operator: '×' },
      } as T);
    }

    if (mode === 'division' && (type === 'long_division' || !type)) {
      return delay({
        id,
        mode,
        grade,
        difficulty,
        type: type || 'long_division',
        prompt: '144 ÷ 12',
        display: 'long_division',
        layout: { dividend: 144, divisor: 12 },
      } as T);
    }

    if (mode === 'riddle') {
      return delay({
        id,
        mode,
        grade,
        difficulty,
        prompt: 'I have hands but no arms. What am I?',
        hint: 'Think about time.',
      } as T);
    }

    if (mode === 'science_quiz') {
      return delay({
        id,
        mode,
        grade,
        difficulty,
        type: type || 'landforms',
        display: 'multiple_choice',
        prompt: 'Which landform would you find right next to the sea?',
        choices: ['Desert', 'Coast or beach', 'Valley', 'Cave'],
        hint: 'Topic: Science',
        answerKind: 'geo',
      } as T);
    }

    return delay({
      id,
      mode,
      grade,
      difficulty,
      type,
      prompt:
        mode === 'addition'
          ? '48\n+ 17'
          : `Mock ${mode.replace(/_/g, ' ')} problem #${mockProblemCounter}`,
      display: mode === 'addition' || mode === 'subtraction' ? 'standard_algorithm' : undefined,
      layout:
        mode === 'addition'
          ? { top: 48, bottom: 17, operator: '+' }
          : mode === 'subtraction'
            ? { top: 52, bottom: 19, operator: '−' }
            : undefined,
    } as T);
  }

  if (fn === 'checkAnswer') {
    const answer = String(data.userAnswer || '').trim().toLowerCase();
    const correct =
      answer === '42' ||
      answer === 'yes' ||
      answer === 'clock' ||
      answer === 'coast or beach';
    return delay({
      correct,
      correctAnswer: correct ? String(data.userAnswer) : 'Coast or beach',
    } as T);
  }

  if (fn === 'revealAnswer') {
    return delay({ correctAnswer: '42' } as T);
  }

  throw new Error(`Unsupported mock RPC: ${fn}`);
}

const useMock =
  typeof __USE_MOCK_GAS__ !== 'undefined'
    ? __USE_MOCK_GAS__
    : typeof window !== 'undefined' && !window.google?.script?.run;

async function call<T>(fn: GasFn, payload?: unknown): Promise<T> {
  if (useMock) return mockRun<T>(fn, payload);
  return runGas<T>(fn, payload);
}

export const gas = {
  login: (payload: { username: string; password: string }) => call<LoginResult>('login', payload),
  logout: (payload: { token: string | null }) => call<void>('logout', payload),
  getSession: (payload: { token: string | null }) => call<SessionResult>('getSession', payload),
  getMeta: (payload: { token: string | null }) => call<MetaResponse>('getMeta', payload),
  getHomeContent: (payload: { token: string | null }) =>
    call<HomeContent>('getHomeContent', payload),
  getNextProblem: (payload: Record<string, unknown>) => call<Problem>('getNextProblem', payload),
  checkAnswer: (payload: Record<string, unknown>) => call<CheckResult>('checkAnswer', payload),
  revealAnswer: (payload: Record<string, unknown>) => call<RevealResult>('revealAnswer', payload),
};
