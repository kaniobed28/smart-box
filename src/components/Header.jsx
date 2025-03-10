import React, { useState } from 'react';
import { AppBar, Toolbar, Box, useTheme } from '@mui/material';
import HeaderTitle from './HeaderTitle';
import DesktopActions from './DesktopActions';
import MobileActions from './MobileActions';
import LeaderboardDialog from './LeaderboardDialog';
import ChallengesDialog from './ChallengesDialog';

function Header({ 
  user, 
  loginWithGoogle, 
  logout, 
  toggleTheme, 
  isDarkMode, 
  topScores, 
  currentScore, 
  difficulty, 
  startGame, 
  setDifficulty,
}) {
  const theme = useTheme();
  const [openLeaderboard, setOpenLeaderboard] = useState(false);
  const [openChallenges, setOpenChallenges] = useState(false);

  const handleOpenLeaderboard = () => setOpenLeaderboard(true);
  const handleCloseLeaderboard = () => setOpenLeaderboard(false);
  const handleOpenChallenges = () => setOpenChallenges(true);
  const handleCloseChallenges = () => setOpenChallenges(false);

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <HeaderTitle />
        <DesktopActions 
          user={user}
          loginWithGoogle={loginWithGoogle}
          logout={logout}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          onOpenLeaderboard={handleOpenLeaderboard}
          onOpenChallenges={handleOpenChallenges}
        />
        <MobileActions 
          user={user}
          loginWithGoogle={loginWithGoogle}
          logout={logout}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          onOpenLeaderboard={handleOpenLeaderboard}
          onOpenChallenges={handleOpenChallenges}
        />
      </Toolbar>
      <LeaderboardDialog 
        open={openLeaderboard} 
        onClose={handleCloseLeaderboard} 
        topScores={topScores} 
      />
      <ChallengesDialog 
        open={openChallenges} 
        onClose={handleCloseChallenges} 
        currentScore={currentScore} 
        difficulty={difficulty} 
        startGame={startGame} 
        setDifficulty={setDifficulty} 
        user={user} 
      />
    </AppBar>
  );
}

export default Header;