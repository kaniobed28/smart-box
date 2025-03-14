import React from 'react';
import { Tabs, Tab } from '@mui/material';

function DifficultyTabs({ filter, setFilter, isMobile }) {
  return (
    <Tabs
      value={filter}
      onChange={(e, newValue) => setFilter(newValue)}
      variant={isMobile ? 'scrollable' : 'fullWidth'}
      scrollButtons={isMobile ? 'auto' : false}
      allowScrollButtonsMobile
      sx={{ mb: 2 }}
    >
      <Tab label="All" value="all" />
      <Tab label="Easy" value="easy" />
      <Tab label="Medium" value="medium" />
      <Tab label="Hard" value="hard" />
    </Tabs>
  );
}

export default DifficultyTabs;