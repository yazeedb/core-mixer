/**
 * Simplified, non-mutative version of the shuffle-array npm package
 * https://www.npmjs.com/package/shuffle-array
 */
export const shuffleArray = <T>(arr: T[]): T[] => {
  const collection = [...arr];

  let len = arr.length;
  let random;
  let temp;

  while (len) {
    random = Math.floor(Math.random() * len);
    len -= 1;
    temp = collection[len];
    collection[len] = collection[random];
    collection[random] = temp;
  }

  return collection;
};

export const percentToIndex = (arrayLength: number, percentage: number) =>
  Math.floor((arrayLength - 1) * percentage);

export const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick30or60Seconds = () => (Math.random() > 0.5 ? 30 : 60);

export const getRandomItem = <T>(array: T[]): T =>
  array[getRandomInt(0, array.length - 1)];

export const take = <T>(n: number, array: T[]) => array.slice(0, n);
