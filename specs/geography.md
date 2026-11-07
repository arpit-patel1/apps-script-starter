# Geography quizzes

Static place-name drills for grades 3–5. No Sheet content and no external APIs.

## Mode

- Client route: `geography/quiz`
- API mode: `geography`
- Types (type pills):

| id | Label |
| --- | --- |
| `us_capital` | US capitals |
| `us_abbrev` | US abbreviations |
| `continent` | Continents |
| `world_capital` | World capitals |
| `india_capital` | India capitals |

## Difficulty / grade pools

`easy` / grade ≤ 3 uses the first ~20 rows of each list; `medium` / grade 4 ~35; `hard` / grade 5 the full list. On hard, ~55% of capital/abbrev/continent prompts are reversed (capital → place, or continent → name a country).

## Answer checking

- `answerKind: geo` — forgiving place-name normalize (case, periods, commas, `St.` → `saint`).
- `answerKind: geo_list` — any accepted alias or shared-capital state/country (e.g. Chandigarh; continent reverse).

## Data

Bundled in `src/server/geography-data.js` (US 50, continents sample, world capitals sample, India states + UTs).
