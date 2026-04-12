import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  const next = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <button
      onClick={next}
      className="p-1.5 rounded-xl hover:bg-secondary transition-colors"
      title={`Theme: ${theme}`}
    >
      <Icon className="w-4 h-4 text-muted-foreground" />
    </button>
  );
};

export default ThemeToggle;
