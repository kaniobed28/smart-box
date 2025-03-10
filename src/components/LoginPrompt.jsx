import React from 'react';
import { Paper, Typography } from '@mui/material';

function LoginPrompt() {
  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
      <Typography variant="h6" color="text.secondary">
        Please log in to start playing!
      </Typography>
    </Paper>
  );
}

export default LoginPrompt;