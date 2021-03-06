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
      <main>
        <h2 className="font-medium">Workout Complete</h2>

        <ul className="mb-28">
          {workout.map((item) => (
            <li
              key={item.id}
              className="bg-neutral-3 py-5 px-6 my-4 rounded-lg flex justify-between"
            >
              <div className="font-bold">
                <span className="mr-2 text-supporting-1">&#10003;</span>
                <span>{item.name}</span>
              </div>

              <span className="">{printExerciseTime(item.duration)}</span>
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer-fixed">
        <button className="btn-primary w-full" onClick={onGoHome}>
          Back to home
        </button>
      </footer>
    </>
  );
};

const printExerciseTime = (duration: DurationMs) =>
  duration === 30000 ? '30 sec' : '1 min';
