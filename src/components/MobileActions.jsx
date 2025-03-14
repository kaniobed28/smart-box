import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Switch,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function MobileActions({ 
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
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleMobileMenuOpen = (event) => setMobileMenuAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchorEl(null);
  const showGameInfo = () => {
    alert('Game Rules:\n- Click the moving box to score points.\n- Choose a difficulty: Easy (30s), Medium (20s), Hard (10s).\n- Challenge players worldwide and beat their scores!');
    handleMobileMenuClose();
  };

  return (
    <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="mobile menu"
        onClick={handleMobileMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="mobile-menu"
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={onOpenLeaderboard}>Leaderboard</MenuItem>
        <MenuItem onClick={onOpenChallenges}>Challenges</MenuItem>
        <MenuItem onClick={onOpenMusic}>Background Music</MenuItem>
        {/* <MenuItem onClick={onOpenBackgroundImage}>Game Background</MenuItem> New item */}
        <MenuItem onClick={showGameInfo}>Game Info</MenuItem>
        <MenuItem>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            icon={<Brightness7Icon />}
            checkedIcon={<Brightness4Icon />}
            color="default"
            aria-label="toggle dark mode"
          />
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </MenuItem>
        {user ? (
          [
            <MenuItem key="profile" disabled>View Profile (Coming Soon)</MenuItem>,
            <MenuItem key="settings" disabled>Settings (Coming Soon)</MenuItem>,
            <MenuItem key="logout" onClick={() => { logout(); handleMobileMenuClose(); }}>
              Logout ({user.displayName})
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={() => { loginWithGoogle(); handleMobileMenuClose(); }}>
            Login with Google
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}

export default MobileActions;