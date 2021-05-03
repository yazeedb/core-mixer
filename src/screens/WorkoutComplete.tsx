import { DurationMs, Workout } from '../data';
import { Splatter } from '../svg/Splatter';

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
      <main>
        <div className="splatter-container">
          <h2>Workout Complete</h2>
          <Splatter />
        </div>

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

      <footer className="workout-complete">
        <button className="start-workout button-primary" onClick={onGoHome}>
          Go home
        </button>
      </footer>
    </>
  );
};

const printExerciseTime = (duration: DurationMs) =>
  duration === 30000 ? '30 Duration' : '1 min';
