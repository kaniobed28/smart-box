import React from 'react';

function GameOver({ score, startGame }) {
  return (
    <div className="game-over-container">
      <h2 className="game-over">Game Over! Your Score: {score}</h2>
      <button onClick={startGame}>Play Again</button>
    </div>
  );
}

export default GameOver;