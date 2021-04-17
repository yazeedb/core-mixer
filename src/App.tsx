import { generateWorkout } from './data';
import './App.scss';
import { useMachine } from '@xstate/react';
import { workoutMachine } from './workoutMachine';

export const App = () => {
  const [{ context, matches }, send] = useMachine(workoutMachine, {
    devTools: true
  });

  const { workout, exerciseIndex, timeRemaining } = context;

  const totalWorkoutTime = workout.reduce(
    (total, exercise) => total + exercise.seconds,
    0
  );

  const currentExercise = workout[exerciseIndex];

  const renderContent = () => {
    switch (true) {
      case matches('viewingWorkout'):
      case matches('introducingWorkout'):
        return (
          <>
            <h2>{printWorkoutTime(totalWorkoutTime)}</h2>

            {
              <ul>
                {workout.map(({ name, type, seconds }, index) => (
                  <li key={index}>
                    <p className="exercise-name">{name}</p>

                    {type === 'TimedExercise' ? (
                      <span className="exercise-duration">
                        - {seconds} seconds
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            }

            <footer>
              <button
                className="start-workout"
                onClick={() => send({ type: 'INTRODUCE_WORKOUT' })}
              >
                Start workout
              </button>
            </footer>
          </>
        );

      case matches('workoutRunning'):
        return (
          <>
            <h3>{currentExercise.name}</h3>

            <p>{timeRemaining}</p>
          </>
        );
    }
  };

  return (
    <>
      <header>
        <h1>Core Mixer</h1>

        <button
          className="shuffle-workout"
          onClick={() =>
            send({
              type: 'NEW_WORKOUT',
              workout: generateWorkout()
            })
          }
        >
          Mix it up
          {/* <img src="icon-refresh.svg" alt="Generate new workout" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="icon-refresh"
          >
            <circle cx="12" cy="12" r="10" className="primary" />
            <path
              className="secondary"
              d="M8.52 7.11a5.98 5.98 0 0 1 8.98 2.5 1 1 0 1 1-1.83.8 4 4 0 0 0-5.7-1.86l.74.74A1 1 0 0 1 10 11H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1.7-.7l.82.81zm5.51 8.34l-.74-.74A1 1 0 0 1 14 13h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1.7.7l-.82-.81A5.98 5.98 0 0 1 6.5 14.4a1 1 0 1 1 1.83-.8 4 4 0 0 0 5.7 1.85z"
            />
          </svg>
        </button>
      </header>

      <main>{renderContent()}</main>
    </>
  );
};

const printWorkoutTime = (seconds: number): string => {
  const remainder = seconds % 60;
  const base = `${Math.floor(seconds / 60)} minutes`;

  return remainder === 0 ? base : `${base} ${remainder} seconds`;
};
