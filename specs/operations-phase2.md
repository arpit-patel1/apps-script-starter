# Math operations — Phase 2

Generated drills for grades 3–5, ported from `network-element-ai` (`lib/math/`).

## Activities

| Mode | Route | Types |
| --- | --- | --- |
| Rounding | `math/rounding` | `forward`, `reverse` |
| Factors & multiples | `math/factors` | `pairs`, `multiples`, `list_multiples`, `prime_composite` |
| Missing symbol | `math/missing-symbol` | (mixed op / compare) |
| Estimate | `math/estimate` | round then add/sub/(× for grade 4–5) |
| Times as many | `math/times-as-many` | `equation`, `word`, `write_equation` |

## Answer checking notes

- **Rounding reverse:** any integer in the rounding catchment range is correct.
- **Factor pairs:** order-insensitive; `×` / `*` / `x` accepted; pairs may be listed in any order.
- **List multiples:** comma- or space-separated numbers.
- **Yes/no:** `y`/`yes`, `n`/`no`.
- **Missing symbol:** `+ − × ÷ = < >` with ASCII aliases `-` `*` `x` `/`.
- **Estimate:** preferred rounded estimate; for ×, alternate roundings in `accepted` may also pass.
- **Write equation:** normalized forms like `24=3x8` (order of factors flexible).

## Implementation

- Generators: `src/server/phase2.js`
- Wired via `problems.js` → `api.js` → React `PracticeShell` in `src/client/`
