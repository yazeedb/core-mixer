import { SkipIcon } from '../icons/Skip';
import { MachineContext } from '../workoutMachine';
import { Circle } from 'rc-progress';

interface WorkoutPageProps {
  context: MachineContext;
  onPause: () => void;
  onSkip: () => {};
}

export const WorkoutPage = ({ context }: WorkoutPageProps) => {
  const { workout, timeRemaining, exerciseIndex } = context;
  const currentExercise = workout[exerciseIndex];
  const percentage = timeRemaining / currentExercise.seconds;

  return (
    <>
      <main className="current-exercise">
        <span className="workout-progress">
          {exerciseIndex + 1} out of {workout.length}
        </span>

        <h2 className="exercise-name">{currentExercise.name}</h2>

        <div className="stopwatch-container">
          <Circle
            percent={(1 - percentage) * 100}
            strokeWidth={4}
            trailWidth={4}
            strokeColor="#05606e"
            className="beef"
            prefixCls="prefixed-salad"
          />

          <img
            src={currentExercise.videoDemoUrl}
            alt={`Demonstration of ${currentExercise.name}`}
          />
        </div>

        <h3 className="time-remaining">{timeRemaining} seconds</h3>
      </main>

      <footer>
        <button className="start-workout button-primary" onClick={() => {}}>
          PAUSE WORKOUT
        </button>

        <button className="shuffle button-secondary" onClick={() => {}}>
          <SkipIcon />
        </button>
      </footer>
    </>
  );
};
