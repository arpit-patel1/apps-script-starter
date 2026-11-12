import type { ProblemLayout } from '@/types/api';

export function StandardAlgorithm({ layout }: { layout: ProblemLayout }) {
  const top = String(layout.top != null ? layout.top : layout.multiplicand ?? '');
  const bottom = String(layout.bottom != null ? layout.bottom : layout.multiplier ?? '');
  const op = layout.operator || '×';
  return (
    <div className="algorithm-board animate-pop-in" aria-label={`${top} ${op} ${bottom}`}>
      <div className="alg-row">
        <span className="alg-op" />
        <span className="alg-num">{top}</span>
      </div>
      <div className="alg-row">
        <span className="alg-op">{op}</span>
        <span className="alg-num">{bottom}</span>
      </div>
      <div className="alg-rule" />
    </div>
  );
}

export function LongDivision({ layout }: { layout: ProblemLayout }) {
  const dividend = String(layout.dividend != null ? layout.dividend : layout.top ?? '');
  const divisor = String(layout.divisor != null ? layout.divisor : layout.bottom ?? '');
  return (
    <div className="long-division-board animate-pop-in" aria-label={`${dividend} divided by ${divisor}`}>
      <div className="ld-row">
        <span className="ld-divisor">{divisor}</span>
        <span className="ld-box">{dividend}</span>
      </div>
    </div>
  );
}
