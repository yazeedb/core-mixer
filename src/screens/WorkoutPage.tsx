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
      <main className="app-padding text-center">
        <span>
          {exerciseIndex + 1} out of {workout.length}
        </span>

        <h2 className="font-medium text-3xl">{currentExercise.name}</h2>

        <div className="relative w-3/4 h-3/4 my-6 mx-auto">
          <Circle
            percent={(1 - percentage) * 100}
            strokeWidth={4}
            trailWidth={4}
            strokeColor="#05606e"
          />

          <img
            src={currentExercise.videoDemoUrl}
            alt={`Demonstration of ${currentExercise.name}`}
            className="absolute top-0 left-0 w-full h-full rounded-full -z-1"
          />
        </div>

        <h3 className="font-medium text-3xl">
          {(timeRemainingMs / 1000).toFixed(0)} seconds
        </h3>
      </main>

      <footer className="footer">
        <button
          className="btn-primary"
          onClick={isPaused ? onContinue : onPause}
        >
          {isPaused ? 'Continue' : 'Pause workout'}
        </button>

        <button className="btn-secondary" onClick={onSkip}>
          <SkipIcon />
        </button>
      </footer>
    </>
  );
};
