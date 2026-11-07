# Math operations — Phase 3 (money / real-world)

Generated drills for grades 3–5, ported from `network-element-ai` money / measurement / time activities.

## Activities

| Mode | Route | Types |
| --- | --- | --- |
| Money — coins & bills | `math/money-count` | `count`, `make` |
| Money — change | `math/money-change` | (making change stories) |
| Money — compare | `math/money-compare` | `<` `>` `=` on two piles |
| Measurement | `math/measurement` | `length`, `volume`, `weight` |
| Time | `math/time` | `read`, `elapsed`, `convert` |

## Answer checking notes

- **Money amounts:** stored as cents; accept `$1.25`, `1.25`, or `125¢`.
- **Make an amount:** fewest-coin **count** (integer), not a coin list.
- **Compare:** symbols with ASCII aliases.
- **Time:** digital `h:mm` (leading zero on minutes); convert may also accept a minute total.
- **Measurement:** one-step customary/metric conversions with integer answers.

## Implementation

- Generators: `src/server/phase3.js`
- Wired via `problems.js` → `api.js` → practice shell in `src/html/index.html`
