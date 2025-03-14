import React from 'react';
import { Grid, Paper } from '@mui/material';
import GameControls from './GameControls';
import Stats from './Stats';
import Box from './Box';
import GameOver from './GameOver';
import Leaderboard from './LeaderBoard';
import Challenges from './Challenges';

function GameArea({
  difficulty,
  setDifficulty,
  startGame,
  gameActive,
  timeLeft,
  score,
  highScore,
  boxPosition,
  moveBox,
  playAreaRef,
  topScores,
  currentScore,
  user,
}) {
  return (
    <Grid container spacing={2} sx={{ height: '100%', alignContent: 'flex-start' }}>
      {/* Main Game Area */}
      <Grid item xs={12} md={gameActive ? 12 : 8}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            height: gameActive ? '100%' : 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            transition: 'all 0.3s ease',
            overflow: 'hidden',
          }}
        >
          {/* Game Controls */}
          <GameControls
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            startGame={startGame}
            gameActive={gameActive}
          />

          {/* Stats */}
          <Stats timeLeft={timeLeft} score={score} highScore={highScore} />

          {/* Play Area */}
          <div
            ref={playAreaRef}
            style={{
              flexGrow: 1,
              position: 'relative',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              minHeight: gameActive ? '70vh' : (window.innerWidth < 900 ? '60vh' : '400px'),
              transition: 'min-height 0.3s ease',
            }}
          >
            {gameActive && (
              <Box position={boxPosition} moveBox={moveBox} difficulty={difficulty} />
            )}
            {!gameActive && timeLeft === 0 && score > 0 && (
              <GameOver score={score} startGame={startGame} />
            )}
          </div>
        </Paper>
      </Grid>

      {/* Sidebar (Leaderboard and Challenges) */}
      {!gameActive && (
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Leaderboard */}
            <Grid item xs={12}>
              <Leaderboard topScores={topScores} />
            </Grid>

            {/* Challenges */}
            <Grid item xs={12}>
              <Challenges 
                currentScore={currentScore} 
                difficulty={difficulty} 
                startGame={startGame} 
                setDifficulty={setDifficulty}
                user={user} // Pass user for challenge completion
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default GameArea;