import { SkipIcon } from '../icons/Skip';
import { MachineContext } from '../workoutMachine';

interface WorkoutPageProps {
  context: MachineContext;
}

export const WorkoutPage = ({ context }: WorkoutPageProps) => {
  const { workout, timeRemaining, exerciseIndex } = context;
  const currentExercise = workout[exerciseIndex];

  return (
    <>
      <main style={{ textAlign: 'center' }}>
        <span className="workout-progress">
          {exerciseIndex + 1} out of {workout.length}
        </span>

        <h2>{currentExercise.name}</h2>

        <img
          src={currentExercise.videoDemoUrl}
          alt={`Demonstration of ${currentExercise.name}`}
        />

        <span className="time-remaining">{timeRemaining} seconds</span>
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
