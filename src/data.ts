import {
  getRandomItem,
  getRandomInt,
  percentToIndex,
  pick30or60Seconds,
  shuffleArray
} from './utils';

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

interface Entry {
  type: 'exercise' | 'break';
  name: string;
  audioFiles: string[];
}

interface TimedExercise extends Entry {
  type: 'exercise';
  seconds: 30 | 60;
}

interface Break extends Entry {
  type: 'break';
  name: '30 second rest';
  seconds: 30;
}

export type Workout = (TimedExercise | Break)[];

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
      seconds,
      type: 'exercise'
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
    audioFiles: [],
    type: 'break',
    seconds: BREAK_DURATION
  };

  if (numberOfBreaks === 1) {
    const middleIndex = percentToIndex(exercises.length, 0.5);

    return exercises.flatMap((e, index) =>
      index === middleIndex ? [yourBreak, e] : e
    );
  }

  const oneThirdIndex = percentToIndex(exercises.length, 0.33);
  const twoThirdsIndex = percentToIndex(exercises.length, 0.66);

  return exercises.flatMap((e, index) =>
    index === oneThirdIndex || index === twoThirdsIndex ? [yourBreak, e] : e
  );
};

const exercises: Entry[] = [
  {
    name: 'Double-leg stretches',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Hip dips',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Leg raises',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Bicycles',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Criss-cross',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Ab circles',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Straddle crunches',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Pike presses',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Patty cakes',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Tailbone crunches',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Crunches',
    audioFiles: [],
    type: 'exercise'
  },
  {
    name: 'Reverse crunches',
    audioFiles: [],
    type: 'exercise'
  }
];
