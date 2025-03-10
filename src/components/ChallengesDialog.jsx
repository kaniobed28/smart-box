import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import Challenges from './Challenges';

function ChallengesDialog({ open, onClose, currentScore, difficulty, startGame, setDifficulty, user }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Global Challenges</DialogTitle>
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