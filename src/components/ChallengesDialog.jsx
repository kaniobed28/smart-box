import React from 'react';
import { Dialog, DialogTitle, DialogContent, useTheme, useMediaQuery, Typography } from '@mui/material';
import Challenges from './Challenges';

function ChallengesDialog({ open, onClose, currentScore, difficulty, startGame, setDifficulty, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      sx={{ 
        '& .MuiDialog-paper': {
          padding: isMobile ? theme.spacing(2) : theme.spacing(3), // Adjust padding based on screen size
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 600 }}>
        Global Challenges
      </DialogTitle>
      <DialogContent>
        <Challenges 
          currentScore={currentScore} 
          difficulty={difficulty} 
          startGame={startGame} 
          setDifficulty={setDifficulty} 
          user={user} 
        />
      </DialogContent>
    </Dialog>
  );
}

export default ChallengesDialog;
