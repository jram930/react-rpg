import React from 'react';
import './App.css';
import { Game } from './Game';
import { css } from '@emotion/css';

// 222831
// 393E46
// D65A31
// EEEEEE

function App() {

  const appStyle = css({
    backgroundColor: '#222831',
    textAlign: 'center',
    overflow: 'hidden',
  });

  return (
    <div className={appStyle}>
      <Game />
    </div>
  );
}

export default App;
