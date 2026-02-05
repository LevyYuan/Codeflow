import { useStore } from '@nanostores/react';
import { memo, useEffect, useState } from 'react';
import { themeStore, toggleTheme } from '~/lib/stores/theme';

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch = memo(({ className }: ThemeSwitchProps) => {
  const theme = useStore(themeStore);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    domLoaded && (
      <button
        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive/50 transition-colors ${className || ''}`}
        title="Toggle Theme"
        onClick={toggleTheme}
      >
        <div className={`${theme === 'dark' ? 'i-ph:sun' : 'i-ph:moon'} text-base`}></div>
      </button>
    )
  );
});
