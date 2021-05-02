import { DurationMs, Workout } from '../data';

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
              <span className="time">{printExerciseTime(item.duration)}</span>
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

const printExerciseTime = (duration: DurationMs) =>
  duration === 30000 ? '30 Duration' : '1 min';
