import {
  TILES_ACROSS, TILES_TALL,
  TILE_SIZE, WorldCoordinate, WorldMatrix, WORLD_HEIGHT, WORLD_WIDTH
} from "./worldGenerator";
import { randomIntFromInterval } from './util';
import { moveDown, moveLeft, moveRight, moveUp } from "./movement";

export const generateEnemies = (): Array<WorldCoordinate> => {
  const enemies: Array<WorldCoordinate> = [];
  for (let i = 0; i < 10000; i++) {
    enemies.push({
      boardX: randomIntFromInterval(0, WORLD_WIDTH - 1),
      boardY: randomIntFromInterval(0, WORLD_HEIGHT - 1),
      x: randomIntFromInterval(0, TILES_ACROSS - 1) * TILE_SIZE,
      y: randomIntFromInterval(0, TILES_TALL - 1) * TILE_SIZE,
    });
  }
  return enemies;
}

export const moveAllEnemies = (worldMatrix: WorldMatrix, enemies: Array<WorldCoordinate>): Array<WorldCoordinate> => {
  enemies.forEach((enemy) => {
    const random = Math.random();
    if (random < 0.25) {
      const nextPosition = moveLeft(worldMatrix, { x: enemy.x, y: enemy.y, boardX: enemy.boardX, boardY: enemy.boardY });
      enemy.x = nextPosition.x;
      enemy.boardX = nextPosition.boardX;
    } else if (random < .5) {
      const nextPosition = moveRight(worldMatrix, { x: enemy.x, y: enemy.y, boardX: enemy.boardX, boardY: enemy.boardY });
      enemy.x = nextPosition.x;
      enemy.boardX = nextPosition.boardX;
    } else if (random < .75) {
      const nextPosition = moveUp(worldMatrix, { x: enemy.x, y: enemy.y, boardX: enemy.boardX, boardY: enemy.boardY });
      enemy.y = nextPosition.y;
      enemy.boardY = nextPosition.boardY;
    } else {
      const nextPosition = moveDown(worldMatrix, { x: enemy.x, y: enemy.y, boardX: enemy.boardX, boardY: enemy.boardY });
      enemy.y = nextPosition.y;
      enemy.boardY = nextPosition.boardY;
    }
  });
  return enemies;
};