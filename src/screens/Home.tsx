import { TimerIcon } from '../svg/Timer';
import { getDifficultyIcon } from '../svg/getDifficultyIcon';
import { DumbbellIcon } from '../svg/Dumbbell';
import { ShuffleIcon } from '../svg/Shuffle';
import { Difficulty, printDifficulty, DurationMs, Workout } from '../data';
import { cn } from '../utils';

interface HomeProps {
  workout: Workout;
  onStart: () => void;
  onShuffle: () => void;
}

export const Home = ({ workout, onStart, onShuffle }: HomeProps) => {
  const { averageDifficulty, exerciseCount } = getWorkoutMeta(workout);

  return (
    <>
      <main className="app-padding">
        <h2 className="text-neutral-1">Your Workout</h2>

        <ul className={cn(['flex', 'justify-between', 'pt-3', 'pb-6'])}>
          <li className={cn(['flex', 'justify-between', 'items-center'])}>
            <span className="mr-2">
              <TimerIcon />
            </span>

            <span className="capitalize">{printWorkoutTime(workout)}</span>
          </li>

          <li className={cn(['flex', 'justify-between', 'items-center'])}>
            <span className="mr-2">{getDifficultyIcon(averageDifficulty)}</span>
            <span className="capitalize">
              {printDifficulty(averageDifficulty)}
            </span>
          </li>

          <li className={cn(['flex', 'justify-between', 'items-center'])}>
            <span className="mr-2">
              <DumbbellIcon />
            </span>

            <span className="capitalize">{exerciseCount} exercises</span>
          </li>
        </ul>

        <ul className="pl-3 mb-28">
          {workout.map((item) => (
            <li
              key={item.name}
              className={cn([
                'flex',
                'justify-between',
                'border-l border-neutral-1',
                'relative',
                'pl-8',
                'pb-10'
              ])}
            >
              <div
                className={cn([
                  'w-7',
                  'h-7',
                  'bg-primary-1',
                  'rounded-full',
                  'flex',
                  'items-center',
                  'justify-center',
                  'absolute',
                  'top-0',
                  '-left-4'
                ])}
              >
                <div
                  className={cn(['bg-white', 'w-1/3', 'h-1/3', 'rounded-full'])}
                />
              </div>

              <div className="something">
                <img
                  src={item.imageUrl}
                  alt={`${item.name} demonstration`}
                  className={cn(['rounded-2xl', 'shadow-xl', 'w-full', 'h-24'])}
                />

                <h3 className="font-medium mt-2 text-lg text-neutral-1">
                  {item.name}
                </h3>
                <span className="text-neutral-2">
                  {printExerciseTime(item.duration)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer-fixed">
        <button onClick={onStart} className="btn-primary">
          Start Workout
        </button>
        <button className="btn-secondary" onClick={onShuffle}>
          <ShuffleIcon />
        </button>
      </footer>
    </>
  );
};

const printExerciseTime = (seconds: DurationMs) =>
  seconds === 30000 ? '30 seconds' : '1 minute';

const printWorkoutTime = (workout: Workout) => {
  const totalWorkoutTime = workout.reduce(
    (total, item) => total + item.duration / 1000,
    0
  );

  const minutes = Math.floor(totalWorkoutTime / 60).toString();
  const seconds = (totalWorkoutTime % 60).toString();

  return `${minutes}:${seconds.padEnd(2, '0')}`;
};

const getWorkoutMeta = (
  workout: Workout
): { averageDifficulty: Difficulty; exerciseCount: number } => {
  const { difficultySum, exerciseCount } = workout.reduce(
    (acc, item) => {
      if (item.type === 'restPeriod') {
        return acc;
      }

      return {
        difficultySum: acc.difficultySum + item.difficulty,
        exerciseCount: acc.exerciseCount + 1
      };
    },
    { difficultySum: 0, exerciseCount: 0 }
  );

  return {
    averageDifficulty: Math.round(difficultySum / exerciseCount),
    exerciseCount
  };
};
