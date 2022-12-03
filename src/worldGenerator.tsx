export type WorldMatrix = Array<Array<BoardMatrix>>;
export type BoardMatrix = Array<Array<WorldSquare>>;

export type WorldSquare = 0 | 1 | 2 | 3;
export const SQUARE_GRASS = 0;
export const SQUARE_TREE = 1;
export const SQUARE_DIRT = 2;
export const SQUARE_ROCK = 3;

export const TILE_SIZE = 30;
export const TILES_ACROSS = 62;
export const TILES_TALL = 26;
export const BOARD_HEIGHT = TILE_SIZE * TILES_TALL;
export const BOARD_WIDTH = TILE_SIZE * TILES_ACROSS;
export const WORLD_WIDTH = 100;
export const WORLD_HEIGHT = 100;
export const STARTING_BOARD_X = WORLD_WIDTH / 2;
export const STARTING_BOARD_Y = WORLD_HEIGHT / 2;

const determineSquare = (x: number, y: number) => {
  if (x === 0 || y === 0 || x === TILES_TALL - 1 || y === TILES_ACROSS - 1) {
    return SQUARE_GRASS;
  }

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

const generateBoard = (): BoardMatrix => {
  const board: Array<Array<WorldSquare>> = [];
  for (let i = 0; i < TILES_TALL; i++) {
    board.push([]);
    for (let j = 0; j < TILES_ACROSS; j++) {
      board[i].push(determineSquare(i, j));
    }
  }
  return board;
};

export const generateWorldMatrix = (): WorldMatrix => {
  const world: Array<Array<BoardMatrix>> = [];
  for (let i = 0; i < WORLD_HEIGHT; i++) {
    world.push([]);
    for (let j = 0; j < WORLD_WIDTH; j++) {
      world[i].push(generateBoard());
    }
  }
  return world;
}
