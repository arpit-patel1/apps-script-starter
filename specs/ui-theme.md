# Kids Homework Playground — UI theme spec

Use this spec for all playground UI work in `src/client/`. Keep the current look: warm paper workspace, deep teal primary, Geist type.

## Stack

- **React + TypeScript** SPA under `src/client/`
- **Tailwind CSS** (built, not CDN) with CSS variables mirrored as theme tokens
- **shadcn/ui** primitives in `src/client/components/ui/` (Button, Card, Input, Badge, Label, Alert, …)
- **Hash router** (`react-router-dom` `HashRouter`) for Apps Script HtmlService / Sites embeds

## Brand tone

- Friendly desk / homework-lab feeling — calm, encouraging, not cartoonish
- Light and dark themes via `html.dark` + shared CSS tokens (same teal / warm accent brand)
- Default preference: **system** (`kp-theme` in `localStorage`: `light` | `dark` | `system`)
- Header icon control cycles Light → Dark → Auto (tooltip shows current mode)
- Avoid purple gradients, neon glows, emoji decoration, and generic Inter/Roboto stacks (Geist is the intentional brand face)

## Typography

| Role | Font | Notes |
| --- | --- | --- |
| Display / UI | **Geist** | Headlines, quotes, prompts, nav, controls (Vercel font) |
| Mono | **Geist Mono** | Algorithm / long-division boards |

Tailwind tokens:

- `font-display` → Geist
- `font-sans` → Geist
- `font-mono` → Geist Mono

Homepage featured quote and activity question copy use `.text-shine`. Key numbers in prompts and algorithm boards use `.text-shine-accent`. Primary action labels (Check / Next / primary Reveal) use `.text-shine-on-primary`. Keep shine off dense chrome (nav, inputs, badges).

## Color tokens (HSL)

Defined as CSS variables on `:root` / `.dark` and mirrored in Tailwind. Light values:

| Token | HSL (light) | Use |
| --- | --- | --- |
| `--background` | `48 33% 97%` | Page wash |
| `--foreground` | `160 30% 12%` | Primary text |
| `--card` | `0 0% 100%` | Panels / cards |
| `--primary` | `162 64% 28%` | Teal CTAs, active emphasis |
| `--primary-foreground` | `48 40% 98%` | Text on primary |
| `--secondary` | `44 55% 92%` | Soft warm chip / badge surface |
| `--muted` | `150 18% 93%` | Subtle fills |
| `--muted-foreground` | `160 10% 40%` | Secondary text |
| `--accent` | `28 90% 55%` | Warm orange accent marks |
| `--destructive` | `4 72% 48%` | Incorrect feedback |
| `--success` | `152 55% 32%` | Correct feedback |
| `--border` / `--input` | `150 16% 84%` | Borders |
| `--sidebar` | `160 28% 14%` | Dark teal sidebar |
| `--sidebar-foreground` | `48 30% 96%` | Sidebar text |
| `--sidebar-accent` | `162 40% 22%` | Active nav item |

Dark mode keeps the same teal / orange brand with a deep teal canvas (`--background` ≈ `160 22% 8%`), slightly brighter primary for contrast, and a still-darker sidebar so nav stays distinct. Page atmosphere uses `--page-wash` (light warm/teal radials; dark muted radials).

Radius: `--radius: 0.75rem` (`rounded-lg` cards, `rounded-md` controls). Prefer `rounded-md` / `rounded-lg` over pills.

## Layout patterns

- **Login:** centered card before the shell — Username + Password (no placeholders); subtitle “Sign in with your username”. See [`specs/auth.md`](auth.md).
- **Shell:** fixed/sticky dark sidebar + themed main canvas (paper light / deep teal dark). Sidebar brand is a taller logo block (notebook mark + “Playground” wordmark) with a separator that does **not** share a continuous border with the main header. Main header shows theme toggle + circular avatar (first two letters of display name); clicking the avatar signs out.
- **Homepage:** quote hero (Geist + `.text-shine`) + illustrative visual panel + secondary quote cards + activity jump cards
- **Activity pages:** collapsible Options panel (summary when closed). Grade + Difficulty share one row; type pills sit below when needed. Then a single problem card (prompt → answer → check/next)
- **Coming soon:** simple card with subject context and return-home CTA

## Components (shadcn/ui)

Use real shadcn components from `src/client/components/ui/` with the theme tokens:

- Button primary: `variant="default"` → `bg-primary text-primary-foreground`
- Button outline: `variant="outline"` → `border border-input bg-background hover:bg-muted`
- Card / CardHeader / CardContent / CardFooter: problem + options panels
- Input: `h-12`, `rounded-md`, `border-input`, focus ring via `--ring`
- Badge: compact `rounded-md` label, not full pill chrome
- ToggleGroup / ToggleGroupItem: grade, difficulty, and type selectors (rounded-md, not pills)
- Collapsible + Separator: Options panel
- Skeleton: problem loading placeholders
- Feedback alerts: tinted success / destructive borders and backgrounds

All math activities share `PracticeShell`, so these components apply across every live math drill.

## Motion

Keep motion light and intentional:

- Page enter: `animate-fade-up`
- Problem card refresh: `animate-pop-in`
- Loading: muted skeleton shimmer
- Hover on cards: slight lift (`-translate-y-0.5`) + soft shadow

## Atmosphere

- Soft radial washes (warm secondary + teal) on the page background
- Optional subtle grain / blur orbs inside hero panels
- SVG illustrations for homepage visuals (no stock photo dependency)

## Do / don’t

**Do**

- Use Geist for UI and display; Geist Mono for algorithm boards
- Keep sidebar dark teal in both themes; content area uses theme tokens
- Prefer token colors (`bg-card`, `text-muted-foreground`, `hsl(var(--primary))`) over hard-coded light HSL
- Add new subjects with the same card + nav patterns in `src/client/lib/nav.ts`
- Reserve `.text-shine` for homepage hero quotes; use `.text-shine-accent` for key math numbers only

**Don’t**

- Introduce a second unrelated palette
- Reintroduce Fraunces / Source Sans 3 without an explicit product decision
- Overload the homepage with dense dashboards or stats strips
- Hard-code light-only fills that break in `.dark`
- Use path-based History API routing (HtmlService needs hash routes)
- Apply shine gradients to every headline or practice prompt
