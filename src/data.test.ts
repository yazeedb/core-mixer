import {
  generateWorkout,
  MAX_SECONDS_WITH_BREAKS,
  MIN_SECONDS_WITH_BREAKS,
  Workout
} from './data';

describe('generateWorkout', () => {
  it(`
    * Total time is between 5-8.5 minutes
    * There are 1 or 2 breaks
    * The break is never first or last

  `, () => {
    const oneThousandResults = Array.from({ length: 1000 }, generateWorkout);

    const allValid = oneThousandResults.every(
      (r) =>
        breakIsNotFirstOrLast(r) && hasOneOrTwoBreaks(r) && hasValidTotalTime(r)
    );

    expect(allValid).toBe(true);
  });
});

const breakIsNotFirstOrLast = (w: Workout) => {
  const firstItem = w[0];
  const lastItem = w[w.length - 1];

  return firstItem.type !== 'break' && lastItem.type !== 'break';
};

const hasValidTotalTime = (w: Workout) => {
  const totalSeconds = w.reduce((a, b) => a + b.seconds, 0);

  return (
    MIN_SECONDS_WITH_BREAKS <= totalSeconds &&
    totalSeconds <= MAX_SECONDS_WITH_BREAKS
  );
};

const hasOneOrTwoBreaks = (w: Workout) => {
  const breaksCount = w.reduce(
    (total, item) => (item.type === 'break' ? total + 1 : total),
    0
  );

  return breaksCount === 1 || breaksCount === 2;
};
