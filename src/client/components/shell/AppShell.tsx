import { useEffect, useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/shell/Sidebar';
import { ThemeToggle } from '@/components/shell/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { findRouteMeta } from '@/lib/nav';
import { cn } from '@/lib/utils';

function isMobileNav() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function routeFromPathname(pathname: string) {
  return pathname.replace(/^\/+/, '') || 'home';
}

export function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const route = routeFromPathname(location.pathname);
  const info = findRouteMeta(route);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const stored = localStorage.getItem('kp-sidebar-open');
      if (stored === '0') return false;
      if (stored === '1') return true;
    } catch {
      /* ignore */
    }
    return !isMobileNav();
  });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    math: true,
    ela: false,
    science: false,
    geometry: false,
    geography: false,
  });

  useEffect(() => {
    if (info.subject) {
      setOpenGroups((prev) => ({ ...prev, [info.subject!]: true }));
    }
  }, [info.subject]);

  useEffect(() => {
    try {
      localStorage.setItem('kp-sidebar-open', sidebarOpen ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const onResize = () => {
      if (!isMobileNav() && sidebarOpen) {
        /* keep */
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen]);

  function closeMobileNav() {
    if (isMobileNav()) setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <div
          className={cn(
            'fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm md:hidden',
            sidebarOpen ? '' : 'hidden',
          )}
          onClick={closeMobileNav}
        />

        <Sidebar
          open={sidebarOpen}
          route={route}
          openGroups={openGroups}
          onToggleGroup={(id) => setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }))}
          onClose={() => setSidebarOpen(false)}
          onNavigate={closeMobileNav}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-muted-foreground">{info.crumb}</p>
              <h1 className="font-display truncate text-xl font-semibold tracking-tight sm:text-2xl">
                {info.title}
              </h1>
            </div>
            {user && (
              <p className="hidden max-w-[8rem] truncate text-sm font-medium text-muted-foreground sm:block">
                {user.displayName}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Sign out"
              title="Sign out"
              onClick={() => void logout()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
