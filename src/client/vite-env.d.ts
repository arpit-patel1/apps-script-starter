/// <reference types="vite/client" />

declare const __USE_MOCK_GAS__: boolean;

interface GoogleScriptRun {
  withSuccessHandler(cb: (result: unknown) => void): GoogleScriptRun;
  withFailureHandler(cb: (error: Error) => void): GoogleScriptRun;
  login(payload: unknown): void;
  logout(payload: unknown): void;
  getSession(payload: unknown): void;
  getMeta(payload: unknown): void;
  getHomeContent(payload: unknown): void;
  getNextProblem(payload: unknown): void;
  checkAnswer(payload: unknown): void;
  revealAnswer(payload: unknown): void;
}

interface Window {
  google?: {
    script?: {
      run: GoogleScriptRun;
    };
  };
}
