import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  useTheme,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function BackgroundImageDialog({ 
  open, 
  onClose, 
  gameBackgroundImage, 
  setGameBackgroundImage 
}) {
  const theme = useTheme();

  const handleClose = () => {
    onClose();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (gameBackgroundImage) {
        URL.revokeObjectURL(gameBackgroundImage);
      }
      const imageURL = URL.createObjectURL(file);
      setGameBackgroundImage(imageURL);
      onClose(); // Close dialog after selection
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="background-image-dialog-title"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <DialogTitle 
        id="background-image-dialog-title"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Choose Game Background
        </Typography>
        <IconButton
          aria-label="close dialog"
          onClick={handleClose}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent 
        sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Select Background Image</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'block', marginTop: '8px' }}
          />
        </Box>
        {gameBackgroundImage && (
          <Box
            component="img"
            src={gameBackgroundImage}
            alt="Selected background preview"
            sx={{
              maxWidth: '100%',
              maxHeight: '200px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
        {!gameBackgroundImage && (
          <Typography variant="body2" color="text.secondary">
            No background image selected
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BackgroundImageDialog;