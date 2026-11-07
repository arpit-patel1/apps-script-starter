# Phase 1 operations — Addition, Subtraction, Division

Ported from `network-element-ai` math drills into Apps Script generators. Grades **3–5**.

## Addition

- Vertical standard algorithm: top + bottom
- Kid enters the **sum**
- Grade ranges (medium):
  - 3: 10–999
  - 4: 100–9999
  - 5: 1000–99999

## Subtraction

- Vertical standard algorithm: top − bottom (minuend ≥ subtrahend)
- Kid enters the **difference**
- Grade ranges (medium):
  - 3: 20–999
  - 4: 100–9999
  - 5: 1000–99999

## Division

| Type | Label | Display | Answer |
| --- | --- | --- | --- |
| `facts` | Facts | Vertical ÷ | Quotient only |
| `divide` | Divide | Vertical ÷ | `q` or `q r r` |
| `long_division` | Long division | Bracket long-division layout | `q` or `q r r` |

Remainder answers accept flexible forms: `12 r 3`, `12r3`, `12 R 3`.

## Shared UI

Reuse the practice shell: grade select, optional type select, algorithm board, product/sum/difference/quotient input, Check / Next.
