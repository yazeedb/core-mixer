/*
  Notes from Ivan consulting

  1. Zod TS
  2. XState-helpers
  3. createMachine
  4. timer service --> state machine
  5. audio preloading --> state machine
  6. Clock animation shouldn't need a 2nd timestamp
*/

import { assign, createMachine, send } from 'xstate';
import { CoachName, Difficulty, generateWorkout, Workout } from './data';
import { Howl } from 'howler';

export interface UserPreferences {
  difficulty: Difficulty;
  coachName: CoachName;
}

const userPreferencesStorageKey = 'userPreferences';

const getInitialContext = (
  preferences: UserPreferences = {
    difficulty: Difficulty.beginner,
    coachName: 'military'
  }
): MachineContext => ({
  previousTimeRemainingMs: 0,
  timeRemainingMs: 0,
  exerciseIndex: -1,
  workout: generateWorkout(preferences),
  preferences
});

export interface MachineContext {
  workout: Workout;
  previousTimeRemainingMs: number;
  timeRemainingMs: number;
  exerciseIndex: number;
  preferences: UserPreferences;
}

export const workoutMachine = createMachine<MachineContext, any, any>(
  {
    id: 'workout',
    initial: 'recallingPreferences',
    context: getInitialContext(),
    states: {
      recallingPreferences: {
        invoke: { src: 'recallPreferences' },
        on: {
          NOT_FOUND: 'choosingPreferences',
          FOUND: {
            target: 'viewingWorkout',
            actions: 'setPreferences'
          }
        }
      },
      choosingPreferences: {
        on: {
          SET_PREFERENCES: {
            target: 'viewingWorkout',
            actions: ['setPreferences', 'rememberPreferences']
          }
        }
      },
      viewingWorkout: {
        initial: 'preparing',
        onDone: 'introducingWorkout',
        on: {
          SHUFFLE: 'viewingWorkout.preparing',
          SET_PREFERENCES: {
            target: 'viewingWorkout.preparing',
            actions: ['setPreferences', 'rememberPreferences']
          }
        },
        states: {
          preparing: {
            entry: 'generateNewWorkout',
            invoke: {
              src: 'preloadAudioFiles',
              onDone: 'ready'
            }
          },
          ready: {
            on: { INTRODUCE_WORKOUT: 'done' }
          },
          done: { type: 'final' }
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
                {
                  target: 'exerciseComplete',
                  cond: 'noExercisesLeft'
                }
              ]
            }
          },
          paused: {
            on: { CONTINUE: 'running' }
          },
          exerciseComplete: {
            type: 'final'
          }
        }
      },
      workoutComplete: {
        invoke: { src: 'playCongratulations' },
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
      resetContext: assign(({ preferences }) => getInitialContext(preferences)),
      generateNewWorkout: assign({
        workout: ({ preferences }) => generateWorkout(preferences)
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
        playAudioSequence(
          [`./audio/${context.preferences.coachName}/30-sec-left.mp3`],
          () => {}
        );

        return context;
      }),

      alert10SecLeft: assign((context) => {
        playAudioSequence(
          [`./audio/${context.preferences.coachName}/10-sec-left.mp3`],
          () => {}
        );

        return context;
      }),

      setPreferences: assign({
        preferences: (_, { preferences }) => preferences
      }),

      rememberPreferences: assign((context, { preferences }) => {
        localStorage.setItem(
          userPreferencesStorageKey,
          JSON.stringify(preferences)
        );

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
      preloadAudioFiles: (context) => {
        const {
          preferences: { coachName },
          workout
        } = context;

        const [firstExerciseAudio, ...remainingExerciseAudios] = workout.map(
          (item) => item.audioFile
        );

        return new Promise((resolve) => {
          // Load critical audio files first
          [
            `./audio/${coachName}/welcome.mp3`,

            firstExerciseAudio,

            // durations
            `./audio/${coachName}/60-sec-exercise.mp3`,
            `./audio/${coachName}/30-sec-exercise.mp3`,

            // countdown
            `./audio/${coachName}/countdown.mp3`
          ].forEach((file, index, arr) => {
            const howl = new Howl({ src: file });

            if (index === arr.length - 1) {
              if (howl.state() === 'loaded') {
                resolve(null);
              } else {
                howl.once('load', () => resolve(null));
              }
            }
          });

          // Then these come later
          [
            // reminders
            `./audio/${coachName}/30-sec-left.mp3`,
            `./audio/${coachName}/10-sec-left.mp3`,

            ...remainingExerciseAudios,
            `./audio/${coachName}/congratulations.mp3`
          ].forEach((file) => {
            new Howl({ src: file });
          });
        });
      },

      recallPreferences: () => (cb) => {
        /*
          1. LocalStorage may throw in some browsers.
          Optimally wrap this access in a safety-check.

          2. Using Promise would make it more visually
          obvious that "recallingPreferences" acts autonomously.

          3. UX note: Consider making button immediately clickable,
          and show some kind of loading indicator until audio prefetch is done.

          4. Handling audio network errors

          5. Consider skipping notifyTimerService, and let startTimer
            handle the logic.

          6. Transient states for 30/10 seconds left
        */
        const preferences = parseStoredPreferences(
          localStorage.getItem(userPreferencesStorageKey)
        );

        if (!preferences) {
          cb({ type: 'NOT_FOUND' });
        } else {
          cb({ type: 'FOUND', preferences });
        }
      },
      startTimer:
        ({ exerciseIndex, workout }) =>
        (cb, onReceive) => {
          const currentExercise = workout[exerciseIndex];

          onReceive(({ previousTimeRemainingMs, timeRemainingMs }) => {
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

      introduceWorkout:
        ({ preferences }) =>
        (cb) =>
          playAudioSequence(
            [`./audio/${preferences.coachName}/welcome.mp3`],
            () => cb('AUDIO_DONE')
          ),

      playCongratulations:
        ({ preferences }) =>
        (cb) =>
          playAudioSequence(
            [`./audio/${preferences.coachName}/congratulations.mp3`],
            () => cb('AUDIO_DONE')
          ),

      announceExercise:
        ({ workout, exerciseIndex, preferences }) =>
        (cb) => {
          const { audioFile, duration, type } = workout[exerciseIndex];

          if (type === 'restPeriod') {
            return playAudioSequence([audioFile], () => cb('AUDIO_DONE'));
          }

          const file =
            duration === 30000
              ? `./audio/${preferences.coachName}/30-sec-exercise.mp3`
              : `./audio/${preferences.coachName}/60-sec-exercise.mp3`;

          return playAudioSequence(
            [audioFile, file, `./audio/${preferences.coachName}/countdown.mp3`],
            () => cb('AUDIO_DONE')
          );
        },

      alertWhen30SecLeft: ({ preferences }) =>
        playAudioSequence(
          [`./audio/${preferences.coachName}/30-sec-left.mp3`],
          () => {}
        ),

      alertWhen10SecLeft: ({ preferences }) =>
        playAudioSequence(
          [`./audio/${preferences.coachName}/10-sec-left.mp3`],
          () => {}
        )
    }
  }
);

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
      onTick(msElapsed);
      past = timestamp;
    }

    id = requestAnimationFrame(sendTick);
  };

  id = requestAnimationFrame(sendTick);

  return () => cancelAnimationFrame(id);
};

const playAudioSequence = (tracks: string[], doneCb: () => void) => {
  const howls = tracks.map((t) => new Howl({ src: t }));

  let index = 0;

  const playNextTrack = () => {
    const currentHowl = howls[index];

    if (!currentHowl) {
      cancelAnimationFrame(id);
      doneCb();
      return;
    }

    if (currentHowl.playing()) {
      return;
    }

    currentHowl.play();
    currentHowl.on('end', () => {
      index++;
      id = requestAnimationFrame(playNextTrack);
    });
  };

  let id = requestAnimationFrame(playNextTrack);

  return () => {
    cancelAnimationFrame(id);
    howls.forEach((h) => h.stop());
  };
};

const parseStoredPreferences = (
  value: string | null
): UserPreferences | null => {
  if (!value) {
    return null;
  }

  const { difficulty, coachName } = JSON.parse(value);

  if (!difficulty || !coachName) {
    return null;
  }

  return {
    difficulty: parseInt(difficulty),
    coachName
  };
};
