import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import Leaderboard from './LeaderBoard';

function LeaderboardDialog({ open, onClose, topScores }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Leaderboard</DialogTitle>
      <DialogContent>
        <Leaderboard topScores={topScores} />
      </DialogContent>
    </Dialog>
  );
}

export default LeaderboardDialog;