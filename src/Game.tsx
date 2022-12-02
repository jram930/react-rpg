import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { css } from '@emotion/css';
import { GRASS, DIRT, TREE, ROCK } from './colors';
import {
  WorldMatrix,
  generateWorldMatrix,
  SQUARE_GRASS,
  SQUARE_TREE,
  WorldSquare,
  SQUARE_ROCK,
  SQUARE_DIRT
} from './worldGenerator';

// 222831
// 393E46
// D65A31
// EEEEEE

type KeyPress = {
  key: string;
};

export const Game = () => {

  const BOARD_HEIGHT = 800;
  const PLAYER_DIMENSION = 30;
  const TILE_SIZE = 30;

  const boardStyle = css({
    backgroundColor: DIRT,
    marginLeft: '20px',
    marginTop: '20px',
    width: 'calc(100% - 40px)',
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

  const [playerX, setPlayerX] = React.useState<number>(0);
  const [playerY, setPlayerY] = React.useState<number>(0);

  const boardRef = React.useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = React.useState<number>(0);

  const [dialogue, setDialogue] = React.useState<string>(`Some text
  about the adventure can go here. If it is really long text it
  should be displayed in a visually ok kind of way.`);

  React.useEffect(() => {
    setWorldMatrix(generateWorldMatrix());
  }, []);

  // TODO: This works if you don't resize the window, need to figure that out
  React.useEffect(() => {
    const boardElement = boardRef.current;
    setBoardWidth(boardElement?.offsetWidth ?? 0);
  }, []);

  const handleKeyDown = (keyPress: KeyPress) => {
    const { key } = keyPress;
    switch (key) {
      case 'a':
        setPlayerX(playerX > 0 ? playerX - TILE_SIZE : playerX);
        setDialogue('You move to the left');
        break;
      case 'd':
        setPlayerX(playerX < boardWidth - PLAYER_DIMENSION ?
          playerX + TILE_SIZE :
          playerX);
        setDialogue('You move to the right');
        break;
      case 's':
        setPlayerY(playerY < BOARD_HEIGHT - PLAYER_DIMENSION ?
          playerY + TILE_SIZE :
          playerY);
        setDialogue('You move down');
        break;
      case 'w':
        setPlayerY(playerY > 0 ? playerY - TILE_SIZE : playerY);
        setDialogue('You move up');
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

  const generateWorldTiles = () => {
    const tiles = [];
    if (worldMatrix) {
      for (let i = 0; i < worldMatrix.length; i++) {
        for (let j = 0; j < worldMatrix[i].length; j++) {
          tiles.push(createTile(
            j * TILE_SIZE,
            i * TILE_SIZE,
            translateNumToColor(worldMatrix[i][j]),
            TILE_SIZE,
          ));
        }
      }
    }
    return tiles;
  }

  const worldTiles = React.useMemo(() => {
    return generateWorldTiles();
  }, [worldMatrix]);

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
              width={PLAYER_DIMENSION}
              height={PLAYER_DIMENSION}
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