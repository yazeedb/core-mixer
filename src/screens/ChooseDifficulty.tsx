import { Listbox } from '@headlessui/react';
import cn from 'classnames';
import { useState } from 'react';
import { Difficulty, printDifficulty } from '../data';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

interface ChooseDifficultyProps {
  onSubmit: (difficulty: Difficulty) => void;
}

const difficulties: Difficulty[] = [
  Difficulty.beginner,
  Difficulty.intermediate,
  Difficulty.advanced
];

export const ChooseDifficulty = ({ onSubmit }: ChooseDifficultyProps) => {
  const [difficulty, setDifficulty] = useState(difficulties[0]);

  return (
    <main className="app-padding">
      <h2>Choose difficulty</h2>

      <Listbox value={difficulty} onChange={setDifficulty}>
        <div className="relative mt-1">
          <Listbox.Button
            className={cn(
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
            )}
          >
            <span className="block truncate">
              {printDifficulty(difficulty)}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className={cn(
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
            )}
          >
            {difficulties.map((d) => (
              <Listbox.Option
                key={d}
                value={d}
                className={({ active }) =>
                  cn('relative py-2 pl-10 pr-4', {
                    'text-amber-900 bg-amber-100': active,
                    'text-gray-900': !active
                  })
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={cn('block truncate')}>
                      {printDifficulty(d)}
                    </span>
                    {selected ? (
                      <span
                        className={cn(
                          'absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'
                        )}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <button
        type="submit"
        className="btn-primary mt-8"
        onClick={() => onSubmit(difficulty)}
      >
        Let's go
      </button>
    </main>
  );
};
