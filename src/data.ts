import { getRandomInt, percentToIndex, shuffleArray } from './utils';

export type DurationMs = 30000 | 60000;

export enum Difficulty {
  beginner = 1,
  intermediate = 2,
  advanced = 3
}

interface Segment {
  name: string;
  audioFiles: string[];
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

export const generateWorkout = (): Workout => {
  const randomExercises = shuffleArray(exercises).slice(0, getRandomInt(5, 7));

  const restPeriod: RestPeriod = {
    type: 'restPeriod',
    name: 'Rest',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    imageUrl: '/goku-situps.jpeg',
    duration: 30000
  };

  const halfwayIndex = percentToIndex(randomExercises.length, 0.5);

  return randomExercises.flatMap<WorkoutItem>((e, index) => {
    const timedExercise: TimedExercise = {
      ...e,
      type: 'timedExercise',
      duration: Math.random() > 0.85 ? 30000 : 60000
    };

    return index === halfwayIndex ? [restPeriod, timedExercise] : timedExercise;
  });
};

const exercises: Exercise[] = [
  {
    name: 'Double-leg stretches',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Hip dips',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Leg raises',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Bicycles',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Criss-cross',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Ab circles',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Straddle crunches',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Pike presses',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Patty cakes',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Tailbone crunches',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Crunches',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Reverse crunches',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Dragon Flags',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Screen-door planks',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Dead bugs',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Mountain climbers',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Advanced Criss-cross',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Boat roll-ups',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Crunches (legs raised)',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Plow leg lifts',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Reverse bicycles',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Walk-out planks',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Alternating leg lifts',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Flutter-kick crunches',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: '/goku-situps.jpeg'
  },
  {
    name: 'Windshield wipers',
    audioFiles: [],
    videoDemoUrl: '/goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: '/goku-situps.jpeg'
  }
];
