import React from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';

type KeyPress = {
  key: string;
};

export const Game = () => {

  const [playerX, setPlayerX] = React.useState<number>(0);
  const [playerY, setPlayerY] = React.useState<number>(0);

  const handleKeyDown = (keyPress: KeyPress) => {
    const { key } = keyPress;
    switch (key) {
      case 'a':
        setPlayerX(playerX - 10);
        break;
      case 'd':
        setPlayerX(playerX + 10);
        break;
      case 's':
        setPlayerY(playerY + 10);
        break;
      case 'w':
        setPlayerY(playerY - 10);
        break;
      default:
      // do nothing
    }
  };

  return (
    // Stage - is a div wrapper
    // Layer - is an actual 2d canvas element, so you can have several layers inside the stage
    // Rect and Circle are not DOM elements. They are 2d shapes on canvas
    <div tabIndex={1} onKeyDown={handleKeyDown}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect width={50} height={50} x={playerX} y={playerY} fill="blue" />
          <Circle x={200} y={200} stroke="black" radius={50} />
        </Layer>
      </Stage>
    </div>
  );
};