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
        on: { INTRODUCE_EXERCISE: 'introducingExercise' },
        entry: 'setNextExercise',
        invoke: {
          src: 'introduceWorkout',
          onDone: 'introducingExercise'
        }
      },
      introducingExercise: {
        on: { START_EXERCISE: 'workoutRunning' },
        invoke: {
          src: 'announceExercise',
          onDone: 'workoutRunning'
        }
      },
      workoutRunning: {
        initial: 'running',
        on: {
          TICK: {
            actions: ['updateTimer', 'alertIf30SecLeft', 'alertIf10SecLeft']
          }
        },
        onDone: [
          {
            target: 'introducingExercise',
            cond: 'hasExercisesLeft',
            actions: 'setNextExercise'
          },
          { target: 'workoutComplete', cond: 'noMoreExercises' }
        ],
        states: {
          running: {
            invoke: { src: 'startTimer' },
            on: {
              TICK: [{ target: 'exerciseComplete', cond: 'timeIsUp' }]
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

      alertIf30SecLeft: assign((context) => {
        const { workout, timeRemaining, exerciseIndex } = context;
        const { seconds, type } = workout[exerciseIndex];

        if (
          type !== 'break' &&
          timeRemaining < seconds &&
          timeRemaining === 30
        ) {
          console.warn('30 seconds left!');
        }

        return context;
      }),

      alertIf10SecLeft: assign((context) => {
        const { timeRemaining } = context;

        if (timeRemaining === 10) {
          console.warn('10 seconds left!');
        }

        return context;
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
      })
    },
    guards: {
      hasExercisesLeft: ({ workout, exerciseIndex }) =>
        exerciseIndex < workout.length - 1,

      noMoreExercises: ({ workout, exerciseIndex }) =>
        exerciseIndex >= workout.length - 1,

      timeIsUp: ({ timeRemaining }) => timeRemaining === 0
    },
    services: {
      startTimer: () => (cb) => {
        setInterval(() => {
          cb({ type: 'TICK' });
        }, 50);
      },

      introduceWorkout: () => playAudio(workoutIntroMp4),

      announceExercise: ({ workout, exerciseIndex }) => {
        const { audioFiles } = workout[exerciseIndex];

        return playAudio(audioFiles);
      }
    }
  }
);

const playAudio = (audioFiles: string[]) =>
  new Promise((resolve) => {
    new Howl({
      src: audioFiles,
      rate: 2,
      onend: resolve
    }).play();
  });
