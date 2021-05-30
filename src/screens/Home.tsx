import { TimerIcon } from '../svg/Timer';
import { getDifficultyIcon } from '../svg/getDifficultyIcon';
import { DumbbellIcon } from '../svg/Dumbbell';
import { ShuffleIcon } from '../svg/Shuffle';
import { Difficulty, printDifficulty, DurationMs, Workout } from '../data';

interface HomeProps {
  workout: Workout;
  difficulty: Difficulty;
  onStart: () => void;
  onShuffle: () => void;
  ready: boolean;
}

export const Home = ({
  workout,
  difficulty,
  onStart,
  onShuffle,
  ready
}: HomeProps) => {
  const liClassName = 'flex justify-between items-center';

  return (
    <>
      <main>
        <h2>Your Workout</h2>

        <ul className="flex justify-between pt-3 pb-6">
          <li className={liClassName}>
            <span className="mr-2">
              <TimerIcon className="fill-current" />
            </span>

            <span className="capitalize">{printWorkoutTime(workout)}</span>
          </li>

          <li className={liClassName}>
            <span className="mr-2">{getDifficultyIcon(difficulty)}</span>
            <span className="capitalize">{printDifficulty(difficulty)}</span>
          </li>

          <li className={liClassName}>
            <span className="mr-2">
              <DumbbellIcon className="fill-current" />
            </span>

            <span className="capitalize">
              {getExerciseCount(workout)} exercises
            </span>
          </li>
        </ul>

        <ul className="mb-28">
          {workout.map((item) => (
            <li
              key={item.id}
              className="bg-white shadow-lg mt-5 mb-16 rounded-md"
            >
              <img
                src={item.imageUrl}
                alt={`${item.name} demonstration`}
                className="w-full h-48 rounded-t-md"
              />

              <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
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
          {ready ? 'Start Workout' : 'Loading...'}
        </button>
        <button className="btn-secondary" onClick={onShuffle}>
          <span className="sr-only">Generate new workout</span>
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

const getExerciseCount = (workout: Workout): number =>
  workout.reduce(
    (total, item) => (item.type === 'timedExercise' ? total + 1 : total),
    0
  );
