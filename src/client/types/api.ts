export type DifficultyId = 'easy' | 'medium' | 'hard';

export interface DifficultyOption {
  id: DifficultyId;
  label: string;
  full?: string;
}

export interface TypeOption {
  id: string;
  label: string;
}

export interface ModeOption {
  id: string;
  label: string;
}

export interface MetaResponse {
  grades: number[];
  difficulties: DifficultyOption[];
  modes: ModeOption[];
  types: TypeOption[];
  multiplicationTypes: TypeOption[];
  divisionTypes: TypeOption[];
  placeValueTypes: TypeOption[];
  roundingTypes: TypeOption[];
  factorsTypes: TypeOption[];
  timesAsManyTypes: TypeOption[];
  moneyCountTypes: TypeOption[];
  measurementTypes: TypeOption[];
  timeTypes: TypeOption[];
  fractionTypes: TypeOption[];
  inputOutputTypes: TypeOption[];
  geographyTypes: TypeOption[];
  patternTypes: TypeOption[];
  scienceQuizTypes: TypeOption[];
}

export interface Quote {
  id?: string;
  quote: string;
  author?: string;
  theme?: string;
}

export interface HomeContent {
  featured: Quote | null;
  quotes: Quote[];
}

export interface ProblemLayout {
  top?: string | number;
  bottom?: string | number;
  multiplicand?: string | number;
  multiplier?: string | number;
  dividend?: string | number;
  divisor?: string | number;
  operator?: string;
}

export interface Problem {
  id: string;
  mode: string;
  grade: number;
  difficulty?: DifficultyId;
  type?: string;
  prompt: string;
  hint?: string;
  display?: 'standard_algorithm' | 'long_division' | 'multiple_choice' | string;
  layout?: ProblemLayout;
  answerKind?: string;
  /** Multiple-choice options (e.g. science quiz A–D). */
  choices?: string[];
}

export interface CheckResult {
  correct: boolean;
  correctAnswer?: string;
}

export interface RevealResult {
  correctAnswer: string;
}

export interface LoginResult {
  token: string;
  username: string;
  displayName: string;
}

export interface SessionResult {
  authenticated: boolean;
  username?: string;
  displayName?: string;
}

export interface AuthUser {
  username: string;
  displayName: string;
}
