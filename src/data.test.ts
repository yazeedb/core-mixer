import { generateWorkout } from './data';

describe('generateWorkout', () => {
  it('generates 5-7 exercises, with 1 break', () => {
    const fiftyWorkouts = Array.from({ length: 50 }, generateWorkout);

    fiftyWorkouts.forEach((workout) => {
      const exerciseCount = workout.reduce(
        (total, item) => (item.type === 'timedExercise' ? total + 1 : total),
        0
      );

      const restPeriodCount = workout.reduce(
        (total, item) => (item.type === 'restPeriod' ? total + 1 : total),
        0
      );

      expect(exerciseCount >= 5 && exerciseCount <= 7).toBe(true);
      expect(restPeriodCount).toBe(1);
    });
  });
});
