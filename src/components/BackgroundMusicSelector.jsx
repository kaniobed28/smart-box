import React from 'react';
import { Button, Box, Typography, Slider, FormControlLabel, Switch } from '@mui/material';

function BackgroundMusicSelector({
  audioFile,
  setAudioFile,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  loopMusic,
  setLoopMusic,
}) {
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (audioFile) {
        URL.revokeObjectURL(audioFile); // Clean up previous URL
      }
      const fileURL = URL.createObjectURL(file);
      setAudioFile(fileURL);
      setIsPlaying(false); // Reset to paused state until user plays
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle volume change
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  // Handle loop toggle
  const handleLoopChange = (event) => {
    setLoopMusic(event.target.checked);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', maxWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Background Music
      </Typography>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ marginBottom: '16px' }}
      />
      {audioFile && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            color={isPlaying ? 'secondary' : 'primary'}
            onClick={togglePlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Box>
            <Typography variant="body2">Volume</Typography>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={100}
              step={1}
              sx={{ width: '100%' }}
            />
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={loopMusic}
                onChange={handleLoopChange}
                color="primary"
              />
            }
            label="Loop Music"
          />
        </Box>
      )}
      {!audioFile && (
        <Typography variant="body2" color="text.secondary">
          No music selected
        </Typography>
      )}
    </Box>
  );
}

export default BackgroundMusicSelector;