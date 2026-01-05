import { useEffect } from 'react';
import { useThemeStore, COLOR_SCHEMES } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, colorScheme } = useThemeStore();
  
  useEffect(() => {
    // 确定实际主题
    const isDark = theme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : theme === 'dark';

    // 应用到文档
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 应用配色方案（支持亮色和暗色）
    const scheme = COLOR_SCHEMES[colorScheme];
    
    const styles = isDark 
      ? [
          `--primary: ${scheme.darkPrimary}`,
          `--primary-foreground: 0 0% 100%`,
          `--secondary: ${scheme.darkSecondary}`,
          `--secondary-foreground: 0 0% 100%`,
          `--muted: ${scheme.darkMuted}`,
          `--muted-foreground: ${scheme.darkMutedForeground}`,
          `--accent: ${scheme.darkPrimary}`,
          `--accent-foreground: 0 0% 100%`,
          `--background: 0 0% 8%`,
          `--foreground: 0 0% 98%`,
          `--card: 0 0% 12%`,
          `--card-foreground: 0 0% 98%`,
          `--border: 0 0% 20%`,
          `--input: 0 0% 20%`,
          `--ring: ${scheme.darkPrimary}`,
        ]
      : [
          `--primary: ${scheme.primary}`,
          `--primary-foreground: ${scheme.primaryForeground}`,
          `--secondary: ${scheme.secondary}`,
          `--secondary-foreground: ${scheme.secondaryForeground}`,
          `--muted: ${scheme.muted}`,
          `--muted-foreground: ${scheme.mutedForeground}`,
          `--accent: ${scheme.accent}`,
          `--accent-foreground: ${scheme.accentForeground}`,
          `--background: 0 0% 100%`,
          `--foreground: 0 0% 10%`,
          `--card: 0 0% 100%`,
          `--card-foreground: 0 0% 10%`,
          `--border: 0 0% 90%`,
          `--input: 0 0% 96%`,
          `--ring: ${scheme.primary}`,
        ];
    
    styles.forEach(style => {
      const [key, value] = style.split(': ');
      root.style.setProperty(key, value);
    });

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        // 重新触发 useEffect
        const root = document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, colorScheme]);

  return <>{children}</>;
}
