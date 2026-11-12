# Math operations — Phase 4 (number sense / structure)

Generated drills for grades 3–5.

## Activities

| Mode | Route | Types |
| --- | --- | --- |
| Fractions | `math/fractions` | `add`, `subtract`, `multiply`, `compare` |
| Order of operations | `math/order-of-operations` | PEMDAS expressions |
| Input/output | `math/input-output` | `fill`, `find_rule` |

## Answer checking notes

- **Fractions:** accept `a/b`, mixed `1 1/2`, and whole numbers; compared in simplest form.
- **Compare:** `<` `>` `=`.
- **Order of operations:** integer result; ×÷ before +−; parentheses first.
- **Input/output fill:** comma-separated missing values in table order.
- **Find the rule:** exact label like `+ 5`, `− 3`, or `× 4`.

## Implementation

- Generators: `src/server/phase4.js`
- Wired via `problems.js` → `api.js` → React `PracticeShell` in `src/client/`
