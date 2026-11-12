import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export function ComingSoonPage({ subject, activity }: { subject: string; activity: string }) {
  return (
    <Card className="animate-fade-up mx-auto max-w-2xl p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Coming soon
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">{activity}</h2>
      <p className="mt-3 text-muted-foreground">
        {subject} activities are on the roadmap. Math Multiplication and Word problems are ready
        now.
      </p>
      <Link
        to="/home"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
      >
        Back to Homepage
      </Link>
    </Card>
  );
}
