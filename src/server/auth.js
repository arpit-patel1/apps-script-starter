import { SESSION_CACHE_SECONDS } from './config.js';
import { ensureDatabase } from './seed.js';
import { getUsers } from './sheets.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 5 * 60;

const sessionKey = (token) => `session:${token}`;
const failKey = (username) => `auth-fail:${username}`;

export const normalizeUsername = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

export const normalizePassword = (value) => String(value ?? '').trim();

/** Kids may use a short PIN or a longer password. */
const isValidPasswordShape = (password) => password.length >= 4 && password.length <= 64;

const createToken = () => {
  const raw = Utilities.getUuid() + Utilities.getUuid();
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw))
    .replace(/=+$/g, '')
    .slice(0, 48);
};

const readFailState = (username) => {
  const raw = CacheService.getScriptCache().get(failKey(username));
  if (!raw) return { count: 0, lockedUntil: 0 };
  try {
    const parsed = JSON.parse(raw);
    return {
      count: Number(parsed.count) || 0,
      lockedUntil: Number(parsed.lockedUntil) || 0,
    };
  } catch (ignore) {
    return { count: 0, lockedUntil: 0 };
  }
};

const writeFailState = (username, state) => {
  CacheService.getScriptCache().put(failKey(username), JSON.stringify(state), LOCKOUT_SECONDS);
};

const clearFailState = (username) => {
  CacheService.getScriptCache().remove(failKey(username));
};

const recordFailedAttempt = (username) => {
  const now = Date.now();
  const current = readFailState(username);
  if (current.lockedUntil > now) {
    return current;
  }
  const count = current.count + 1;
  const next = {
    count,
    lockedUntil: count >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_SECONDS * 1000 : 0,
  };
  writeFailState(username, next);
  return next;
};

/** Resolve session user or throw a friendly auth error. */
export const requireUser = (token) => {
  const value = String(token ?? '').trim();
  if (!value) {
    throw new Error('Please sign in to continue.');
  }
  const raw = CacheService.getScriptCache().get(sessionKey(value));
  if (!raw) {
    throw new Error('Session expired. Please sign in again.');
  }
  try {
    const user = JSON.parse(raw);
    if (!user || !user.username) {
      throw new Error('Session expired. Please sign in again.');
    }
    return {
      username: String(user.username),
      displayName: String(user.displayName || user.username),
    };
  } catch (error) {
    if (error && /sign in/i.test(String(error.message))) throw error;
    throw new Error('Session expired. Please sign in again.');
  }
};

export const login = (options = {}) => {
  ensureDatabase();
  const username = normalizeUsername(options.username);
  const password = normalizePassword(options.password ?? options.pin);

  if (!username || !password) {
    throw new Error('Enter a username and password.');
  }
  if (!isValidPasswordShape(password)) {
    throw new Error('Password must be 4 to 64 characters.');
  }

  const fails = readFailState(username);
  if (fails.lockedUntil > Date.now()) {
    throw new Error('Too many tries. Wait a few minutes, then try again.');
  }

  const user = getUsers().find((row) => row.username === username && row.password === password);
  if (!user) {
    const next = recordFailedAttempt(username);
    if (next.lockedUntil > Date.now()) {
      throw new Error('Too many tries. Wait a few minutes, then try again.');
    }
    throw new Error('Incorrect username or password.');
  }

  clearFailState(username);
  const token = createToken();
  const payload = {
    username: user.username,
    displayName: user.displayName || user.username,
  };
  CacheService.getScriptCache().put(sessionKey(token), JSON.stringify(payload), SESSION_CACHE_SECONDS);

  return {
    token,
    username: payload.username,
    displayName: payload.displayName,
  };
};

export const logout = (options = {}) => {
  const token = String(options.token ?? '').trim();
  if (token) {
    CacheService.getScriptCache().remove(sessionKey(token));
  }
  return { ok: true };
};

export const getSession = (options = {}) => {
  try {
    const user = requireUser(options.token);
    return {
      authenticated: true,
      username: user.username,
      displayName: user.displayName,
    };
  } catch (ignore) {
    return { authenticated: false };
  }
};
