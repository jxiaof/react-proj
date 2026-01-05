import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore, type ThemeMode } from '@/store/themeStore';
import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './Dropdown';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const themeOptions: Array<{ value: ThemeMode; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: '浅色', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: '深色', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: '系统', icon: <Monitor className="h-4 w-4" /> },
  ];

  const currentTheme = themeOptions.find(t => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="切换主题">
          {theme === 'light' && <Sun className="h-5 w-5" />}
          {theme === 'dark' && <Moon className="h-5 w-5" />}
          {theme === 'system' && <Monitor className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={theme === option.value ? 'bg-primary/10' : ''}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
