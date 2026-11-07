# Modal-backed activities

Auth-gated drills that call the Modal FastAPI kids API. Credentials stay in Script Properties; the client never sees them.

## Script properties

| Key | Required | Purpose |
| --- | --- | --- |
| `MODAL_BASE_URL` | yes | Base URL of the Modal FastAPI app (no trailing slash) |
| `MODAL_API_KEY` | yes | Sent as `X-API-Key` |

Set in Apps Script: **Project Settings → Script properties**. Redeploy after first adding the external-request OAuth scope.

## Activities

| Mode | Route | Modal endpoint | Notes |
| --- | --- | --- | --- |
| `pattern` | `math/patterns` | `/math/pattern` | Types: number, shape, color; uses difficulty as `level` |
| `riddle` | `ela/riddles` | `/riddles` | Reveal-only UI (no answer field / Check); server `revealAnswer` |
| `fill_blank` | `ela/fill-blank` | `/sentence/fill-blank` | Difficulty query param |
| `science_quiz` | `science/quiz` | `/science/quiz/keys` + `/science/quiz/random` | Topic pills from keys (cached ~1h) |

All of these go through `requireUser(token)` like other practice APIs.

## Code

- [`src/server/modal.js`](../src/server/modal.js) — UrlFetch client + science keys cache
- [`src/server/modal-activities.js`](../src/server/modal-activities.js) — normalize Modal JSON into playground problems

Not wired (already covered locally or n8n-only): fractions, money, time, measurement, geography capitals, Modal `/math/geometry` text problems.
