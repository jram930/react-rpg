import {
  SQUARE_GRASS,
  SQUARE_DIRT,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TILE_SIZE,
  WorldMatrix,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WorldCoordinate,
} from './worldGenerator';

export const moveLeft = (worldMatrix: WorldMatrix, startCoordinate: WorldCoordinate): WorldCoordinate => {
  const { x, y, boardX, boardY } = startCoordinate;
  const endCoordinate: WorldCoordinate = { x, y, boardX, boardY };

  if (x > 0) {
    const nextSquare = worldMatrix[boardX][boardY][y / TILE_SIZE][(x - TILE_SIZE) / TILE_SIZE];
    if (nextSquare === SQUARE_DIRT || nextSquare === SQUARE_GRASS) {
      endCoordinate.x = x - TILE_SIZE;
    }
  } else if (boardX > 0) {
    endCoordinate.boardX = boardX - 1;
    endCoordinate.x = BOARD_WIDTH - TILE_SIZE;
  }
  return endCoordinate;
}

export const moveRight = (worldMatrix: WorldMatrix, startCoordinate: WorldCoordinate): WorldCoordinate => {
  const { x, y, boardX, boardY } = startCoordinate;
  const endCoordinate: WorldCoordinate = { x, y, boardX, boardY };

  if (x < BOARD_WIDTH - (TILE_SIZE * 2)) {
    const nextSquare = worldMatrix[boardX][boardY][y / TILE_SIZE][(x + TILE_SIZE) / TILE_SIZE];
    if (nextSquare === SQUARE_DIRT || nextSquare === SQUARE_GRASS) {
      endCoordinate.x = x + TILE_SIZE;
    }
  } else if (boardX < WORLD_WIDTH - 1) {
    endCoordinate.boardX = boardX + 1;
    endCoordinate.x = 0;
  }
  return endCoordinate;
}

export const moveDown = (worldMatrix: WorldMatrix, startCoordinate: WorldCoordinate): WorldCoordinate => {
  const { x, y, boardX, boardY } = startCoordinate;
  const endCoordinate: WorldCoordinate = { x, y, boardX, boardY };

  if (y < BOARD_HEIGHT - TILE_SIZE) {
    const nextSquare = worldMatrix[boardX][boardY][(y + TILE_SIZE) / TILE_SIZE][x / TILE_SIZE];
    if (nextSquare === SQUARE_DIRT || nextSquare === SQUARE_GRASS) {
      endCoordinate.y = y + TILE_SIZE;
    }
  } else if (boardY < WORLD_HEIGHT - 1) {
    endCoordinate.boardY = boardY + 1;
    endCoordinate.y = 0;
  }
  return endCoordinate;
}

export const moveUp = (worldMatrix: WorldMatrix, startCoordinate: WorldCoordinate): WorldCoordinate => {
  const { x, y, boardX, boardY } = startCoordinate;
  const endCoordinate: WorldCoordinate = { x, y, boardX, boardY };

  if (y > 0) {
    const nextSquare = worldMatrix[boardX][boardY][(y - TILE_SIZE) / TILE_SIZE][x / TILE_SIZE];
    if (nextSquare === SQUARE_DIRT || nextSquare === SQUARE_GRASS) {
      endCoordinate.y = y - TILE_SIZE;
    }
  } else if (boardY > 0) {
    endCoordinate.boardY = boardY - 1;
    endCoordinate.y = BOARD_HEIGHT - TILE_SIZE;
  }
  return endCoordinate;
}