# Multiplication practice spec

## Goal

Kids practice the **standard algorithm** (vertical form), not horizontal “What is a × b?” prompts.

## Practice types

| Type id | Label | Form |
| --- | --- | --- |
| `1_digit` | 1-digit multiplier | Multiplicand (2–3 digits by grade) × single digit `2–9` |
| `2_digit` | 2-digit multiplier | Two 2-digit factors (grade 5 may use larger top number) |

Kids enter the **final product** only (partial products can be a later enhancement).

## Display

Render right-aligned vertical layout:

```text
    247
  ×   6
  -----
```

Use tabular/monospace numerals, × on the multiplier row, and a rule above the answer blank.

## Generation defaults by grade

**1-digit multiplier**

| Grade | Multiplicand | Multiplier |
| --- | --- | --- |
| 3 | 10–99 | 2–9 |
| 4 | 10–999 | 2–9 |
| 5 | 100–999 | 2–9 |

**2-digit multiplier**

| Grade | Multiplicand | Multiplier |
| --- | --- | --- |
| 3 | 10–50 | 10–20 |
| 4 | 10–99 | 10–50 |
| 5 | 10–99 | 10–99 |

Avoid multiplier `0` and `1` for 1-digit practice so kids get meaningful carrying work.
