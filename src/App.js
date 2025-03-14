import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Container, CssBaseline, Box as MuiBox } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import GameArea from './components/GameArea';
import LoginPrompt from './components/LoginPrompt';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6B48FF' }, // Vivid Purple
    secondary: { main: '#FF6B6B' }, // Coral Pink
    error: { main: '#FF3D71' }, // Bright Red-Pink
    easy: { main: '#40C4FF' }, // Sky Blue
    medium: { main: '#FFD740' }, // Golden Yellow
    hard: { main: '#FF5252' }, // Fiery Red
    background: { default: '#F5F7FA', paper: '#FFFFFF' }, // Soft Gray-White, Pure White
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6B48FF' }, // Vivid Purple (consistent across modes)
    secondary: { main: '#FF6B6B' }, // Coral Pink (consistent across modes)
    error: { main: '#FF3D71' }, // Bright Red-Pink (consistent across modes)
    easy: { main: '#40C4FF' }, // Sky Blue
    medium: { main: '#FFD740' }, // Golden Yellow
    hard: { main: '#FF5252' }, // Fiery Red
    background: { default: '#1A1A2E', paper: '#2D2D44' }, // Deep Blue-Black, Dark Blue-Gray
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [highScore, setHighScore] = useState(
    () => localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0
  );
  const [difficulty, setDifficulty] = useState('easy');
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });
  const [user, setUser] = useState(null);
  const [topScores, setTopScores] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const playAreaRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  useEffect(() => {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(100)); // Increase limit temporarily to get more data
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scoresData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Process scores to keep only the highest score per user
      const highestScoresMap = new Map();
      scoresData.forEach((entry) => {
        const existing = highestScoresMap.get(entry.userName);
        if (!existing || entry.score > existing.score) {
          highestScoresMap.set(entry.userName, entry);
        }
      });
  
      // Convert Map values to array and take top 10
      const filteredTopScores = Array.from(highestScoresMap.values())
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 10); // Limit to top 10
  
      setTopScores(filteredTopScores);
    });
    return () => unsubscribe();
  }, []);

  const startGame = () => {
    if (gameActive || !user) return;
    const timeLimits = { easy: 30, medium: 20, hard: 10 };
    setTimeLeft(timeLimits[difficulty]);
    setScore(0);
    setGameActive(true);
    moveBox();

    setTimeout(() => {
      if (playAreaRef.current) {
        console.log('Scrolling to play area:', playAreaRef.current);
        playAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.error('playAreaRef is not attached');
      }
    }, 100);
  };

  const endGame = async () => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
    }
    if (user) {
      try {
        await addDoc(collection(db, 'scores'), {
          userName: user.displayName,
          score: score,
          difficulty: difficulty,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  const moveBox = (isClick = false) => {
    if (!gameActive || !playAreaRef.current) return;
    
    const boxSize = difficulty === 'easy' ? 64 : difficulty === 'medium' ? 48 : 32;
    const playArea = playAreaRef.current.getBoundingClientRect();
    
    const maxTop = playArea.height - boxSize;
    const maxLeft = playArea.width - boxSize;
    
    const newTop = Math.floor(Math.random() * maxTop);
    const newLeft = Math.floor(Math.random() * maxLeft);
    
    setBoxPosition({ top: newTop, left: newLeft });

    if (isClick) {
      setScore(prev => prev + 1);
      new Audio('data:audio/wav;base64,UklGRlYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAAC').play();
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) {
      console.error('Auth object is undefined!');
      alert('Firebase authentication not initialized. Check console.');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert('Logged in as ' + result.user.displayName);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
