import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { css } from '@emotion/css';
import { COLOR_GRASS, COLOR_DIRT, COLOR_TREE, COLOR_ROCK, COLOR_ENEMY, COLOR_PLAYER } from './colors';
import {
  generateWorldMatrix,
  SQUARE_GRASS,
  SQUARE_TREE,
  WorldSquare,
  SQUARE_ROCK,
  SQUARE_DIRT,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TILE_SIZE,
  WorldMatrix,
  STARTING_BOARD_X,
  STARTING_BOARD_Y,
  WorldCoordinate,
} from './worldGenerator';
import { useInterval } from './util';
import { moveLeft, moveRight, moveUp, moveDown } from './movement';
import { generateEnemies, moveAllEnemies } from './enemies';

// 222831
// 393E46
// D65A31
// EEEEEE

type KeyPress = {
  key: string;
};

export const Game = () => {

  const boardStyle = css({
    backgroundColor: COLOR_DIRT,
    marginLeft: '30px',
    marginTop: '20px',
    width: `${BOARD_WIDTH}px`,
    height: `${BOARD_HEIGHT}px`,
    border: '1px solid black',
    minWidth: '1000px',
  });

  const dialogueBoxStyle = css({
    width: 'calc(100% - 600px)',
    border: '1px solid black',
    height: '100px',
    marginTop: '20px',
    marginLeft: '300px',
    color: '#D65A31',
    fontFamily: 'Courier New, monospace',
    paddingTop: '10px',
    paddingLeft: '30px',
    paddingRight: '30px',
    textAlign: 'center',
    fontWeight: 50,
    fontSize: 16,
  });

  const [worldMatrix, setWorldMatrix] =
    React.useState<WorldMatrix | null>(null);
  const [enemies, setEnemies] = React.useState<Array<WorldCoordinate>>([]);

  const [playerCurrentBoardX, setPlayerCurrentBoardX] =
    React.useState<number>(STARTING_BOARD_X);
  const [playerCurrentBoardY, setPlayerCurrentBoardY] =
    React.useState<number>(STARTING_BOARD_Y);
  const [playerX, setPlayerX] = React.useState<number>(0);
  const [playerY, setPlayerY] = React.useState<number>(0);

  const [tick, setTick] = React.useState<number>(0);

  const boardRef = React.useRef<HTMLDivElement>(null);

  const [dialogue, setDialogue] = React.useState<string>(`Loading...`);

  React.useEffect(() => {
    setWorldMatrix(generateWorldMatrix());
    setEnemies(generateEnemies());
  }, []);

  React.useEffect(() => {
    setDialogue(`Board ${playerCurrentBoardX} ${playerCurrentBoardY}`);
  }, [playerCurrentBoardX, playerCurrentBoardY]);

  const handleKeyDown = (keyPress: KeyPress) => {
    if (worldMatrix) {
      const { key } = keyPress;
      switch (key) {
        case 'a':
          {
            const nextPosition = moveLeft(worldMatrix, { x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
            setPlayerX(nextPosition.x);
            setPlayerCurrentBoardX(nextPosition.boardX);
            break;
          }
        case 'd':
          {
            const nextPosition = moveRight(worldMatrix, { x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
            setPlayerX(nextPosition.x);
            setPlayerCurrentBoardX(nextPosition.boardX);
            break;
          }
        case 's':
          {
            const nextPosition = moveDown(worldMatrix, { x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
            setPlayerY(nextPosition.y);
            setPlayerCurrentBoardY(nextPosition.boardY);
            break;
          }
        case 'w':
          {
            const nextPosition = moveUp(worldMatrix, { x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
            setPlayerY(nextPosition.y);
            setPlayerCurrentBoardY(nextPosition.boardY);
            break;
          }
        default:
        // do nothing
      }
    }
  };

  const createTile = (
    x: number,
    y: number,
    fill: string,
    size = TILE_SIZE) => {
    return (<Rect
      key={`x${x}_y${y}`}
      x={x}
      y={y}
      width={size}
      height={size}
      fill={fill} />);
  }

  useInterval(() => {
    if (worldMatrix) {
      moveAllEnemies(worldMatrix, enemies);
    }
    setTick(tick + 1);
  }, 300);

  const translateNumToColor = (num: WorldSquare) => {
    switch (num) {
      case SQUARE_GRASS:
        return COLOR_GRASS;
      case SQUARE_TREE:
        return COLOR_TREE;
      case SQUARE_ROCK:
        return COLOR_ROCK;
      case SQUARE_DIRT:
        return COLOR_DIRT;
    }
  }

  const generateEnemyTiles = () => {
    const tiles: Array<JSX.Element> = [];

    enemies.forEach((enemy) => {
      if (enemy.boardX === playerCurrentBoardX && enemy.boardY === playerCurrentBoardY) {
        tiles.push(createTile(
          enemy.x,
          enemy.y,
          COLOR_ENEMY,
          TILE_SIZE,
        ));
      }
    });

    return tiles;
  }

  const generateWorldTiles = (boardX: number, boardY: number) => {
    const tiles = [];
    if (worldMatrix) {
      const boardMatrix = worldMatrix[boardX][boardY];
      for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
          tiles.push(createTile(
            j * TILE_SIZE,
            i * TILE_SIZE,
            translateNumToColor(boardMatrix[i][j]),
            TILE_SIZE,
          ));
        }
      }
    }
    return tiles;
  }

  const worldTiles = React.useMemo(() => {
    return generateWorldTiles(playerCurrentBoardX, playerCurrentBoardY);
  }, [worldMatrix, playerCurrentBoardX, playerCurrentBoardY]);

  return (
    // Stage - is a div wrapper
    // Layer - is an actual 2d canvas element, so you can have several layers
    // inside the stage
    // Rect and Circle are not DOM elements. They are 2d shapes on canvas
    <>
      <div
        tabIndex={1}
        onKeyDown={handleKeyDown}
        className={boardStyle}
        ref={boardRef}>
        <Stage width={BOARD_WIDTH - 2} height={BOARD_HEIGHT}>
          <Layer>
            {worldTiles}
          </Layer>
          <Layer>
            {generateEnemyTiles()}
          </Layer>
          <Layer>
            <Rect
              width={TILE_SIZE}
              height={TILE_SIZE}
              x={playerX}
              y={playerY}
              fill={COLOR_PLAYER} />
          </Layer>
        </Stage>
      </div>
      <div className={dialogueBoxStyle}>
        <p>{dialogue}</p>
        <p>{tick}</p>
      </div>
    </>
  );
};