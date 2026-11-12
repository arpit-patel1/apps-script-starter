import { cn } from '@/lib/utils';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

interface MultipleChoiceOptionsProps {
  choices: string[];
  disabled?: boolean;
  selected?: string | null;
  correctAnswer?: string | null;
  answered?: boolean;
  onSelect: (choice: string) => void;
}

function sameAnswer(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function MultipleChoiceOptions({
  choices,
  disabled,
  selected,
  correctAnswer,
  answered,
  onSelect,
}: MultipleChoiceOptionsProps) {
  return (
    <div className="grid gap-2" role="listbox" aria-label="Answer choices">
      {choices.map((choice, index) => {
        const letter = LETTERS[index] || String(index + 1);
        const isSelected = !!selected && sameAnswer(selected, choice);
        const isCorrectChoice = !!correctAnswer && sameAnswer(correctAnswer, choice);
        const showCorrect = !!answered && isCorrectChoice;
        const showWrong = !!answered && isSelected && !isCorrectChoice;

        return (
          <button
            key={`${letter}-${choice}`}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={disabled || answered}
            onClick={() => onSelect(choice)}
            className={cn(
              'flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-100',
              !answered && 'border-border bg-background hover:bg-muted/60',
              showCorrect && 'border-success/50 bg-success/15 text-success',
              showWrong && 'border-destructive/50 bg-destructive/15 text-destructive',
              answered && !showCorrect && !showWrong && 'border-border bg-muted/30 text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold',
                showCorrect && 'border-success/40 bg-success/20',
                showWrong && 'border-destructive/40 bg-destructive/20',
                !answered && 'border-border bg-secondary text-secondary-foreground',
                answered && !showCorrect && !showWrong && 'border-border bg-muted',
              )}
            >
              {letter}
            </span>
            <span className="min-w-0 flex-1 leading-snug">{choice}</span>
          </button>
        );
      })}
    </div>
  );
}
