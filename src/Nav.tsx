import cn from 'classnames';
import { SettingsIcon } from './svg/Settings';

interface NavProps {
  onSettingsClick: () => void;
}

export const Nav = ({ onSettingsClick }: NavProps) => {
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

      <button onClick={onSettingsClick}>
        <span className="sr-only">Settings</span>
        <SettingsIcon className="fill-current" />
      </button>
    </nav>
  );
};
