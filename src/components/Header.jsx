import React, { useState } from 'react';
import { AppBar, Toolbar, Box, useTheme } from '@mui/material';
import HeaderTitle from './HeaderTitle';
import DesktopActions from './DesktopActions';
import MobileActions from './MobileActions';
import LeaderboardDialog from './LeaderboardDialog';
import ChallengesDialog from './ChallengesDialog';
import BackgroundMusicDialog from './BackgroundMusicDialog';
import BackgroundImageDialog from './BackgroundImageDialog'; // New import

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
  audioFile,
  setAudioFile,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  loopMusic,
  setLoopMusic,
  gameBackgroundImage, 
  setGameBackgroundImage 
}) {
  const theme = useTheme();
  const [openLeaderboard, setOpenLeaderboard] = useState(false);
  const [openChallenges, setOpenChallenges] = useState(false);
  const [openMusic, setOpenMusic] = useState(false);
  const [openBackgroundImage, setOpenBackgroundImage] = useState(false); // New state

  const handleOpenLeaderboard = () => setOpenLeaderboard(true);
  const handleCloseLeaderboard = () => setOpenLeaderboard(false);
  const handleOpenChallenges = () => setOpenChallenges(true);
  const handleCloseChallenges = () => setOpenChallenges(false);
  const handleOpenMusic = () => setOpenMusic(true);
  const handleCloseMusic = () => setOpenMusic(false);
  const handleOpenBackgroundImage = () => setOpenBackgroundImage(true); // New handler
  const handleCloseBackgroundImage = () => setOpenBackgroundImage(false); // New handler

  return (
    <AppBar 
      position="static"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        borderBottom: `2px solid ${theme.palette.divider}`,
        mb: 4
      }}
    >
      <Toolbar 
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          py: 2,
          flexWrap: 'wrap'
        }}
      >
        <HeaderTitle />
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
          <DesktopActions 
            user={user}
            loginWithGoogle={loginWithGoogle}
            logout={logout}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            onOpenLeaderboard={handleOpenLeaderboard}
            onOpenChallenges={handleOpenChallenges}
            onOpenMusic={handleOpenMusic}
            onOpenBackgroundImage={handleOpenBackgroundImage} // Pass new handler
          />
        </Box>
        
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
          <MobileActions 
            user={user}
            loginWithGoogle={loginWithGoogle}
            logout={logout}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            onOpenLeaderboard={handleOpenLeaderboard}
            onOpenChallenges={handleOpenChallenges}
            onOpenMusic={handleOpenMusic}
            onOpenBackgroundImage={handleOpenBackgroundImage} // Pass new handler
          />
        </Box>
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
      <BackgroundMusicDialog 
        open={openMusic} 
        onClose={handleCloseMusic}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
        setVolume={setVolume}
        loopMusic={loopMusic}
        setLoopMusic={setLoopMusic}
      />
      <BackgroundImageDialog 
        open={openBackgroundImage}
        onClose={handleCloseBackgroundImage}
        gameBackgroundImage={gameBackgroundImage}
        setGameBackgroundImage={setGameBackgroundImage}
      />
    </AppBar>
  );
}

export default Header;