import { getRandomInt, percentToIndex, shuffleArray } from './utils';

export type DurationMs = 30000 | 60000;

export enum Difficulty {
  beginner = 1,
  intermediate = 2,
  advanced = 3
}

interface Segment {
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

export const generateWorkout = (): Workout => {
  const randomExercises = shuffleArray(exercises).slice(0, getRandomInt(5, 7));

  const restPeriod: RestPeriod = {
    type: 'restPeriod',
    name: 'Rest',
    audioFile: './audio/30-seconds-rest.mp3',
    videoDemoUrl: './goku-situps.jpeg',
    imageUrl: './goku-situps.jpeg',
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

const nameToMp3File = (name: string) => name.toLowerCase().split(' ').join('-');

const exercises: Exercise[] = [
  {
    name: 'Double-leg stretches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Hip dips',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Leg raises',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Bicycles',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Criss-cross',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Ab circles',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Straddle crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Pike presses',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Patty cakes',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Tailbone crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.beginner,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Reverse crunches',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.intermediate,
    imageUrl: './goku-situps.jpeg'
  },
  {
    name: 'Dragon Flags',
    audioFile: '',
    videoDemoUrl: './goku-situps.jpeg',
    difficulty: Difficulty.advanced,
    imageUrl: './goku-situps.jpeg'
  }

  // TODO: Re-add these exercises once audio/video's recorded
  // {
  //   name: 'Screen-door planks',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.intermediate,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Dead bugs',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.beginner,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Mountain climbers',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.beginner,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Advanced Criss-cross',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.advanced,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Boat roll-ups',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.advanced,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Crunches (legs raised)',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.advanced,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Plow leg lifts',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.advanced,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Reverse bicycles',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.intermediate,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Walk-out planks',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.intermediate,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Alternating leg lifts',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.beginner,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Flutter-kick crunches',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.advanced,
  //   imageUrl: './goku-situps.jpeg'
  // },
  // {
  //   name: 'Windshield wipers',
  // audioFile: '',
  //   videoDemoUrl: './goku-situps.jpeg',
  //   difficulty: Difficulty.intermediate,
  //   imageUrl: './goku-situps.jpeg'
  // }
].map<Exercise>((e) => ({
  ...e,
  audioFile: `./audio/${nameToMp3File(e.name)}.mp3`
}));

console.log(exercises);
