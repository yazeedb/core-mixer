import { SkipIcon } from '../svg/Skip';
import { MachineContext } from '../workoutMachine';
import { Circle } from 'rc-progress';

interface WorkoutPageProps {
  context: MachineContext;
  onPause: () => void;
  onContinue: () => void;
  onSkip: () => void;
  isPaused: boolean;
}

export const WorkoutPage = ({
  context,
  isPaused,
  onPause,
  onContinue,
  onSkip
}: WorkoutPageProps) => {
  const { workout, timeRemainingMs, exerciseIndex } = context;
  const currentExercise = workout[exerciseIndex];
  const percentage = timeRemainingMs / currentExercise.duration;

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
          />

          <img
            src={currentExercise.videoDemoUrl}
            alt={`Demonstration of ${currentExercise.name}`}
          />
        </div>

        <h3 className="time-remaining">
          {(timeRemainingMs / 1000).toFixed(0)} seconds
        </h3>
      </main>

      <footer>
        <button
          className="start-workout button-primary"
          onClick={isPaused ? onContinue : onPause}
        >
          {isPaused ? 'Continue' : 'Pause workout'}
        </button>

        <button className="shuffle button-secondary" onClick={onSkip}>
          <SkipIcon />
        </button>
      </footer>
    </>
  );
};
