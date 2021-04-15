import { assign, Machine } from 'xstate';
import { Workout } from './data';
import { Howl } from 'howler';
import workoutIntroMp4 from './audio/workout-intro.mp4';
import thirtySecWorkoutMp4 from './audio/thirty-second-workout.mp4';
import sixtySecWorkoutMp4 from './audio/sixty-second-workout.mp4';

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
      workout: []
    },
    states: {
      viewingWorkout: {
        on: {
          INTRODUCE_WORKOUT: 'introducingWorkout',
          NEW_WORKOUT: {
            actions: 'setWorkout'
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
      setWorkout: assign({
        workout: (_, event) => event.workout
      }),
      alertIf30SecLeft: assign((context) => {
        const { workout, timeRemaining, exerciseIndex } = context;
        const { seconds } = workout[exerciseIndex];

        if (timeRemaining < seconds && timeRemaining === 30) {
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

      timeIsUp: ({ timeRemaining }) => timeRemaining === 0,

      restComingUp: ({ workout, exerciseIndex, timeRemaining }) => {
        const nextWorkout = workout[exerciseIndex + 1];

        return (
          nextWorkout && nextWorkout.type === 'break' && timeRemaining === 0
        );
      }
    },
    services: {
      startTimer: () => (cb) => {
        setInterval(() => {
          cb({ type: 'TICK' });
        }, 50);
      },

      introduceWorkout: () => playAudio(workoutIntroMp4),

      announceExercise: ({ workout, exerciseIndex }, event) => {
        const { seconds, audioFiles } = workout[exerciseIndex];
        const src =
          audioFiles.length > 0
            ? audioFiles
            : seconds === 30
            ? thirtySecWorkoutMp4
            : sixtySecWorkoutMp4;

        return playAudio(src);
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
