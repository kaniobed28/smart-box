import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  useTheme, // Import useTheme
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Challenges({ currentScore, difficulty, startGame, setDifficulty, user }) {
  const theme = useTheme(); // Access the theme from ThemeProvider
  const [challenges, setChallenges] = useState([]);
  const [challengeMessage, setChallengeMessage] = useState('');
  const [filter, setFilter] = useState('all'); // Filter: 'all', 'easy', 'medium', 'hard'

  useEffect(() => {
    const q = query(collection(db, 'challenges'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const challengesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedBy: doc.data().completedBy || [], // Array of user IDs who completed the challenge
      }));
      setChallenges(challengesData.filter(challenge => {
        const expiresAt = new Date(challenge.timestamp).getTime() + 24 * 60 * 60 * 1000; // 24 hours
        return expiresAt > Date.now(); // Only show non-expired challenges
      }));
    });
    return () => unsubscribe();
  }, []);

  const throwChallenge = async () => {
    if (!auth.currentUser || !currentScore) return;
    try {
      await addDoc(collection(db, 'challenges'), {
        challengerId: auth.currentUser.uid,
        challengerName: auth.currentUser.displayName,
        challengerPhoto: auth.currentUser.photoURL || '',
        scoreToBeat: currentScore,
        difficulty,
        message: challengeMessage || 'Beat my score!',
        timestamp: new Date().toISOString(),
        completedBy: [],
      });
      setChallengeMessage('');
      alert('Challenge thrown to players worldwide!');
    } catch (error) {
      console.error('Error throwing challenge:', error);
      alert('Failed to throw challenge: ' + error.message);
    }
  };

  const acceptChallenge = (challenge) => {
    setDifficulty(challenge.difficulty);
    startGame();
    alert(`Accepted challenge from ${challenge.challengerName}! Beat ${challenge.scoreToBeat} on ${challenge.difficulty}.`);
  };

  const markChallengeCompleted = async (challengeId, scoreToBeat) => {
    if (currentScore > scoreToBeat && user) {
      const challengeRef = doc(db, 'challenges', challengeId);
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge.completedBy.includes(user.uid)) {
        await updateDoc(challengeRef, {
          completedBy: [...challenge.completedBy, user.uid],
        });
        alert(`Challenge beaten! You scored ${currentScore} against ${scoreToBeat}.`);
      }
    }
  };

  const filteredChallenges = filter === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.difficulty === filter);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'grey';
    }
  };

  const getExpirationProgress = (timestamp) => {
    const createdAt = new Date(timestamp).getTime();
    const expiresAt = createdAt + 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    return Math.max(0, ((expiresAt - now) / (24 * 60 * 60 * 1000)) * 100);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Global Challenges
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={challengeMessage}
        onChange={(e) => setChallengeMessage(e.target.value)}
        placeholder="Challenge players worldwide!"
        disabled={!currentScore}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={throwChallenge}
        disabled={!currentScore}
        fullWidth
        sx={{ mb: 2 }}
      >
        Throw Global Challenge
      </Button>
      <Tabs
        value={filter}
        onChange={(e, newValue) => setFilter(newValue)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="All" value="all" />
        <Tab label="Easy" value="easy" />
        <Tab label="Medium" value="medium" />
        <Tab label="Hard" value="hard" />
      </Tabs>
      <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {filteredChallenges.map((challenge) => (
          <ListItem key={challenge.id} sx={{ py: 1, alignItems: 'flex-start' }}>
            <Avatar src={challenge.challengerPhoto} sx={{ mr: 2, mt: 0.5 }} />
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {challenge.challengerName}: "{challenge.message}"
                  {challenge.completedBy.includes(user?.uid) && (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                </Box>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    Score: {challenge.scoreToBeat}
                  </Typography>
                  <Chip 
                    label={challenge.difficulty} 
                    size="small" 
                    sx={{ bgcolor: theme.palette[getDifficultyColor(challenge.difficulty)].main, color: 'white', mt: 0.5 }} 
                  />
                  <LinearProgress 
                    variant="determinate" 
                    value={getExpirationProgress(challenge.timestamp)} 
                    sx={{ mt: 1, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#4a90e2' } }} 
                  />
                </>
              }
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="accept challenge"
                onClick={() => acceptChallenge(challenge)}
                color="secondary"
              >
                <PlayArrowIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default Challenges;