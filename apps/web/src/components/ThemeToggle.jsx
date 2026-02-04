import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTheme, toggleTheme } from '../services/theme';
import { trackEvent } from '../services/analytics';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getTheme() === 'dark');
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setIsDark(newTheme === 'dark');
    
    // Analytics
    trackEvent('theme_toggle', {
      theme: newTheme
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
}
