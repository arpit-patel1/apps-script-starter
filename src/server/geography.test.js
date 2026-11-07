import { answersMatch } from './grading.js';
import { generateGeography, normalizeGeoAnswer } from './geography.js';
import {
  INDIA_STATES_AND_CAPITALS,
  US_STATES_AND_CAPITALS,
} from './geography-data.js';

describe('normalizeGeoAnswer', () => {
  it('normalizes casing, punctuation, and St.', () => {
    expect(normalizeGeoAnswer('  Washington, D.C. ')).toBe('washington dc');
    expect(normalizeGeoAnswer('St. Paul')).toBe('saint paul');
  });
});

describe('generateGeography', () => {
  it('defaults to US capitals', () => {
    const q = generateGeography({ grade: 3, difficulty: 'easy' });
    expect(q.type).toBe('us_capital');
    expect(q.prompt).toBeTruthy();
    expect(q.answer).toBeTruthy();
    expect(answersMatch(q.answer, q.answer, { kind: 'geo' })).toBe(true);
  });

  it('generates abbreviations', () => {
    const q = generateGeography({ grade: 4, type: 'us_abbrev', difficulty: 'medium' });
    expect(q.type).toBe('us_abbrev');
    expect(String(q.answer).length).toBe(2);
  });

  it('generates continents and accepts list answers on reverse', () => {
    let listQ = null;
    for (let i = 0; i < 40; i += 1) {
      const q = generateGeography({ grade: 5, type: 'continent', difficulty: 'hard' });
      if (q.answerKind === 'geo_list') {
        listQ = q;
        break;
      }
    }
    expect(listQ).toBeTruthy();
    expect(answersMatch(listQ.accepted[0], listQ.answer, { kind: 'geo_list', accepted: listQ.accepted })).toBe(
      true,
    );
  });

  it('generates world and India capitals', () => {
    const world = generateGeography({ grade: 4, type: 'world_capital', difficulty: 'easy' });
    expect(world.type).toBe('world_capital');
    expect(world.answer).toBeTruthy();

    const india = generateGeography({ grade: 4, type: 'india_capital', difficulty: 'easy' });
    expect(india.type).toBe('india_capital');
    expect(india.answer).toBeTruthy();
  });

  it('has unique India state/UT names', () => {
    const names = INDIA_STATES_AND_CAPITALS.map((row) => row.state);
    expect(new Set(names).size).toBe(names.length);
  });

  it('covers 50 US states', () => {
    expect(US_STATES_AND_CAPITALS).toHaveLength(50);
  });
});
