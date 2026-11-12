import { cn } from '@/lib/utils';

/** Brand mark matching the home-screen app icon (notebook + orange plus). */
export function PlaygroundMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-11 w-11 shrink-0', className)} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="hsl(162 45% 28%)" />
      <rect x="14" y="16" width="28" height="34" rx="4" fill="hsl(48 40% 96%)" />
      <rect x="14" y="16" width="5" height="34" rx="2" fill="hsl(28 80% 55%)" />
      <path
        d="M24 26h12M24 32h10M24 38h11"
        stroke="hsl(160 25% 28%)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="44" cy="22" r="11" fill="hsl(28 90% 55%)" />
      <path
        d="M44 16.5v11M38.5 22h11"
        stroke="hsl(48 40% 98%)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlaygroundLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <PlaygroundMark />
      <div className="min-w-0">
        <p className="text-shine-sidebar truncate font-display text-lg font-semibold leading-none tracking-tight">
          Playground
        </p>
      </div>
    </div>
  );
}
