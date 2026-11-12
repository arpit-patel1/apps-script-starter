import { useCallback, useEffect, useMemo, useRef, useState, type InputHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { LongDivision, StandardAlgorithm } from '@/components/practice/AlgorithmVisuals';
import { OptionPills } from '@/components/practice/OptionPills';
import { useAuth } from '@/hooks/useAuth';
import { gas } from '@/lib/gas';
import { answerHints, difficultyLabel, typeLabel } from '@/lib/practice';
import type { PracticeModeConfig } from '@/lib/nav';
import type { DifficultyId, MetaResponse, Problem, TypeOption } from '@/types/api';
import { cn } from '@/lib/utils';

function typesForMode(meta: MetaResponse | null, config: PracticeModeConfig): TypeOption[] {
  if (!meta || !config.typesKey) return [];
  const list = meta[config.typesKey];
  return Array.isArray(list) ? (list as TypeOption[]) : [];
}

export function PracticeShell({ config }: { config: PracticeModeConfig }) {
  const { meta, setMeta, withToken, handleAuthFailure } = useAuth();
  const [optionsOpen, setOptionsOpen] = useState(() => {
    try {
      return localStorage.getItem('kp-options-open') !== '0';
    } catch {
      return true;
    }
  });
  const [grade, setGrade] = useState(3);
  const [difficulty, setDifficulty] = useState<DifficultyId>('medium');
  const [type, setType] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'destructive' | 'default';
    text: string;
  } | null>(null);
  const answerRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const typeOptions = useMemo(() => typesForMode(meta, config), [meta, config]);
  const showReveal = !!config.revealOnly || !!config.showReveal;
  const revealOnly = !!config.revealOnly;

  const hints = answerHints(config.mode, type) || {
    label: config.answerLabel || 'Your answer',
    placeholder: config.answerPlaceholder || 'Type your answer',
    inputMode: config.inputMode || 'decimal',
  };

  const selectedTypeName = useMemo(() => {
    if (!type) return '';
    const found = typeOptions.find((t) => String(t.id) === String(type));
    return found?.label || typeLabel(config.mode, type);
  }, [type, typeOptions, config.mode]);

  const optionsSummary = ['Grade ' + grade, difficultyLabel(difficulty)]
    .concat(selectedTypeName ? [selectedTypeName] : [])
    .join(' · ');

  useEffect(() => {
    try {
      localStorage.setItem('kp-options-open', optionsOpen ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [optionsOpen]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (meta) {
        const grades = meta.grades?.length ? meta.grades : [3, 4, 5];
        setGrade(Number(grades[0]));
        setDifficulty('medium');
        const opts = typesForMode(meta, config);
        setType(config.showType && opts.length ? opts[0].id : null);
        return;
      }
      setStatus('Starting…');
      try {
        const next = await gas.getMeta(withToken());
        if (cancelled) return;
        setMeta(next);
      } catch (error) {
        if (handleAuthFailure(error)) return;
        setStatus(error instanceof Error ? error.message : String(error));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [config, meta, setMeta, withToken, handleAuthFailure]);

  const loadProblem = useCallback(async () => {
    setBusy(true);
    setStatus('Loading problem…');
    setFeedback(null);
    setAnswered(false);
    setAnswer('');
    try {
      const next = await gas.getNextProblem(
        withToken({
          mode: config.mode,
          grade: Number(grade),
          difficulty,
          type: config.showType ? type : null,
          excludeId: problem?.id || null,
        }),
      );
      setProblem(next);
      setStatus('');
      setTimeout(() => {
        if (revealOnly) nextRef.current?.blur();
        else answerRef.current?.focus();
      }, 0);
    } catch (error) {
      if (handleAuthFailure(error)) return;
      setProblem(null);
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }, [
    config.mode,
    config.showType,
    grade,
    difficulty,
    type,
    problem?.id,
    withToken,
    handleAuthFailure,
    revealOnly,
  ]);

  useEffect(() => {
    if (!meta) return;
    void loadProblem();
    // Reload when filters change; intentionally omit problem.id / loadProblem identity churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, grade, difficulty, type, config.mode]);

  async function checkAnswer() {
    if (!problem || answered) return;
    if (!answer.trim()) {
      setStatus('Enter an answer first.');
      answerRef.current?.focus();
      return;
    }
    setBusy(true);
    setStatus('Checking…');
    try {
      const result = await gas.checkAnswer(
        withToken({
          mode: problem.mode,
          id: problem.id,
          grade: problem.grade,
          userAnswer: answer,
          answerKind: problem.answerKind || null,
        }),
      );
      setStatus('');
      if (result.correct) {
        setFeedback({
          variant: 'success',
          text: 'Correct — nice work. Ready for the next one?',
        });
      } else {
        setFeedback({
          variant: 'destructive',
          text: `Not quite. The correct answer is ${result.correctAnswer}.`,
        });
      }
      setAnswered(true);
      setTimeout(() => nextRef.current?.focus(), 0);
    } catch (error) {
      if (handleAuthFailure(error)) return;
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  async function revealAnswer() {
    if (!problem || answered) return;
    setBusy(true);
    setStatus('Revealing…');
    try {
      const result = await gas.revealAnswer(
        withToken({
          mode: problem.mode,
          id: problem.id,
          answerKind: problem.answerKind || null,
        }),
      );
      setStatus('');
      setFeedback({ variant: 'default', text: `Answer: ${result.correctAnswer}` });
      setAnswered(true);
      setTimeout(() => nextRef.current?.focus(), 0);
    } catch (error) {
      if (handleAuthFailure(error)) return;
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  const grades = meta?.grades?.length ? meta.grades : [3, 4, 5];
  const difficulties = meta?.difficulties?.length
    ? meta.difficulties
    : [
        { id: 'easy' as const, label: 'E', full: 'Easy' },
        { id: 'medium' as const, label: 'M', full: 'Medium' },
        { id: 'hard' as const, label: 'H', full: 'Hard' },
      ];

  const metaLine = problem
    ? `Grade ${problem.grade} · ${difficultyLabel(problem.difficulty || difficulty)}${
        problem.type ? ` · ${typeLabel(config.mode, problem.type)}` : ''
      }`
    : 'Loading…';

  return (
    <div className="animate-fade-up mx-auto max-w-3xl space-y-4">
      <Collapsible open={optionsOpen} onOpenChange={setOptionsOpen}>
        <Card className="bg-card/70">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Options
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-foreground">{optionsSummary}</p>
              </div>
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input bg-background text-muted-foreground shadow-sm"
                aria-hidden="true"
              >
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', !optionsOpen && '-rotate-90')}
                />
              </span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Separator />
            <CardContent className="space-y-4 px-4 pb-4 pt-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Grade
                  </Label>
                  <OptionPills
                    aria-label="Grade"
                    items={grades}
                    selectedValue={grade}
                    disabled={busy}
                    getValue={(g) => g}
                    getLabel={(g) => String(g)}
                    getTitle={(g) => `Grade ${g}`}
                    onSelect={(value) => setGrade(Number(value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Difficulty
                  </Label>
                  <OptionPills
                    aria-label="Difficulty"
                    items={difficulties}
                    selectedValue={difficulty}
                    disabled={busy}
                    getValue={(d) => d.id}
                    getLabel={(d) => d.label}
                    getTitle={(d) => d.full || d.label}
                    onSelect={(value) => setDifficulty(String(value) as DifficultyId)}
                  />
                </div>
              </div>
              {config.showType && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {config.typeLabel || 'Problem type'}
                  </Label>
                  <OptionPills
                    aria-label={config.typeLabel || 'Problem type'}
                    items={typeOptions}
                    selectedValue={type}
                    disabled={busy}
                    getValue={(t) => t.id}
                    getLabel={(t) => t.label}
                    onSelect={(value) => setType(String(value))}
                  />
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 border-b border-border px-5 py-4">
          <div className="space-y-1">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em]">
              Your problem
            </CardDescription>
            <CardTitle className="font-sans text-sm font-medium text-muted-foreground">
              {metaLine}
            </CardTitle>
          </div>
          <Badge variant="secondary">{config.badge}</Badge>
        </CardHeader>

        <CardContent className="space-y-5 px-5 py-6">
          <div>
            {!problem && busy ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-8 w-3/5" />
              </div>
            ) : problem?.display === 'long_division' && problem.layout ? (
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-5">
                <LongDivision layout={problem.layout} />
              </div>
            ) : problem?.display === 'standard_algorithm' && problem.layout ? (
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-5">
                <StandardAlgorithm layout={problem.layout} />
              </div>
            ) : (
              <p className="animate-pop-in font-display whitespace-pre-line text-2xl font-semibold leading-snug sm:text-3xl">
                {problem?.prompt || 'Could not load a problem.'}
              </p>
            )}
          </div>

          {problem?.hint ? (
            <Alert variant="default" className="border-dashed">
              {problem.hint}
            </Alert>
          ) : null}

          {!revealOnly && (
            <div className="space-y-2">
              <Label htmlFor="answer">{hints.label}</Label>
              <Input
                id="answer"
                ref={answerRef}
                value={answer}
                disabled={busy || answered}
                readOnly={answered}
                inputMode={hints.inputMode as InputHTMLAttributes<HTMLInputElement>['inputMode']}
                placeholder={hints.placeholder}
                autoComplete="off"
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (answered) void loadProblem();
                    else void checkAnswer();
                  }
                }}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-3 px-5 pb-6">
          <div className="flex flex-wrap justify-center gap-3">
            {!revealOnly && !answered && (
              <Button className="min-w-[10rem]" disabled={busy} onClick={() => void checkAnswer()}>
                Check answer
              </Button>
            )}
            {showReveal && !answered && (
              <Button
                className="min-w-[10rem]"
                variant={revealOnly ? 'default' : 'outline'}
                disabled={busy}
                onClick={() => void revealAnswer()}
              >
                Reveal answer
              </Button>
            )}
            {answered && (
              <Button
                ref={nextRef}
                className="min-w-[10rem]"
                disabled={busy}
                onClick={() => void loadProblem()}
              >
                Next problem
              </Button>
            )}
          </div>

          {feedback && <Alert variant={feedback.variant}>{feedback.text}</Alert>}
          <p className="min-h-5 text-center text-sm text-muted-foreground">{status}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
