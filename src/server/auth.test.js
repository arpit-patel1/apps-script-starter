import { normalizePassword, normalizeUsername } from './auth.js';
import { USER_HEADERS, USER_SEED } from './seed-data.js';

describe('auth helpers', () => {
  it('normalizes username and password', () => {
    expect(normalizeUsername('  Maya ')).toBe('maya');
    expect(normalizePassword(' 1234 ')).toBe('1234');
  });

  it('seeds three example users with passwords', () => {
    expect(USER_HEADERS).toEqual(['username', 'password', 'display_name', 'active']);
    expect(USER_SEED).toHaveLength(3);
    USER_SEED.forEach((row) => {
      expect(String(row[1]).length).toBeGreaterThanOrEqual(4);
      expect(row[3]).toBe(true);
    });
  });
});
