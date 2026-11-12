import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { THEME_LABELS, useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Color theme: ${THEME_LABELS[theme]}. Click to change.`}
      title={`Theme: ${THEME_LABELS[theme]}`}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
}
