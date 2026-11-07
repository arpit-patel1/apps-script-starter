# Kids Homework Playground — agent notes

This repo is the **Kids Homework Playground**: a Google Apps Script web app for grades 3–5 homework practice, built on the [apps-script-starter](https://github.com/labnol/apps-script-starter) toolchain (Vite + clasp).

## Product summary

- **Delivery:** Deployed Apps Script web app (browser URL), not a Sheets sidebar.
- **Shell:** Dark teal side nav + light paper main canvas. Default route is **Homepage**.
- **Live Math activities:** Addition, Subtraction, Multiplication, Division, Place value, Rounding, Factors & multiples, Missing symbol, Estimate, Times as many, Money (count/change/compare), Measurement, Time, Fractions, Order of operations, Input/output (generated), Word problems (Sheet-backed).
- **Live Geography:** Capitals & continents (US capitals/abbreviations, world capitals, India capitals, continents) — static generated quizzes.
- **Planned subjects in nav:** ELA, Geometry (sub-items show Coming soon).
- **Homepage:** Featured + supporting quotes from the `Quotes` sheet, illustrative visuals, quick activity jumps.
- **Upstream catalog:** Many activity ideas come from `network-element-ai` (`app/protected/math-homework/`, `lib/math/`).

## Google resources

| Resource | ID / URL |
| --- | --- |
| Spreadsheet | `1IZu9YHE-xtqNPIsVdFZ2r1J92yjsFBdbHHshLkBhJFw` |
| Bound script | `1iirAuXr-tdKGXhxtdNtp4E9uhoocAb_oXTVp8ObAdgBC2UVq3Na0K1nx` |
| Web app deployment | `AKfycbwpwvR7kEorpjdCRVXNq4wMu1ACk_kVgLu6wVdeJS6z16_d6JHWeZyZ1uhd8B3-RjHH` |
| Web app URL | https://script.google.com/macros/s/AKfycbwpwvR7kEorpjdCRVXNq4wMu1ACk_kVgLu6wVdeJS6z16_d6JHWeZyZ1uhd8B3-RjHH/exec |
| Google Sites | https://sites.google.com/view/k2-playground-1/playground |

Spreadsheet ID is also in `src/server/config.js`. Clasp `scriptId` is in `.clasp.json`.

## Sheet database

Tabs (auto-seeded when missing via `ensureDatabase()`):

| Tab | Purpose |
| --- | --- |
| `WordProblems` | Curated word problems: `id`, `grade`, `type`, `prompt`, `answer`, `answer_unit`, `difficulty`, `active` |
| `Quotes` | Homepage quotes: `id`, `quote`, `author`, `theme`, `active` |
| `Config` | Key/value settings (e.g. `mult_grade_3_min/max`, `home_quote_count`) |

Word problem types: `operations`, `add_then_subtract`, `multiply_and_divide`, `time`, `money`, `measurement`.

Manual full reseed: run `seedDatabase` from the Apps Script editor, or use the Sheet menu **Playground → Seed / repair database** (overwrites those tabs). Missing tabs are created on web app page load via `ensureDatabase()`. New `WORD_PROBLEM_SEED` ids are also **merged** into an existing `WordProblems` tab on load (custom rows are kept).

## Code map

| Path | Role |
| --- | --- |
| `src/html/index.html` | Client UI (sidebar shell, homepage, practice screens) |
| `src/server/api.js` | `getMeta`, `getHomeContent`, `getNextProblem`, `checkAnswer` |
| `src/server/sheets.js` | Spreadsheet reads |
| `src/server/problems.js` / `grading.js` | Problem generation + answer checking |
| `src/server/geography.js` / `geography-data.js` | Geography quiz generation + static lists |
| `src/server/seed.js` / `seed-data.js` | Schema seed content |
| `src/server/webapp.js` | `doGet` HtmlService entry |
| `src/index.js` | Exports for clasp / Vite GAS bridge |

Answers are never sent to the client until after a failed check (or recalled from `CacheService` for multiplication).

## Spec-driven development

Product and design specs live in [`specs/`](specs/). Implement against those specs; update the spec when behavior or design intentionally changes.

| Spec | Path |
| --- | --- |
| UI theme | [`specs/ui-theme.md`](specs/ui-theme.md) |
| Multiplication | [`specs/multiplication.md`](specs/multiplication.md) |
| Ops phase 1 | [`specs/operations-phase1.md`](specs/operations-phase1.md) |
| Place value | [`specs/place-value.md`](specs/place-value.md) |
| Ops phase 2 | [`specs/operations-phase2.md`](specs/operations-phase2.md) |
| Ops phase 3 | [`specs/operations-phase3.md`](specs/operations-phase3.md) |
| Ops phase 4 | [`specs/operations-phase4.md`](specs/operations-phase4.md) |
| Geography | [`specs/geography.md`](specs/geography.md) |

## UI theme (required)

**Follow [`specs/ui-theme.md`](specs/ui-theme.md) for all UI changes.**

Locked choices kids already like:

- Fraunces (display) + Source Sans 3 (UI)
- Teal primary / warm paper background / orange accent
- Dark sidebar, shadcn-style cards/buttons/inputs
- Light motion only (`fade-up`, `pop-in`, skeletons)

Do not replace this palette/typography without an explicit product decision.

## Dev / deploy

```bash
npm install
npm run dev      # watch build
npm test
npm run deploy   # vite build + clasp push
```

After push, create/update a web app deployment (existing deployment id above):

```bash
npx clasp version "message"
npx clasp deploy -i AKfycbwpwvR7kEorpjdCRVXNq4wMu1ACk_kVgLu6wVdeJS6z16_d6JHWeZyZ1uhd8B3-RjHH -d "notes"
```

Requires Apps Script API enabled for the Google account: https://script.google.com/home/usersettings

Web app runs as `USER_DEPLOYING` with `ANYONE_ANONYMOUS` access (`appsscript.json`).

## Conventions for new activities

1. Add a sidebar group/child in `src/html/index.html` `NAV` (mark `ready: true` only when playable).
2. Prefer Sheet-backed content for curated items; generation is OK for drills (like multiplication).
3. Reuse practice shell patterns and theme tokens from `specs/ui-theme.md`.
4. Extend server APIs in `src/server/` and export from `src/index.js`.
5. Keep homepage quote-forward; don’t turn Home into a dense dashboard.
