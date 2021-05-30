import { getRandomInt, percentToIndex, shuffleArray, take } from './utils';
import { v4 } from 'uuid';
import { UserPreferences } from './workoutMachine';

export type DurationMs = 30000 | 60000;

export enum Difficulty {
  beginner = 1,
  intermediate = 2,
  advanced = 3
}

interface Segment {
  id: string;
  name: string;
  audioFile: string;
  videoDemoUrl: string;
  imageUrl: string;
}

interface Exercise extends Segment {
  difficulty: Difficulty;
}

interface TimedExercise extends Exercise {
  type: 'timedExercise';
  duration: DurationMs;
}

interface RestPeriod extends Segment {
  type: 'restPeriod';
  duration: 30000;
}

export type WorkoutItem = TimedExercise | RestPeriod;

export type Workout = WorkoutItem[];

export const printDifficulty = (d: Difficulty) => {
  switch (d) {
    case Difficulty.beginner:
      return 'beginner';

    case Difficulty.intermediate:
      return 'intermediate';

    case Difficulty.advanced:
      return 'advanced';
  }
};

export type CoachName = 'military'; // | 'fitness' <-- TODO: Add this one Sean Vigue's files are ready

const findAppropriateExercises = (difficulty: Difficulty): Exercise[] => {
  const shuffledExercises = shuffleArray(exercises);

  const beginnerExercises = shuffledExercises.filter(
    (e) => e.difficulty === Difficulty.beginner
  );

  const intermediateExercises = shuffledExercises.filter(
    (e) => e.difficulty === Difficulty.intermediate
  );

  const advancedExercises = shuffledExercises.filter(
    (e) => e.difficulty === Difficulty.advanced
  );

  const oneOrTwo = getRandomInt(1, 2);

  switch (difficulty) {
    case Difficulty.beginner:
      return [
        ...take(5, beginnerExercises),
        ...take(oneOrTwo, intermediateExercises)
      ];

    case Difficulty.intermediate:
      return [
        ...take(1, beginnerExercises),
        ...take(4, intermediateExercises),
        ...take(oneOrTwo, advancedExercises)
      ];

    case Difficulty.advanced:
      return [
        ...take(oneOrTwo, intermediateExercises),
        ...take(6, advancedExercises)
      ];
  }
};

export const generateWorkout = (preferences: UserPreferences): Workout => {
  const randomExercises = shuffleArray(
    findAppropriateExercises(preferences.difficulty)
  );

  const restPeriod: RestPeriod = {
    id: v4(),
    type: 'restPeriod',
    name: 'Rest',
    audioFile: `./audio/${preferences.coachName}/30-sec-rest.mp3`,
    videoDemoUrl: './goku-situps.jpeg',
    imageUrl: './goku-situps.jpeg',
    duration: 30000
  };

  const oneThirdIndex = percentToIndex(randomExercises.length, 0.33);
  const halfwayIndex = percentToIndex(randomExercises.length, 0.5);
  const twoThirdsIndex = percentToIndex(randomExercises.length, 0.66);

  return randomExercises.flatMap<WorkoutItem>((e, index) => {
    const timedExercise: TimedExercise = {
      ...e,
      type: 'timedExercise',
      duration: Math.random() > 0.85 ? 30000 : 60000,
      audioFile: `./audio/${preferences.coachName}/${nameToFile(e.name)}.mp3`
    };

    switch (preferences.difficulty) {
      case Difficulty.beginner:
      case Difficulty.intermediate:
        return index === oneThirdIndex || index === twoThirdsIndex
          ? [
              {
                ...restPeriod,
                // Prevent duplicate IDs between the two rest periods
                id: v4()
              },
              timedExercise
            ]
          : timedExercise;

      case Difficulty.advanced:
        return index === halfwayIndex
          ? [restPeriod, timedExercise]
          : timedExercise;
    }
  });
};

const nameToFile = (name: string) => name.toLowerCase().split(' ').join('-');

const exercises: Exercise[] = [
  {
    id: v4(),
    name: 'Double-leg stretches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Hip dips',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Leg raises',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Bicycles',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Criss-cross',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Ab circles',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Straddle crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Twisting crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Scissor crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Elbow criss-cross',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'V ups',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Hollow holds',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Russian twists',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'High leg lifts',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Low leg lifts',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Pike presses',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Patty cakes',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Tailbone crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Reverse crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Dragon flags',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Planks',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Screen-door planks',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Side planks',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Dead bugs',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Mountain climbers',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Advanced criss-cross',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Boat roll-ups',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Crunches legs raised',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Plow leg lifts',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Reverse bicycles',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Bird dogs',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Walk-out planks',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Alternating leg lifts',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Flutter kick crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Flutter kicks',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'L Sits',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Starfish crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'X Man crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    id: v4(),
    name: 'Russian V-tuck twists',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  }
];
