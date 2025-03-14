import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Switch, 
  Avatar, 
  Typography, 
  Menu, 
  MenuItem, 
  Button,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ChallengeIcon from '@mui/icons-material/EmojiEvents';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageIcon from '@mui/icons-material/Image'; // New icon for background image

function DesktopActions({ 
  user, 
  loginWithGoogle, 
  logout, 
  toggleTheme, 
  isDarkMode, 
  onOpenLeaderboard, 
  onOpenChallenges,
  onOpenMusic,
  onOpenBackgroundImage, // New prop
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUserMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);
  const showGameInfo = () => {
    alert('Game Rules:\n- Click the moving box to score points.\n- Choose a difficulty: Easy (30s), Medium (20s), Hard (10s).\n- Challenge players worldwide and beat their scores!');
  };

  return (
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
      {user ? (
        <>
          <Tooltip title="Leaderboard">
            <IconButton color="inherit" onClick={onOpenLeaderboard} aria-label="view leaderboard">
              <LeaderboardIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Challenges">
            <IconButton color="inherit" onClick={onOpenChallenges} aria-label="view challenges">
              <ChallengeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Background Music">
            <IconButton color="inherit" onClick={onOpenMusic} aria-label="select background music">
              <MusicNoteIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Game Background">
            <IconButton color="inherit" onClick={onOpenBackgroundImage} aria-label="select game background">
              <ImageIcon />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Game Info">
            <IconButton color="inherit" onClick={showGameInfo} aria-label="game information">
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Theme">
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              icon={<Brightness7Icon />}
              checkedIcon={<Brightness4Icon />}
              color="default"
              aria-label="toggle dark mode"
            />
          </Tooltip>
          <Tooltip title="User Menu">
            <IconButton 
              onClick={handleUserMenuOpen} 
              sx={{ p: 0 }} 
              aria-label="user menu" 
              aria-controls="user-menu"
            >
              <Avatar src={user.photoURL} alt={user.displayName} />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" sx={{ mr: 1 }}>
            {user.displayName}
          </Typography>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleUserMenuClose} disabled>View Profile (Coming Soon)</MenuItem>
            <MenuItem onClick={handleUserMenuClose} disabled>Settings (Coming Soon)</MenuItem>
            <MenuItem onClick={() => { logout(); handleUserMenuClose(); }}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          color="inherit"
          variant="outlined"
          onClick={loginWithGoogle}
          startIcon={<span>G</span>}
          aria-label="login with google"
        >
          Login with Google
        </Button>
      )}
    </Box>
  );
}

export default DesktopActions;