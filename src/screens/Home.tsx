import { TimerIcon } from '../icons/Timer';
import { getDifficultyIcon } from '../icons/getDifficultyIcon';
import { DumbbellIcon } from '../icons/Dumbbell';
import { ShuffleIcon } from '../icons/Shuffle';
import { Difficulty, printDifficulty, Seconds, Workout } from '../data';

interface HomeProps {
  workout: Workout;
  onStart: () => void;
  onShuffle: () => void;
}

export const Home = ({ workout, onStart, onShuffle }: HomeProps) => {
  const { averageDifficulty, exerciseCount } = getWorkoutMeta(workout);

  return (
    <>
      <main>
        <h2 className="workout-title">Your Workout</h2>

        <ul className="workout-details">
          <li>
            <span className="icon">
              <TimerIcon />
            </span>

            <span className="label">{printWorkoutTime(workout)}</span>
          </li>

          <li>
            <span className="icon">{getDifficultyIcon(averageDifficulty)}</span>
            <span className="label">{printDifficulty(averageDifficulty)}</span>
          </li>

          <li>
            <span className="icon">
              <DumbbellIcon />
            </span>

            <span className="label">{exerciseCount} exercises</span>
          </li>
        </ul>

        <ul className="workout-list">
          {workout.map((item) => (
            <li className="workout-item" key={item.name}>
              <div className="bullet-container">
                <div className="bullet" />
              </div>

              <div className="something">
                <img src={item.imageUrl} alt={`${item.name} demonstration`} />

                <span className="name">{item.name}</span>
                <span className="time">{printExerciseTime(item.seconds)}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer>
        <button className="start-workout button-primary" onClick={onStart}>
          START WORKOUT
        </button>
        <button className="shuffle button-secondary" onClick={onShuffle}>
          <ShuffleIcon />
        </button>
      </footer>
    </>
  );
};

const printExerciseTime = (seconds: Seconds) =>
  seconds === 30 ? '30 seconds' : '1 minute';

const printWorkoutTime = (workout: Workout) => {
  const totalWorkoutTime = workout.reduce(
    (total, item) => total + item.seconds,
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
