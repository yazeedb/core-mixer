import { TimerIcon } from '../svg/Timer';
import { getDifficultyIcon } from '../svg/getDifficultyIcon';
import { DumbbellIcon } from '../svg/Dumbbell';
import { ShuffleIcon } from '../svg/Shuffle';
import { Difficulty, printDifficulty, DurationMs, Workout } from '../data';

interface HomeProps {
  workout: Workout;
  onStart: () => void;
  onShuffle: () => void;
}

export const Home = ({ workout, onStart, onShuffle }: HomeProps) => {
  const { averageDifficulty, exerciseCount } = getWorkoutMeta(workout);

  return (
    <>
      <main className="home">
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
                <span className="time">{printExerciseTime(item.duration)}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="fixed">
        <button className="start-workout button-primary" onClick={onStart}>
          Start Workout
        </button>
        <button className="shuffle button-secondary" onClick={onShuffle}>
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
