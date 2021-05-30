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
    <main>
      <div>
        <label className={labelClassNames} htmlFor="difficulties">
          Choose your difficulty:
        </label>
        <select
          className={selectClassNames}
          id="difficulties"
          name="difficulties"
          onChange={(e) => setDifficulty(parseInt(e.currentTarget.value))}
          value={difficulty}
        >
          {difficulties.map((d) => (
            <option value={d} key={d}>
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
          value={coachName}
        >
          {coachNames.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn-primary mt-8"
        onClick={() => onSubmit({ difficulty, coachName })}
      >
        Let's go
      </button>
    </main>
  );
};

interface ChoosePreferencesModalProps extends ChoosePreferencesProps {
  existingPreferences: UserPreferences;
}

export const ChoosePreferencesModal = ({
  onSubmit,
  existingPreferences
}: ChoosePreferencesModalProps) => {
  const [difficulty, setDifficulty] = useState(existingPreferences.difficulty);
  const [coachName, setCoachName] = useState(existingPreferences.coachName);

  return (
    <>
      <div>
        <label className={labelClassNames} htmlFor="difficulties">
          Difficulty:
        </label>
        <select
          className={selectClassNames}
          id="difficulties"
          name="difficulties"
          onChange={(e) => setDifficulty(parseInt(e.currentTarget.value))}
          value={difficulty}
        >
          {difficulties.map((d) => (
            <option value={d} key={d}>
              {printDifficulty(d)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClassNames} htmlFor="coachName">
          Coach:
        </label>
        <select
          className={selectClassNames}
          id="coachName"
          name="coachName"
          onChange={(e) => setCoachName(e.currentTarget.value as CoachName)}
          value={coachName}
        >
          {coachNames.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="text-blue-1 font-medium mr-4 border-blue-1 border"
          onClick={() => onSubmit({ difficulty, coachName })}
        >
          Save
        </button>
      </div>
    </>
  );
};

const selectClassNames = cn(
  'capitalize border-neutral-1 border mb-4',
  'px-1 py-2 mt-1 rounded-md w-full'
);
const labelClassNames = cn('font-bold', 'mr-2', 'block');
