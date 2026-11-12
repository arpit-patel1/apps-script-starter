export interface NavChild {
  id: string;
  label: string;
  route: string;
  ready: boolean;
}

export interface NavLink {
  id: string;
  label: string;
  type: 'link';
  route: string;
}

export interface NavGroup {
  id: string;
  label: string;
  type: 'group';
  open: boolean;
  children: NavChild[];
}

export type NavItem = NavLink | NavGroup;

export const NAV: NavItem[] = [
  { id: 'home', label: 'Homepage', type: 'link', route: 'home' },
  {
    id: 'math',
    label: 'Math',
    type: 'group',
    open: true,
    children: [
      { id: 'math-addition', label: 'Addition', route: 'math/addition', ready: true },
      { id: 'math-subtraction', label: 'Subtraction', route: 'math/subtraction', ready: true },
      { id: 'math-multiplication', label: 'Multiplication', route: 'math/multiplication', ready: true },
      { id: 'math-division', label: 'Division', route: 'math/division', ready: true },
      { id: 'math-place-value', label: 'Place value', route: 'math/place-value', ready: true },
      { id: 'math-rounding', label: 'Rounding', route: 'math/rounding', ready: true },
      { id: 'math-factors', label: 'Factors & multiples', route: 'math/factors', ready: true },
      { id: 'math-missing-symbol', label: 'Missing symbol', route: 'math/missing-symbol', ready: true },
      { id: 'math-estimate', label: 'Estimate', route: 'math/estimate', ready: true },
      { id: 'math-times-as-many', label: 'Times as many', route: 'math/times-as-many', ready: true },
      { id: 'math-money-count', label: 'Money — coins & bills', route: 'math/money-count', ready: true },
      { id: 'math-money-change', label: 'Money — change', route: 'math/money-change', ready: true },
      { id: 'math-money-compare', label: 'Money — compare', route: 'math/money-compare', ready: true },
      { id: 'math-measurement', label: 'Measurement', route: 'math/measurement', ready: true },
      { id: 'math-time', label: 'Time', route: 'math/time', ready: true },
      { id: 'math-fractions', label: 'Fractions', route: 'math/fractions', ready: true },
      {
        id: 'math-order-of-operations',
        label: 'Order of operations',
        route: 'math/order-of-operations',
        ready: true,
      },
      { id: 'math-input-output', label: 'Input/output', route: 'math/input-output', ready: true },
      { id: 'math-word-problems', label: 'Word problems', route: 'math/word-problems', ready: true },
      { id: 'math-patterns', label: 'Patterns', route: 'math/patterns', ready: true },
    ],
  },
  {
    id: 'ela',
    label: 'ELA',
    type: 'group',
    open: false,
    children: [
      { id: 'ela-riddles', label: 'Riddles', route: 'ela/riddles', ready: true },
      { id: 'ela-fill-blank', label: 'Fill in the blank', route: 'ela/fill-blank', ready: true },
      { id: 'ela-reading', label: 'Reading', route: 'ela/reading', ready: false },
      { id: 'ela-writing', label: 'Writing', route: 'ela/writing', ready: false },
    ],
  },
  {
    id: 'science',
    label: 'Science',
    type: 'group',
    open: false,
    children: [{ id: 'sci-quiz', label: 'Science quiz', route: 'science/quiz', ready: true }],
  },
  {
    id: 'geometry',
    label: 'Geometry',
    type: 'group',
    open: false,
    children: [
      { id: 'geo-shapes', label: 'Shapes', route: 'geometry/shapes', ready: false },
      { id: 'geo-angles', label: 'Angles', route: 'geometry/angles', ready: false },
    ],
  },
  {
    id: 'geography',
    label: 'Geography',
    type: 'group',
    open: false,
    children: [
      {
        id: 'geog-quiz',
        label: 'Capitals & continents',
        route: 'geography/quiz',
        ready: true,
      },
    ],
  },
];

export interface RouteMeta {
  crumb: string;
  title: string;
  subject: string | null;
  activity: NavChild | null;
}

export function findRouteMeta(route: string): RouteMeta {
  if (route === 'home' || !route) {
    return { crumb: 'Home', title: 'Homepage', subject: null, activity: null };
  }
  for (const item of NAV) {
    if (item.type !== 'group') continue;
    for (const child of item.children) {
      if (child.route === route) {
        return {
          crumb: `${item.label} / ${child.label}`,
          title: child.label,
          subject: item.id,
          activity: child,
        };
      }
    }
  }
  return { crumb: 'Home', title: 'Homepage', subject: null, activity: null };
}

export function toHashPath(route: string): string {
  return `#/${route.replace(/^\/+/, '')}`;
}

