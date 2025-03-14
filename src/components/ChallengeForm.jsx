import React from 'react';
import { TextField, Button } from '@mui/material';

function ChallengeForm({ currentScore, throwChallenge }) {
  const [challengeMessage, setChallengeMessage] = React.useState('');

  const handleThrowChallenge = () => {
    throwChallenge(challengeMessage);
    setChallengeMessage('');
  };

  return (
    <>
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
        onClick={handleThrowChallenge}
        disabled={!currentScore}
        fullWidth
        sx={{ mb: 2 }}
      >
        Throw Global Challenge
      </Button>
    </>
  );
}

export default ChallengeForm;