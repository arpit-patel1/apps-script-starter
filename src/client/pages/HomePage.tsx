import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { gas } from '@/lib/gas';
import { HOME_JUMP_CARDS } from '@/lib/nav';
import type { HomeContent } from '@/types/api';

function HomeVisualPanel() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-secondary via-card to-muted p-6 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-8 h-28 w-28 rounded-full bg-accent/25 blur-xl" />
      <svg className="relative mx-auto h-44 w-full max-w-sm" viewBox="0 0 360 180" fill="none" aria-hidden="true">
        <rect x="24" y="36" width="120" height="108" rx="14" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        <path d="M40 62h88M40 82h72M40 102h80M40 122h56" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" />
        <circle cx="236" cy="70" r="42" fill="hsl(var(--accent) / 0.22)" stroke="hsl(var(--accent))" strokeWidth="2" />
        <path d="M236 48v44M214 70h44" stroke="hsl(var(--accent))" strokeWidth="5" strokeLinecap="round" />
        <rect x="210" y="118" width="110" height="34" rx="10" fill="hsl(var(--primary))" />
        <path d="M228 135h74" stroke="hsl(var(--primary-foreground))" strokeWidth="5" strokeLinecap="round" />
        <circle cx="300" cy="42" r="8" fill="hsl(var(--primary))" />
        <circle cx="318" cy="58" r="5" fill="hsl(var(--accent))" />
      </svg>
      <p className="relative mt-2 text-center text-sm font-medium text-muted-foreground">
        Notebook ready. Brain curious. Let's practice.
      </p>
    </div>
  );
}

export function HomePage() {
  const { withToken, handleAuthFailure } = useAuth();
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await gas.getHomeContent(withToken());
        if (!cancelled) setContent(next);
      } catch (error) {
        if (handleAuthFailure(error)) return;
        if (!cancelled) {
          setContent({
            featured: {
              quote: 'Small steps every day still take you somewhere new.',
              author: 'Kids Playground',
            },
            quotes: [],
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [withToken, handleAuthFailure]);

  if (!content) {
    return (
      <div className="animate-fade-up mx-auto max-w-5xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="skeleton mb-4 h-4 w-28 rounded-md" />
            <div className="skeleton h-10 w-11/12 rounded-md" />
            <div className="skeleton mt-3 h-10 w-4/5 rounded-md" />
            <div className="skeleton mt-6 h-4 w-40 rounded-md" />
          </section>
          <HomeVisualPanel />
        </div>
      </div>
    );
  }

  const featured = content.featured;
  const quoteCards = (content.quotes || []).slice(featured ? 1 : 0);

  return (
    <div className="animate-fade-up mx-auto max-w-5xl space-y-8">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.35fr_1fr]">
        <section className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Today's spark
          </p>
          <blockquote className="relative mt-4">
            <p className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              “{featured?.quote || 'Small steps every day still take you somewhere new.'}”
            </p>
            <footer className="mt-5 text-sm font-medium text-muted-foreground">
              — {featured?.author || 'Kids Playground'}
            </footer>
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/math/addition"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
            >
              Start Addition
            </Link>
            <Link
              to="/math/multiplication"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-5 text-sm font-semibold shadow-sm transition hover:bg-muted"
            >
              Multiplication
            </Link>
          </div>
        </section>
        <HomeVisualPanel />
      </div>

      {quoteCards.length > 0 && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight">More quotes</h2>
            <p className="text-sm text-muted-foreground">From your Quotes sheet</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quoteCards.map((item, index) => (
              <article
                key={`${item.quote}-${index}`}
                className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-display text-lg font-semibold leading-snug tracking-tight">
                  “{item.quote}”
                </p>
                <p className="mt-3 text-sm text-muted-foreground">— {item.author || 'Unknown'}</p>
                {item.theme ? (
                  <span className="mt-4 inline-flex rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.theme}
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight">Jump into practice</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_JUMP_CARDS.map((card) => (
            <Link
              key={card.route}
              to={`/${card.route}`}
              className="rounded-lg border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {card.subject}
                </p>
                <Badge variant={card.ready ? 'success' : 'muted'}>
                  {card.ready ? 'Ready' : 'Soon'}
                </Badge>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
