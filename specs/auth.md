# Authentication (username + password)

Family-gate login for the Kids Homework Playground. Required before the shell and practice APIs. Designed for Google Sites embeds and kids without Google accounts.

## Goals

- Gate the public web app so random visitors cannot practice without credentials
- Keep Google Sites embedding working (no Google OAuth popup in the iframe)
- Let parents manage kid accounts in the spreadsheet
- Leave room later for Modal/n8n secrets and per-kid progress (not in this pass)

## Access model

| Setting | Value |
| --- | --- |
| `webapp.access` | `ANYONE_ANONYMOUS` |
| `webapp.executeAs` | `USER_DEPLOYING` |
| Framing | `HtmlService.XFrameOptionsMode.ALLOWALL` |

Authentication is **application-level**, not Google Sign-In. This is a family gate, not bank-grade security: anyone with the URL can attempt passwords; mitigate with lockouts. The spreadsheet stays private (only the deployer / server reads it).

## Credentials

Kids sign in with:

- **Username** — case-insensitive
- **Password** — 4–64 characters; a short numeric PIN is fine if the kid prefers

Login copy:

- Title area: “Kids Playground”
- Subtitle: “Sign in with your username”
- Fields: **Username**, **Password** (no input placeholders)

## Users sheet

Tab name: `Users` (auto-seeded when missing via `ensureDatabase()`).

| Column | Purpose |
| --- | --- |
| `username` | Login id (unique, stored/compared lowercase) |
| `password` | Secret (plain text in the private Sheet for parent editability) |
| `display_name` | Shown in the header after login |
| `active` | `TRUE` / `FALSE` |

Legacy column name `pin` is still accepted when reading rows.

Seed examples (change for real use): `maya`/`1234`, `leo`/`2345`, `sam`/`3456`.

Parents manage accounts by editing the Sheet, or **Playground → Seed / repair database** for a full reset (overwrites the tab).

## Session

1. `login({ username, password })` validates against `Users`
2. Server stores a random token in `CacheService` (`session:{token}` → `{ username, displayName }`, ~12 hours)
3. Client keeps the token in `sessionStorage` (`kp-auth-token`)
4. Gated APIs require `token` in the request options
5. `logout` clears the cache entry; client clears `sessionStorage`

Sites note: session may not carry between the Sites embed and the raw `/exec` URL (storage partitioning). Kids may need to sign in again in a new context, or after the server TTL.

## Lockout

After **5** failed password attempts for a username, block further tries for ~**5 minutes** (`CacheService`).

## Server API

| Function | Auth |
| --- | --- |
| `login`, `logout`, `getSession` | Public (no token) |
| `getMeta`, `getHomeContent`, `getNextProblem`, `checkAnswer` | Require valid `token` via `requireUser` |

Friendly errors: “Please sign in…”, “Session expired…”, “Incorrect username or password.”, lockout message.

Code: [`src/server/auth.js`](../src/server/auth.js), gated in [`src/server/api.js`](../src/server/api.js), exported from [`src/index.js`](../src/index.js).

## Client UI

- `#login-screen` shown when there is no valid session; `#app-shell` hidden
- On success: show shell, display name in header, proceed to Homepage
- Header: display name + logout icon (next to theme toggle)
- Pass `token` on every gated `google.script.run` call
- Auth failures clear the session and return to login

Theme: reuse ui-theme tokens (card, primary button, inputs). See [`specs/ui-theme.md`](ui-theme.md).

## Out of scope

- Google Sign-In / changing `webapp.access`
- In-app user admin UI
- Modal / n8n key proxying
- Per-kid progress history
