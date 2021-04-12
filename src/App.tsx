import {
  getRandomInt,
  percentToIndex,
  pick30or60Seconds,
  shuffleArray
} from './utils';

export const App = () => {
  return <div>hello world</div>;
};

interface Exercise {
  name: string;
  audioFiles: string[];
  leftAndRight?: boolean;
}

interface Break extends Exercise {
  name: '30 second rest';
}

interface TimedExercise extends Exercise {
  seconds: 30 | 60;
  shouldChangeDirection?: boolean;
}

type Workout = (TimedExercise | Break)[];

const withInterspersedBreaks = (exercises: TimedExercise[]): Workout => {
  const numberOfBreaks = getRandomInt(1, 2);
  const yourBreak: Break = { name: '30 second rest', audioFiles: [] };

  if (numberOfBreaks === 1) {
    const middleIndex = percentToIndex(exercises.length, 0.5);

    return exercises.flatMap((e, index) =>
      index === middleIndex ? [e, yourBreak] : e
    );
  }

  const oneThirdIndex = percentToIndex(exercises.length, 0.33);
  const twoThirdsIndex = percentToIndex(exercises.length, 0.66);

  return exercises.flatMap((e, index) =>
    index === oneThirdIndex || index === twoThirdsIndex ? [e, yourBreak] : e
  );
};

const generateWorkout = (): Workout => {
  const shuffledExercises = shuffleArray(exercises);
  const yourExercises: TimedExercise[] = [];

  let index = 0;
  let targetSecondsNoBreaks = getRandomInt(270, 450);

  while (targetSecondsNoBreaks > 0) {
    const thirtySecondsLeft = targetSecondsNoBreaks === 30;
    const seconds = thirtySecondsLeft ? 30 : pick30or60Seconds();
    let nextExercise = shuffledExercises[index];

    // We can't have twin exercises if the next
    // exercise drains the remaining time
    if (seconds >= targetSecondsNoBreaks && nextExercise.leftAndRight) {
      while (nextExercise.leftAndRight) {
        nextExercise = shuffledExercises[index++];
      }
    }

    const timedExercise: TimedExercise = {
      ...nextExercise,
      seconds
    };

    yourExercises.push(timedExercise);

    if (timedExercise.leftAndRight) {
      yourExercises.push({
        ...timedExercise,
        shouldChangeDirection: true
      });

      targetSecondsNoBreaks -= seconds;
    }

    index++;
    targetSecondsNoBreaks -= seconds;
  }

  return withInterspersedBreaks(yourExercises);
};

const exercises: Exercise[] = [
  {
    name: 'Double-leg stretches',
    audioFiles: []
  },
  {
    name: 'Hip dips',
    audioFiles: []
  },
  {
    name: 'Crunches',
    audioFiles: []
  },
  {
    name: 'Leg raises',
    audioFiles: []
  },
  {
    name: 'Bicycles',
    audioFiles: [],
    leftAndRight: true
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
