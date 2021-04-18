import { assign, Machine } from 'xstate';
import { generateWorkout, Workout } from './data';
import { Howl } from 'howler';
import workoutIntroMp4 from './audio/workout-intro.mp4';

interface MachineContext {
  workout: Workout;
  timeRemaining: number;
  exerciseIndex: number;
}

export const workoutMachine = Machine<MachineContext, any, any>(
  {
    id: 'workout',
    initial: 'viewingWorkout',
    context: {
      timeRemaining: 0,
      exerciseIndex: -1,
      workout: generateWorkout()
    },
    states: {
      viewingWorkout: {
        on: {
          INTRODUCE_WORKOUT: 'introducingWorkout',
          NEW_WORKOUT: {
            actions: 'generateNewWorkout'
          }
        }
      },
      introducingWorkout: {
        entry: 'setNextExercise',
        invoke: {
          src: 'introduceWorkout',
          onDone: 'workoutRunning'
        }
      },
      workoutRunning: {
        initial: 'introducingExercise',
        onDone: 'workoutComplete',
        states: {
          introducingExercise: {
            invoke: {
              src: 'announceExercise',
              onDone: 'running'
            }
          },
          running: {
            invoke: { src: 'startTimer' },
            on: {
              TICK: { actions: 'updateTimer' },
              TICK_30_SEC_LEFT: { actions: 'alert30SecLeft' },
              TICK_10_SEC_LEFT: { actions: 'alert10SecLeft' },
              TIME_IS_UP: [
                {
                  target: 'introducingExercise',
                  cond: 'hasExercisesLeft',
                  actions: 'setNextExercise'
                },
                { target: 'exerciseComplete', cond: 'noExercisesLeft' }
              ]
            }
          },
          exerciseComplete: { type: 'final' }
        }
      },
      workoutComplete: {}
    }
  },
  {
    actions: {
      generateNewWorkout: assign({
        workout: (_) => generateWorkout()
      }),

      setNextExercise: assign((context) => {
        const { exerciseIndex, workout } = context;
        const nextIndex = exerciseIndex + 1;
        const nextExercise = workout[nextIndex];

        return {
          ...context,
          exerciseIndex: nextIndex,
          timeRemaining: nextExercise.seconds
        };
      }),

      updateTimer: assign({
        timeRemaining: (context) => context.timeRemaining - 1
      }),

      alert30SecLeft: assign((context) => {
        console.warn('30 sec left!');

        return context;
      }),

      alert10SecLeft: assign((context) => {
        console.warn('10 sec left!');

        return context;
      })
    },
    guards: {
      hasExercisesLeft: ({ workout, exerciseIndex }) =>
        exerciseIndex < workout.length - 1,

      noExercisesLeft: ({ workout, exerciseIndex }) =>
        exerciseIndex >= workout.length - 1,

      timeIsUp: ({ timeRemaining }) => timeRemaining === 0
    },
    services: {
      startTimer: ({ exerciseIndex, workout }) => (cb) => {
        const currentExercise = workout[exerciseIndex];
        let timeRemaining = currentExercise.seconds;

        setInterval(() => {
          timeRemaining--;

          if (timeRemaining === 30 && currentExercise.seconds === 60) {
            cb({ type: 'TICK_30_SEC_LEFT' });
          }

          if (timeRemaining === 10) {
            cb({ type: 'TICK_10_SEC_LEFT' });
          }

          if (timeRemaining === 0) {
            cb({ type: 'TIME_IS_UP' });
          }

          cb({ type: 'TICK' });
        }, 20);
      },

      introduceWorkout: () => playAudio(workoutIntroMp4),

      announceExercise: ({ workout, exerciseIndex }) => {
        const { audioFiles } = workout[exerciseIndex];

        return playAudio(audioFiles);
      },

      alertWhen30SecLeft: () => playAudio(workoutIntroMp4),
      alertWhen10SecLeft: () => playAudio(workoutIntroMp4)
    }
  }
);

const playAudio = (audioFiles: string[]) =>
  new Promise((resolve) => {
    new Howl({
      src: audioFiles,
      rate: 4,
      onend: resolve
    }).play();
  });
