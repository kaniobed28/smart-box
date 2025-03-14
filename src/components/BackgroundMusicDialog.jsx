import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  useTheme 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BackgroundMusicSelector from './BackgroundMusicSelector';

function BackgroundMusicDialog({ 
  open, 
  onClose, 
  audioFile, 
  setAudioFile, 
  isPlaying, 
  setIsPlaying, 
  volume, 
  setVolume, 
  loopMusic, 
  setLoopMusic 
}) {
  const theme = useTheme();

  // Enhanced close handler (optional: confirm if music should stop)
  const handleClose = () => {
    // Uncomment this block if you want a confirmation prompt
    // if (isPlaying && audioFile) {
    //   const shouldStop = window.confirm('Do you want to stop the music?');
    //   if (shouldStop) {
    //     setIsPlaying(false);
    //   }
    // }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="background-music-dialog-title"
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
        id="background-music-dialog-title"
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
          Background Music
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
          justifyContent: 'center', 
          bgcolor: theme.palette.background.default,
        }}
      >
        <BackgroundMusicSelector 
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          setVolume={setVolume}
          loopMusic={loopMusic}
          setLoopMusic={setLoopMusic}
        />
      </DialogContent>
    </Dialog>
  );
}

export default BackgroundMusicDialog;