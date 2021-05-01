import { Seconds, Workout } from '../data';

interface WorkoutCompleteProps {
  onGoHome: () => void;
  workout: Workout;
}

export const WorkoutComplete = ({
  onGoHome,
  workout
}: WorkoutCompleteProps) => {
  return (
    <>
      <main className="workout-complete">
        <h2>Workout Complete</h2>

        <h3>Overview</h3>

        <ul>
          {workout.map((item) => (
            <li>
              <div className="checkmark"></div>
              <span className="name">{item.name}</span>
              <span className="time">{printExerciseTime(item.seconds)}</span>
            </li>
          ))}
        </ul>
      </main>

      <footer>
        <button className="start-workout button-primary" onClick={onGoHome}>
          Go home
        </button>
      </footer>
    </>
  );
};

const printExerciseTime = (seconds: Seconds) =>
  seconds === 30 ? '30 seconds' : '1 min';