export function routeFromHash(hash: string): string {
  const raw = (hash || '').replace(/^#\/?/, '').trim();
  return raw || 'home';
}

export interface PracticeModeConfig {
  mode: string;
  badge: string;
  showType?: boolean;
  typeLabel?: string;
  answerLabel?: string;
  answerPlaceholder?: string;
  inputMode?: string;
  revealOnly?: boolean;
  showReveal?: boolean;
  typesKey?: keyof import('@/types/api').MetaResponse;
}

/** Route → practice config for all live activities. */
export const PRACTICE_BY_ROUTE: Record<string, PracticeModeConfig> = {
  'math/addition': {
    mode: 'addition',
    badge: 'Addition',
    answerLabel: 'Sum',
    answerPlaceholder: 'Type the sum',
    inputMode: 'numeric',
  },
  'math/subtraction': {
    mode: 'subtraction',
    badge: 'Subtraction',
    answerLabel: 'Difference',
    answerPlaceholder: 'Type the difference',
    inputMode: 'numeric',
  },
  'math/multiplication': {
    mode: 'multiplication',
    badge: 'Multiplication',
    showType: true,
    typeLabel: 'Algorithm',
    answerLabel: 'Product (final answer)',
    answerPlaceholder: 'Type the product',
    inputMode: 'numeric',
    typesKey: 'multiplicationTypes',
  },
  'math/division': {
    mode: 'division',
    badge: 'Division',
    showType: true,
    typeLabel: 'Division type',
    answerLabel: 'Quotient (use r for remainder)',
    answerPlaceholder: 'e.g. 12 or 12 r 3',
    inputMode: 'text',
    typesKey: 'divisionTypes',
  },
  'math/place-value': {
    mode: 'place_value',
    badge: 'Place value',
    showType: true,
    typeLabel: 'Place value type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Number, expanded form, or < > =',
    inputMode: 'text',
    typesKey: 'placeValueTypes',
  },
  'math/rounding': {
    mode: 'rounding',
    badge: 'Rounding',
    showType: true,
    typeLabel: 'Rounding type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Rounded number',
    inputMode: 'numeric',
    typesKey: 'roundingTypes',
  },
  'math/factors': {
    mode: 'factors',
    badge: 'Factors & multiples',
    showType: true,
    typeLabel: 'Factors type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Type your answer',
    inputMode: 'text',
    typesKey: 'factorsTypes',
  },
  'math/missing-symbol': {
    mode: 'missing_symbol',
    badge: 'Missing symbol',
    answerLabel: 'Missing symbol',
    answerPlaceholder: '+ − × ÷ = < >',
    inputMode: 'text',
  },
  'math/estimate': {
    mode: 'estimate',
    badge: 'Estimate',
    answerLabel: 'Estimate',
    answerPlaceholder: 'Rounded estimate',
    inputMode: 'numeric',
  },
  'math/times-as-many': {
    mode: 'times_as_many',
    badge: 'Times as many',
    showType: true,
    typeLabel: 'Problem type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Number or equation like 24 = 3 × 8',
    inputMode: 'text',
    typesKey: 'timesAsManyTypes',
  },
  'math/money-count': {
    mode: 'money_count',
    badge: 'Money — coins & bills',
    showType: true,
    typeLabel: 'Money type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'e.g. $1.35 or 135¢',
    inputMode: 'decimal',
    typesKey: 'moneyCountTypes',
  },
  'math/money-change': {
    mode: 'money_change',
    badge: 'Money — change',
    answerLabel: 'Change',
    answerPlaceholder: 'e.g. $0.25 or 25¢',
    inputMode: 'decimal',
  },
  'math/money-compare': {
    mode: 'money_compare',
    badge: 'Money — compare',
    answerLabel: 'Compare',
    answerPlaceholder: '<, >, or =',
    inputMode: 'text',
  },
  'math/measurement': {
    mode: 'measurement',
    badge: 'Measurement',
    showType: true,
    typeLabel: 'Category',
    answerLabel: 'Converted amount',
    answerPlaceholder: 'Type the number',
    inputMode: 'numeric',
    typesKey: 'measurementTypes',
  },
  'math/time': {
    mode: 'time',
    badge: 'Time',
    showType: true,
    typeLabel: 'Time type',
    answerLabel: 'Time',
    answerPlaceholder: 'e.g. 3:30',
    inputMode: 'text',
    typesKey: 'timeTypes',
  },
  'math/fractions': {
    mode: 'fractions',
    badge: 'Fractions',
    showType: true,
    typeLabel: 'Fraction type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'e.g. 3/4 or 1 1/2',
    inputMode: 'text',
    typesKey: 'fractionTypes',
  },
  'math/order-of-operations': {
    mode: 'order_of_operations',
    badge: 'Order of operations',
    answerLabel: 'Value',
    answerPlaceholder: 'Type the result',
    inputMode: 'numeric',
  },
  'math/input-output': {
    mode: 'input_output',
    badge: 'Input/output',
    showType: true,
    typeLabel: 'Table type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Missing values or rule like + 5',
    inputMode: 'text',
    typesKey: 'inputOutputTypes',
  },
  'math/word-problems': {
    mode: 'word',
    badge: 'Word problems',
    showType: true,
    typeLabel: 'Problem type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Type your answer',
    inputMode: 'decimal',
    typesKey: 'types',
  },
  'math/patterns': {
    mode: 'pattern',
    badge: 'Patterns',
    showType: true,
    typeLabel: 'Pattern type',
    answerLabel: 'Next item',
    answerPlaceholder: 'What comes next?',
    inputMode: 'text',
    typesKey: 'patternTypes',
  },
  'geography/quiz': {
    mode: 'geography',
    badge: 'Geography',
    showType: true,
    typeLabel: 'Quiz type',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Place name or abbreviation',
    inputMode: 'text',
    typesKey: 'geographyTypes',
  },
  'ela/riddles': {
    mode: 'riddle',
    badge: 'Riddles',
    revealOnly: true,
  },
  'ela/fill-blank': {
    mode: 'fill_blank',
    badge: 'Fill in the blank',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Type your answer',
    inputMode: 'text',
  },
  'science/quiz': {
    mode: 'science_quiz',
    badge: 'Science quiz',
    showType: true,
    typeLabel: 'Topic',
    answerLabel: 'Your answer',
    answerPlaceholder: 'Type your answer',
    inputMode: 'text',
    typesKey: 'scienceQuizTypes',
  },
};

export const HOME_JUMP_CARDS = [
  { subject: 'Math', title: 'Addition', route: 'math/addition', blurb: 'Stacked addition by grade.', ready: true },
  { subject: 'Math', title: 'Subtraction', route: 'math/subtraction', blurb: 'Stacked subtraction by grade.', ready: true },
  {
    subject: 'Math',
    title: 'Multiplication',
    route: 'math/multiplication',
    blurb: 'Standard algorithm: 1-digit and 2-digit.',
    ready: true,
  },
  { subject: 'Math', title: 'Division', route: 'math/division', blurb: 'Facts, divide, long division.', ready: true },
  { subject: 'Math', title: 'Place value', route: 'math/place-value', blurb: 'Digit value, forms, compare.', ready: true },
  {
    subject: 'Math',
    title: 'Rounding',
    route: 'math/rounding',
    blurb: 'Round numbers or name one that rounds.',
    ready: true,
  },
  {
    subject: 'Math',
    title: 'Factors & multiples',
    route: 'math/factors',
    blurb: 'Pairs, multiples, prime/composite.',
    ready: true,
  },
  { subject: 'Math', title: 'Missing symbol', route: 'math/missing-symbol', blurb: 'Fill + − × ÷ = < >.', ready: true },
  { subject: 'Math', title: 'Estimate', route: 'math/estimate', blurb: 'Round, then compute.', ready: true },
  {
    subject: 'Math',
    title: 'Times as many',
    route: 'math/times-as-many',
    blurb: 'Multiplicative comparison.',
    ready: true,
  },
  {
    subject: 'Math',
    title: 'Money — coins & bills',
    route: 'math/money-count',
    blurb: 'Count piles or make an amount.',
    ready: true,
  },
  { subject: 'Math', title: 'Money — change', route: 'math/money-change', blurb: 'Pay and get change.', ready: true },
  { subject: 'Math', title: 'Money — compare', route: 'math/money-compare', blurb: 'Which side is more?', ready: true },
  {
    subject: 'Math',
    title: 'Measurement',
    route: 'math/measurement',
    blurb: 'Length, volume, weight conversions.',
    ready: true,
  },
  { subject: 'Math', title: 'Time', route: 'math/time', blurb: 'Read clocks, elapsed time, convert.', ready: true },
  {
    subject: 'Math',
    title: 'Fractions',
    route: 'math/fractions',
    blurb: 'Add, subtract, multiply, compare.',
    ready: true,
  },
  {
    subject: 'Math',
    title: 'Order of operations',
    route: 'math/order-of-operations',
    blurb: 'PEMDAS expressions.',
    ready: true,
  },
  {
    subject: 'Math',
    title: 'Input/output',
    route: 'math/input-output',
    blurb: 'Tables: fill blanks or find the rule.',
    ready: true,
  },
  { subject: 'Math', title: 'Word problems', route: 'math/word-problems', blurb: 'Story problems by type.', ready: true },
  { subject: 'Math', title: 'Patterns', route: 'math/patterns', blurb: 'Number, shape, and color sequences.', ready: true },
  {
    subject: 'Geography',
    title: 'Capitals & continents',
    route: 'geography/quiz',
    blurb: 'US, world, India capitals; continents.',
    ready: true,
  },
  { subject: 'ELA', title: 'Riddles', route: 'ela/riddles', blurb: 'Guess the answer from a clue.', ready: true },
  { subject: 'ELA', title: 'Fill in the blank', route: 'ela/fill-blank', blurb: 'Complete the sentence.', ready: true },
  { subject: 'Science', title: 'Science quiz', route: 'science/quiz', blurb: 'Topic quizzes from Modal.', ready: true },
  { subject: 'ELA', title: 'Reading', route: 'ela/reading', blurb: 'Passages coming soon.', ready: false },
];
