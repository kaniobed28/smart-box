import React from 'react';
import { Box, Typography } from '@mui/material';

function Stats({ timeLeft, score, highScore }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="body1"
        sx={{ fontWeight: 500, color: timeLeft <= 5 && timeLeft > 0 ? 'error.main' : 'text.primary' }}
      >
        Time Left: {timeLeft}s
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        Score: {score}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600, color: 'secondary.main' }}>
        High Score: {highScore}
      </Typography>
    </Box>
  );
}

export default Stats;