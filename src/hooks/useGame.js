import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function useGame(playAreaRef, user) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [highScore, setHighScore] = useState(
    () => localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0
  );
  const [difficulty, setDifficulty] = useState('easy');
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });
  const [gameBackgroundImage, setGameBackgroundImage] = useState(null); // Add background image state

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

  // Cleanup background image URL on unmount
  useEffect(() => {
    return () => {
      if (gameBackgroundImage) {
        URL.revokeObjectURL(gameBackgroundImage);
      }
    };
  }, [gameBackgroundImage]);

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
          photoURL: user.photoURL || '',
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

  return { 
    score, setScore, timeLeft, setTimeLeft, gameActive, setGameActive, 
    highScore, setHighScore, difficulty, setDifficulty, boxPosition, 
    setBoxPosition, startGame, endGame, moveBox,
    gameBackgroundImage, setGameBackgroundImage // Export background image state
  };
}

export default useGame;