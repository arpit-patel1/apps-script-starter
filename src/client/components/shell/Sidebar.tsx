import { ChevronDown, PanelLeftClose } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PlaygroundLogo } from '@/components/shell/PlaygroundLogo';
import { NAV } from '@/lib/nav';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  route: string;
  openGroups: Record<string, boolean>;
  onToggleGroup: (id: string) => void;
  onClose: () => void;
  onNavigate: () => void;
}

export function Sidebar({
  open,
  route,
  openGroups,
  onToggleGroup,
  onClose,
  onNavigate,
}: SidebarProps) {
  return (
    <aside
      id="sidebar"
      aria-hidden={!open}
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 md:static md:translate-x-0',
        open ? '' : '-translate-x-full md:hidden pointer-events-none',
      )}
    >
      {/* Taller brand block; no bottom border so it does not line up with main header */}
      <div className="flex items-start gap-2 px-4 pb-5 pt-5">
        <PlaygroundLogo className="min-w-0 flex-1" />
        <button
          type="button"
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          onClick={onClose}
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-4 mb-2 h-px bg-sidebar-border/70" aria-hidden="true" />

      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2" aria-label="Activities">
        {NAV.map((item) => {
          if (item.type === 'link') {
            const active = route === item.route;
            return (
              <Link
                key={item.id}
                to={`/${item.route}`}
                onClick={onNavigate}
                className={cn(
                  'nav-link mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition hover:bg-sidebar-accent/70',
                  active && 'active',
                )}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-accent/90 text-[10px] font-bold text-accent-foreground">
                  H
                </span>
                {item.label}
              </Link>
            );
          }

          const groupOpen = !!openGroups[item.id];
          return (
            <div key={item.id} className="mb-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-sidebar-accent/60"
                onClick={() => onToggleGroup(item.id)}
              >
                <span>{item.label}</span>
                <ChevronDown className={cn('h-4 w-4 transition', groupOpen && 'rotate-180')} />
              </button>
              {groupOpen && (
                <div className="ml-2 space-y-1 border-l border-sidebar-border pl-2">
                  {item.children.map((child) => {
                    const active = route === child.route;
                    return (
                      <Link
                        key={child.id}
                        to={`/${child.route}`}
                        onClick={onNavigate}
                        className={cn(
                          'nav-sublink flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-sidebar-accent/50',
                          active ? 'active' : 'text-sidebar-foreground/80',
                        )}
                      >
                        <span>{child.label}</span>
                        {!child.ready && (
                          <span className="rounded-sm bg-sidebar-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-sidebar-foreground/60">
                            Soon
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
