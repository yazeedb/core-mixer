import {
  getRandomItem,
  getRandomInt,
  percentToIndex,
  pick30or60Seconds,
  shuffleArray
} from './utils';
import thirtySecRestMp4 from './audio/thirty-sec-rest.mp4';
import thirtySecWorkoutMp4 from './audio/thirty-second-workout.mp4';
import sixtySecWorkoutMp4 from './audio/sixty-second-workout.mp4';

const BREAK_DURATION = 30;
const MIN_SECONDS_NO_BREAKS = 270;
const MAX_SECONDS_NO_BREAKS = 480;

export const MIN_SECONDS_WITH_BREAKS = MIN_SECONDS_NO_BREAKS + BREAK_DURATION;
export const MAX_SECONDS_WITH_BREAKS = MAX_SECONDS_NO_BREAKS + BREAK_DURATION;

const allowedWorkoutTimesNoBreaks = [
  MIN_SECONDS_NO_BREAKS,
  300,
  330,
  360,
  390,
  420,
  450,
  480,
  MAX_SECONDS_NO_BREAKS
];

interface Segment {
  name: string;
  audioFiles: string[];
}

export interface TimedExercise extends Segment {
  type: 'TimedExercise';
  seconds: 30 | 60;
}

export interface Break extends Segment {
  type: 'break';
  name: '30 second rest';
  seconds: 30;
}

type WorkoutItem = TimedExercise | Break;

export type Workout = WorkoutItem[];

export const generateWorkout = (): Workout => {
  const shuffledExercises = shuffleArray(exercises);
  const yourExercises: TimedExercise[] = [];

  const targetSecondsNoBreaks = getRandomItem(allowedWorkoutTimesNoBreaks);
  let counter = targetSecondsNoBreaks;
  let index = 0;

  while (counter > 0) {
    const thirtySecondsLeft = counter === 30;
    const seconds = thirtySecondsLeft ? 30 : pick30or60Seconds();

    const timedExercise: TimedExercise = {
      ...shuffledExercises[index],
      type: 'TimedExercise',
      seconds,
      audioFiles: [seconds === 30 ? thirtySecWorkoutMp4 : sixtySecWorkoutMp4]
    };

    yourExercises.push(timedExercise);

    index++;
    counter -= seconds;
  }

  return withInterspersedBreaks(yourExercises, targetSecondsNoBreaks);
};

const withInterspersedBreaks = (
  exercises: TimedExercise[],
  targetSecondsNoBreaks: number
): Workout => {
  const numberOfBreaks =
    targetSecondsNoBreaks === MAX_SECONDS_NO_BREAKS ? 1 : getRandomInt(1, 2);

  const yourBreak: Break = {
    name: '30 second rest',
    audioFiles: [thirtySecRestMp4],
    type: 'break',
    seconds: BREAK_DURATION
  };

  if (numberOfBreaks === 1) {
    const middleIndex = percentToIndex(exercises.length, 0.5);

    return exercises.flatMap((e, index) =>
      index === middleIndex ? [yourBreak, e] : e
    );
  }

  const firstBreakIndex = percentToIndex(exercises.length, 0.45);
  const secondBreakIndex = percentToIndex(exercises.length, 0.75);

  return exercises.flatMap((e, index) =>
    index === firstBreakIndex || index === secondBreakIndex ? [yourBreak, e] : e
  );
};

const exercises: Segment[] = [
  {
    name: 'Double-leg stretches',
    audioFiles: []
  },
  {
    name: 'Hip dips',
    audioFiles: []
  },
  {
    name: 'Leg raises',
    audioFiles: []
  },
  {
    name: 'Bicycles',
    audioFiles: []
  },
  {
    name: 'Criss-cross',
    audioFiles: []
  },
  {
    name: 'Ab circles',
    audioFiles: []
  },
  {
    name: 'Straddle crunches',
    audioFiles: []
  },
  {
    name: 'Pike presses',
    audioFiles: []
  },
  {
    name: 'Patty cakes',
    audioFiles: []
  },
  {
    name: 'Tailbone crunches',
    audioFiles: []
  },
  {
    name: 'Crunches',
    audioFiles: []
  },
  {
    name: 'Reverse crunches',
    audioFiles: []
  }
];
