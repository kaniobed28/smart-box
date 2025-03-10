import React from 'react';

function GameControls({ difficulty, setDifficulty, startGame, gameActive }) {
  return (
    <div className="controls">
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        disabled={gameActive}
      >
        <option value="easy">Easy (30s)</option>
        <option value="medium">Medium (20s)</option>
        <option value="hard">Hard (10s)</option>
      </select>
      <button onClick={startGame} disabled={gameActive}>
        {gameActive ? 'Game Running...' : 'Start Game'}
      </button>
    </div>
  );
}

export default GameControls;