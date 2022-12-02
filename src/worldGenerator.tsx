export type WorldMatrix = Array<Array<WorldSquare>>;

export type WorldSquare = 0 | 1 | 2 | 3;
export const SQUARE_GRASS = 0;
export const SQUARE_TREE = 1;
export const SQUARE_DIRT = 2;
export const SQUARE_ROCK = 3;

const determineSquare = () => {
  const randomNum = Math.random();
  if (randomNum > 0 && randomNum < .03) {
    return SQUARE_TREE;
  } else if (randomNum > .03 && randomNum < .04) {
    return SQUARE_DIRT;
  } else if (randomNum > .04 && randomNum < .06) {
    return SQUARE_ROCK;
  } else {
    return SQUARE_GRASS;
  }
}

export const generateWorldMatrix = (): WorldMatrix => {
  const world: Array<Array<WorldSquare>> = [];
  for (let i = 0; i < 100; i++) {
    world.push([]);
    for (let j = 0; j < 100; j++) {
      world[i].push(determineSquare());
    }
  }
  return world;
};
