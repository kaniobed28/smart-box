import React from 'react';
import { Typography } from '@mui/material';

function HeaderTitle() {
  return (
    <Typography 
      variant="h4" 
      component="h1" 
      sx={{ flexGrow: 1, fontSize: { xs: '1.5rem', sm: '2.25rem' } }}
    >
      Click the Moving Box!
    </Typography>
  );
}

export default HeaderTitle;