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
  WORLD_WIDTH,
  WORLD_HEIGHT
} from './worldGenerator';
import { useInterval } from './util';

// 222831
// 393E46
// D65A31
// EEEEEE

type KeyPress = {
  key: string;
};

type WorldCoordinate = {
  boardX: number,
  boardY: number,
  x: number,
  y: number,
}

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

  const [playerCurrentBoardX, setPlayerCurrentBoardX] =
    React.useState<number>(STARTING_BOARD_X);
  const [playerCurrentBoardY, setPlayerCurrentBoardY] =
    React.useState<number>(STARTING_BOARD_Y);
  const [playerX, setPlayerX] = React.useState<number>(0);
  const [playerY, setPlayerY] = React.useState<number>(0);

  const [enemyCurrentBoardX, setEnemyCurrentBoardX] =
    React.useState<number>(STARTING_BOARD_X);
  const [enemyCurrentBoardY, setEnemyCurrentBoardY] =
    React.useState<number>(STARTING_BOARD_Y);
  const [enemyX, setEnemyX] = React.useState<number>(10 * TILE_SIZE);
  const [enemyY, setEnemyY] = React.useState<number>(0);

  const boardRef = React.useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = React.useState<number>(0);

  const [dialogue, setDialogue] = React.useState<string>(`Loading...`);

  React.useEffect(() => {
    setWorldMatrix(generateWorldMatrix());
  }, []);

  // TODO: This works if you don't resize the window, need to figure that out
  React.useEffect(() => {
    const boardElement = boardRef.current;
    setBoardWidth(boardElement?.offsetWidth ?? 0);
  }, []);

  React.useEffect(() => {
    setDialogue(`Board ${playerCurrentBoardX} ${playerCurrentBoardY}`);
  }, [playerCurrentBoardX, playerCurrentBoardY]);

  const moveLeft = (startCoordinate: WorldCoordinate): WorldCoordinate => {
    if (!worldMatrix) {
      return startCoordinate;
    }

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

  const moveRight = (startCoordinate: WorldCoordinate): WorldCoordinate => {
    if (!worldMatrix) {
      return startCoordinate;
    }

    const { x, y, boardX, boardY } = startCoordinate;
    const endCoordinate: WorldCoordinate = { x, y, boardX, boardY };

    if (x < boardWidth - (TILE_SIZE * 2)) {
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

  const moveDown = (startCoordinate: WorldCoordinate): WorldCoordinate => {
    if (!worldMatrix) {
      return startCoordinate;
    }

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

  const moveUp = (startCoordinate: WorldCoordinate): WorldCoordinate => {
    if (!worldMatrix) {
      return startCoordinate;
    }

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

  const handleKeyDown = (keyPress: KeyPress) => {
    if (worldMatrix) {
      const { key } = keyPress;
      switch (key) {
        case 'a':
          {
            const nextPosition = moveLeft({ x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
            setPlayerX(nextPosition.x);
            setPlayerCurrentBoardX(nextPosition.boardX);
            break;
          }
        case 'd':
          {
            const nextPosition = moveRight({ x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
            setPlayerX(nextPosition.x);
            setPlayerCurrentBoardX(nextPosition.boardX);
            break;
          }
        case 's':
          {
            const nextPosition = moveDown({ x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
            setPlayerY(nextPosition.y);
            setPlayerCurrentBoardY(nextPosition.boardY);
            break;
          }
        case 'w':
          {
            const nextPosition = moveUp({ x: playerX, y: playerY, boardX: playerCurrentBoardX, boardY: playerCurrentBoardY });
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
    const random = Math.random();
    if (random < 0.25) {
      console.log('left');
      const nextPosition = moveLeft({ x: enemyX, y: enemyY, boardX: enemyCurrentBoardX, boardY: enemyCurrentBoardY });
      setEnemyX(nextPosition.x);
      setEnemyCurrentBoardX(nextPosition.boardX);
    } else if (random < 0.5) {
      console.log('right');
      const nextPosition = moveRight({ x: enemyX, y: enemyY, boardX: enemyCurrentBoardX, boardY: enemyCurrentBoardY });
      setEnemyX(() => nextPosition.x);
      setEnemyCurrentBoardX(() => nextPosition.boardX);
    } else if (random < 0.75) {
      console.log('up');
      const nextPosition = moveUp({ x: enemyX, y: enemyY, boardX: enemyCurrentBoardX, boardY: enemyCurrentBoardY });
      setEnemyY(() => nextPosition.y);
      setEnemyCurrentBoardY(() => nextPosition.boardY);
    } else {
      console.log('down');
      const nextPosition = moveDown({ x: enemyX, y: enemyY, boardX: enemyCurrentBoardX, boardY: enemyCurrentBoardY });
      setEnemyY(() => nextPosition.y);
      setEnemyCurrentBoardY(() => nextPosition.boardY);
    }
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

  const enemyOnPlayerBoard = playerCurrentBoardX === enemyCurrentBoardX && playerCurrentBoardY === enemyCurrentBoardY;

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
        <Stage width={boardWidth - 2} height={BOARD_HEIGHT}>
          <Layer>
            {worldTiles}
          </Layer>
          <Layer>
            {enemyOnPlayerBoard && <Rect
              width={TILE_SIZE}
              height={TILE_SIZE}
              x={enemyX}
              y={enemyY}
              fill={COLOR_ENEMY} />}
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
      </div>
    </>
  );
};