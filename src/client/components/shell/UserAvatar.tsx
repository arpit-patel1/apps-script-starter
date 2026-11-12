import { cn } from '@/lib/utils';

export function userInitials(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

interface UserAvatarProps {
  name: string;
  onClick?: () => void;
  className?: string;
  title?: string;
}

export function UserAvatar({ name, onClick, className, title }: UserAvatarProps) {
  const initials = userInitials(name);
  const label = title || `Sign out (${name})`;

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        'btn-shine-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 text-sm font-semibold transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <span className="text-shine-on-primary relative z-[1]">{initials}</span>
    </button>
  );
}
