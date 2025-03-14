import React, { useRef } from 'react';
import { Container, CssBaseline, Box as MuiBox } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import GameArea from './components/GameArea';
import LoginPrompt from './components/LoginPrompt';
import { lightTheme, darkTheme } from './themes';
import useAuth from './hooks/useAuth';
import useGame from './hooks/useGame';
import useLeaderboard from './hooks/useLeaderboard';
import useAudio from './hooks/useAudio';

function App() {
  const playAreaRef = useRef(null);

  const { user, loginWithGoogle, logout, isDarkMode, toggleTheme } = useAuth();
  const { 
    score, setScore, timeLeft, setTimeLeft, gameActive, setGameActive, 
    highScore, setHighScore, difficulty, setDifficulty, boxPosition, 
    setBoxPosition, startGame, endGame, moveBox 
  } = useGame(playAreaRef, user);
  const { topScores, setTopScores } = useLeaderboard();
  const { 
    audioFile, setAudioFile, isPlaying, setIsPlaying, volume, setVolume, 
    loopMusic, setLoopMusic 
  } = useAudio();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header 
          user={user} 
          loginWithGoogle={loginWithGoogle} 
          logout={logout} 
          toggleTheme={toggleTheme} 
          isDarkMode={isDarkMode}
          topScores={topScores}
          currentScore={score}
          difficulty={difficulty}
          startGame={startGame}
          setDifficulty={setDifficulty}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          setVolume={setVolume}
          loopMusic={loopMusic}
          setLoopMusic={setLoopMusic}
        />
        <MuiBox sx={{ flexGrow: 1, py: 2 }}>
          {user ? (
            <GameArea
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              startGame={startGame}
              gameActive={gameActive}
              timeLeft={timeLeft}
              score={score}
              highScore={highScore}
              boxPosition={boxPosition}
              moveBox={moveBox}
              playAreaRef={playAreaRef}
              topScores={topScores}
              currentScore={score}
              user={user}
            />
          ) : (
            <LoginPrompt />
          )}
        </MuiBox>
      </Container>
    </ThemeProvider>
  );
}

export default App;