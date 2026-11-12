import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Match math values kids should notice: money, comma-grouped ints,
 * decimals, fractions/mixed numbers, clock times, and plain digits.
 */
const NUMBER_PATTERN =
  /\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?|\$\d+(?:\.\d+)?|\d+¢|\d+\s+\d+\/\d+|\d+\/\d+|\d{1,2}:\d{2}|\d+(?:\.\d+)?/g;

function splitPrompt(prompt: string): Array<{ text: string; highlight: boolean }> {
  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;
  const re = new RegExp(NUMBER_PATTERN.source, 'g');
  let match: RegExpExecArray | null;
  while ((match = re.exec(prompt)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: prompt.slice(lastIndex, match.index), highlight: false });
    }
    parts.push({ text: match[0], highlight: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < prompt.length) {
    parts.push({ text: prompt.slice(lastIndex), highlight: false });
  }
  return parts.length ? parts : [{ text: prompt, highlight: false }];
}

export function HighlightedPrompt({
  prompt,
  className,
}: {
  prompt: string;
  className?: string;
}) {
  const parts = useMemo(() => splitPrompt(prompt), [prompt]);

  return (
    <p
      className={cn(
        'animate-pop-in font-display whitespace-pre-line text-2xl font-semibold leading-snug sm:text-3xl',
        className,
      )}
    >
      {parts.map((part, index) =>
        part.highlight ? (
          <span key={index} className="text-shine-accent">
            {part.text}
          </span>
        ) : (
          <span key={index} className="text-shine">
            {part.text}
          </span>
        ),
      )}
    </p>
  );
}
