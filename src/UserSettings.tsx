import { useEffect, useState } from 'react';
import cn from 'classnames';

export const UserSettings = () => {
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <>
      <section className="mb-3">
        <h3 className="pb-2 pt-4">Narrator</h3>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.currentTarget.value)}
          className={cn([
            'w-full',
            'rounded-md',
            'p-1',
            'bg-white',
            'border',
            'border-blue-1',
            'capitalize'
          ])}
        >
          {voices.map((v) => (
            <option value={v} key={v}>
              {v}
            </option>
          ))}
        </select>
      </section>

      <section className="mb-3">
        <h3 className="pb-2 pt-4">Theme</h3>
        <select
          value={theme}
          onChange={(e) => setTheme(e.currentTarget.value as Theme)}
          className={cn([
            'w-full',
            'rounded-md',
            'p-1',
            'bg-white',
            'border',
            'border-blue-1',
            'capitalize'
          ])}
        >
          {themes.map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
      </section>
    </>
  );
};

type Theme = 'light' | 'dark';
const themes: Theme[] = ['light', 'dark'];

const voices = ['Voice One', 'Voice Two', 'Voice Three'];
