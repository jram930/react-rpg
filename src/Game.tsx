import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { css } from '@emotion/css';
import { GRASS, DIRT, TREE, ROCK } from './colors';
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

// 222831
// 393E46
// D65A31
// EEEEEE

type KeyPress = {
  key: string;
};

export const Game = () => {

  const boardStyle = css({
    backgroundColor: DIRT,
    marginLeft: '20px',
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

  const [currentBoardX, setCurrentBoardX] =
    React.useState<number>(STARTING_BOARD_X);
  const [currentBoardY, setCurrentBoardY] =
    React.useState<number>(STARTING_BOARD_Y);

  const [playerX, setPlayerX] = React.useState<number>(0);
  const [playerY, setPlayerY] = React.useState<number>(0);

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
    setDialogue(`Board ${currentBoardX} ${currentBoardY}`);
  }, [currentBoardX, currentBoardY]);

  const handleKeyDown = (keyPress: KeyPress) => {
    const { key } = keyPress;
    switch (key) {
      case 'a':
        if (playerX > 0) {
          setPlayerX(playerX - TILE_SIZE);
        } else if (currentBoardX > 0) {
          setCurrentBoardX(currentBoardX - 1);
          setPlayerX(BOARD_WIDTH - TILE_SIZE);
        }
        break;
      case 'd':
        if (playerX < boardWidth - (TILE_SIZE * 2)) {
          setPlayerX(playerX + TILE_SIZE);
        } else if (currentBoardX < WORLD_WIDTH - 1) {
          setCurrentBoardX(currentBoardX + 1);
          setPlayerX(0);
        }
        break;
      case 's':
        if (playerY < BOARD_HEIGHT - TILE_SIZE) {
          setPlayerY(playerY + TILE_SIZE);
        } else if (currentBoardY < WORLD_HEIGHT - 1) {
          setCurrentBoardY(currentBoardY + 1);
          setPlayerY(0);
        }
        break;
      case 'w':
        if (playerY > 0) {
          setPlayerY(playerY - TILE_SIZE);
        } else if (currentBoardY > 0) {
          setCurrentBoardY(currentBoardY - 1);
          setPlayerY(BOARD_HEIGHT - TILE_SIZE);
        }
        break;
      default:
      // do nothing
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

  const translateNumToColor = (num: WorldSquare) => {
    switch (num) {
      case SQUARE_GRASS:
        return GRASS;
      case SQUARE_TREE:
        return TREE;
      case SQUARE_ROCK:
        return ROCK;
      case SQUARE_DIRT:
        return DIRT;
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
    return generateWorldTiles(currentBoardX, currentBoardY);
  }, [worldMatrix, currentBoardX, currentBoardY]);

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
            <Rect
              width={TILE_SIZE}
              height={TILE_SIZE}
              x={playerX}
              y={playerY}
              fill="#D65A31" />
          </Layer>
        </Stage>
      </div>
      <div className={dialogueBoxStyle}>
        <p>{dialogue}</p>
      </div>
    </>
  );
};