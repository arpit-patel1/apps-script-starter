import { PATTERN_TYPES } from './modal-activities.js';

describe('modal activity types', () => {
  it('exposes pattern type pills', () => {
    expect(PATTERN_TYPES.map((item) => item.id)).toEqual(['number', 'shape', 'color']);
  });
});
