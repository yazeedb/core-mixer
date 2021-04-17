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
            <h2>{printWorkoutTime(totalWorkoutTime)} workout</h2>

            <section>
              {
                <ul>
                  {workout.map((item, index) => (
                    <li key={index}>{item.name}</li>
                  ))}
                </ul>
              }
            </section>

            <footer>
              <button
                onClick={() =>
                  send({ type: 'NEW_WORKOUT', workout: generateWorkout() })
                }
              >
                Mix it up
              </button>

              <button onClick={() => send({ type: 'INTRODUCE_WORKOUT' })}>
                Start
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
    <main>
      <header>
        <h1>Core Mixer</h1>
      </header>

      {renderContent()}
    </main>
  );
};

const printWorkoutTime = (seconds: number): string => {
  const asMinutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return remainder === 0
    ? `${asMinutes} minute`
    : `${asMinutes} minutes ${remainder} seconds`;
};
