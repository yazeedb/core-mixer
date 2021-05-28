import cn from 'classnames';
import { useState } from 'react';
import { CoachName, Difficulty, printDifficulty } from '../data';
import { UserPreferences } from '../workoutMachine';

interface ChoosePreferencesProps {
  onSubmit: (preferences: UserPreferences) => void;
}

const difficulties: Difficulty[] = [
  Difficulty.beginner,
  Difficulty.intermediate,
  Difficulty.advanced
];

const coachNames: CoachName[] = ['military'];

export const ChoosePreferences = ({ onSubmit }: ChoosePreferencesProps) => {
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [coachName, setCoachName] = useState(coachNames[0]);

  return (
    <main className="app-padding">
      <div>
        <label className={labelClassNames} htmlFor="difficulties">
          Choose your difficulty:
        </label>
        <select
          className={selectClassNames}
          id="difficulties"
          name="difficulties"
          onChange={(e) => setDifficulty(parseInt(e.currentTarget.value))}
        >
          {difficulties.map((d) => (
            <option className="minw" value={d} key={d}>
              {printDifficulty(d)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClassNames} htmlFor="coachName">
          Choose your coach:
        </label>
        <select
          className={selectClassNames}
          id="coachName"
          name="coachName"
          onChange={(e) => setCoachName(e.currentTarget.value as CoachName)}
        >
          {coachNames.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="btn-primary mt-8"
        onClick={() => onSubmit({ difficulty, coachName })}
      >
        Let's go
      </button>
    </main>
  );
};

const selectClassNames = cn(
  'capitalize border-neutral-1 border mb-4',
  'px-1 py-2 mt-1 rounded-md w-full'
);
const labelClassNames = cn('font-bold', 'mr-2', 'block');

const listBoxClasses = cn(
  'capitalize',
  'relative',
  'w-full',
  'py-2',
  'pl-3',
  'pr-10',
  'text-left',
  'bg-neutral-3',
  'rounded-lg',
  'shadow-md',
  'cursor-default',
  'focus:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-opacity-75',
  'focus-visible:ring-white',
  'focus-visible:ring-offset-orange-300',
  'focus-visible:ring-offset-2',
  'focus-visible:border-indigo-500',
  'sm:text-sm'
);

const optionsClasses = cn(
  'capitalize',
  'absolute',
  'w-full',
  'py-1',
  'mt-1',
  'overflow-auto',
  'text-base',
  'bg-white',
  'rounded-md',
  'shadow-lg',
  'max-h-60',
  'ring-1',
  'ring-black',
  'ring-opacity-5',
  'focus:outline-none',
  'sm:text-sm'
);

const optionClasses = (active: boolean) =>
  cn('relative py-2 pl-10 pr-4', {
    'text-amber-900 bg-amber-100': active,
    'text-gray-900': !active
  });
