import cn from 'classnames';
import { SettingsIcon } from './svg/Settings';

interface NavProps {
  showSettings: boolean;
  onSettingsClick: () => void;
}

export const Nav = ({ showSettings, onSettingsClick }: NavProps) => {
  return (
    <nav
      className={cn([
        'flex',
        'justify-between',
        'app-padding',
        'text-neutral-4',
        'bg-primary-1',
        'items-center'
      ])}
    >
      <h1>CoreMixer</h1>

      {showSettings && (
        <button onClick={onSettingsClick}>
          <span className="sr-only">Settings</span>
          <SettingsIcon className="fill-current" />
        </button>
      )}
    </nav>
  );
};
