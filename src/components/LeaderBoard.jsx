import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

function Leaderboard({ topScores }) {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Leaderboard
      </Typography>
      <List>
        {topScores.map((entry, index) => (
          <ListItem key={entry.id} sx={{ py: 0.5 }}>
            <ListItemText
              primary={`${index + 1}. ${entry.userName}`}
              secondary={`${entry.score} (${entry.difficulty})`}
              primaryTypographyProps={{ fontWeight: 'medium' }}
              secondaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default Leaderboard;