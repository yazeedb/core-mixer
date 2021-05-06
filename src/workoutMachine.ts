import { assign, Machine, send } from 'xstate';
import { generateWorkout, Workout } from './data';
import { Howl } from 'howler';
import workoutIntroMp4 from './audio/workout-intro.mp4';
import restMp4 from './audio/thirty-sec-rest.mp4';
import sixtySecondWorkout from './audio/sixty-second-workout.mp4';
import thirtySecondWorkout from './audio/thirty-second-workout.mp4';

const getInitialContext = (): MachineContext => ({
  previousTimeRemainingMs: 0,
  timeRemainingMs: 0,
  exerciseIndex: -1,
  workout: generateWorkout()
});

export interface MachineContext {
  workout: Workout;
  previousTimeRemainingMs: number;
  timeRemainingMs: number;
  exerciseIndex: number;
}

export const workoutMachine = Machine<MachineContext, any, any>(
  {
    id: 'workout',
    initial: 'workoutComplete',
    context: getInitialContext(),
    states: {
      viewingWorkout: {
        on: {
          INTRODUCE_WORKOUT: 'introducingWorkout',
          SHUFFLE: {
            actions: 'generateNewWorkout'
          }
        }
      },
      introducingWorkout: {
        entry: 'setNextExercise',
        invoke: { src: 'introduceWorkout' },
        on: { AUDIO_DONE: 'workoutRunning' }
      },
      workoutRunning: {
        initial: 'introducingExercise',
        onDone: 'workoutComplete',
        on: {
          AUDIO_DONE: 'workoutComplete',
          SKIP: [
            {
              target: 'workoutRunning.introducingExercise',
              cond: 'hasExercisesLeft',
              actions: 'setNextExercise'
            },
            {
              target: 'workoutRunning.exerciseComplete',
              cond: 'noExercisesLeft'
            }
          ]
        },
        states: {
          introducingExercise: {
            invoke: { src: 'announceExercise' },
            on: { AUDIO_DONE: 'running' }
          },
          running: {
            invoke: { id: 'timer', src: 'startTimer' },
            on: {
              TICK: {
                actions: ['setTimeRemainingMs', 'notifyTimerService']
              },
              TICK_30_SEC_LEFT: { actions: 'alert30SecLeft' },
              TICK_10_SEC_LEFT: { actions: 'alert10SecLeft' },
              PAUSE: 'paused',
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
          paused: {
            on: { CONTINUE: 'running' }
          },
          exerciseComplete: { type: 'final' }
        }
      },
      workoutComplete: {
        on: {
          GO_HOME: {
            target: 'viewingWorkout',
            actions: 'resetContext'
          }
        }
      }
    }
  },
  {
    actions: {
      resetContext: assign(getInitialContext),
      generateNewWorkout: assign({
        workout: (_) => generateWorkout()
      }),

      notifyTimerService: send(
        ({ previousTimeRemainingMs, timeRemainingMs }) => ({
          type: 'NEW_TIME',
          previousTimeRemainingMs,
          timeRemainingMs
        }),
        { to: 'timer' }
      ),

      setNextExercise: assign((context) => {
        const { exerciseIndex, workout } = context;
        const nextIndex = exerciseIndex + 1;
        const nextExercise = workout[nextIndex];

        return {
          ...context,
          exerciseIndex: nextIndex,
          timeRemainingMs: nextExercise.duration
        };
      }),

      setTimeRemainingMs: assign((context, { decrementAmount }) => {
        return {
          ...context,
          previousTimeRemainingMs: context.timeRemainingMs,
          timeRemainingMs: context.timeRemainingMs - decrementAmount
        };
      }),

      alert30SecLeft: assign((context) => {
        console.warn('PLACEHOLDER WARNING: 30 sec left!');

        return context;
      }),

      alert10SecLeft: assign((context) => {
        console.warn('PLACEHOLDER WARNING: 10 sec left!');

        return context;
      })
    },
    guards: {
      hasExercisesLeft: ({ workout, exerciseIndex }) =>
        exerciseIndex < workout.length - 1,

      noExercisesLeft: ({ workout, exerciseIndex }) =>
        exerciseIndex >= workout.length - 1,

      timeIsUp: ({ timeRemainingMs }) => timeRemainingMs === 0
    },
    services: {
      startTimer: ({ exerciseIndex, workout }) => (cb, onReceive) => {
        const currentExercise = workout[exerciseIndex];

        // TODO: How to properly type this?
        onReceive(({ previousTimeRemainingMs, timeRemainingMs }: any) => {
          const justPassed30SecondMark =
            timeRemainingMs <= 30000 && 30000 <= previousTimeRemainingMs;

          const justPassed10SecondMark =
            timeRemainingMs <= 10000 && 10000 <= previousTimeRemainingMs;

          if (justPassed30SecondMark && currentExercise.duration === 60000) {
            cb({ type: 'TICK_30_SEC_LEFT' });
          }

          if (justPassed10SecondMark) {
            cb({ type: 'TICK_10_SEC_LEFT' });
          }

          if (timeRemainingMs <= 0) {
            cb({ type: 'TIME_IS_UP' });
          }
        });

        const cleanup = startTicking((msElapsed) =>
          cb({ type: 'TICK', decrementAmount: msElapsed })
        );

        return cleanup;
      },

      introduceWorkout: () => playAudio(workoutIntroMp4),

      announceExercise: ({ workout, exerciseIndex }) => {
        const { audioFiles, duration } = workout[exerciseIndex];

        const file =
          duration === 30000 ? thirtySecondWorkout : sixtySecondWorkout;

        return playAudio([file]);
      },

      alertWhen30SecLeft: () => playAudio(workoutIntroMp4),
      alertWhen10SecLeft: () => playAudio(workoutIntroMp4)
    }
  }
);

const playAudio = (audioFiles: string[]) => (cb: any) => {
  const audio = new Howl({
    src: audioFiles,
    rate: 1.3
  });

  audio.play();
  audio.on('end', () => cb({ type: 'AUDIO_DONE' }));

  return () => {
    audio.stop();
  };
};

const startTicking = (onTick: (msElapsed: number) => void) => {
  /**
   * Low enough to animate smoothly, but high enough
   * to limit unneccessary computations.
   */
  const THROTTLE_INTERVAL = 60;

  let id: number;
  let past: number;

  const sendTick = (timestamp: number) => {
    past = past || timestamp;
    const msElapsed = timestamp - past;

    if (msElapsed >= THROTTLE_INTERVAL) {
      onTick(msElapsed * 20);
      past = timestamp;
    }

    id = requestAnimationFrame(sendTick);
  };

  id = requestAnimationFrame(sendTick);

  return () => cancelAnimationFrame(id);
};
