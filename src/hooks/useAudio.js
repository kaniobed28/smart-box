import { useState, useEffect, useRef } from 'react';

function useAudio() {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [loopMusic, setLoopMusic] = useState(true);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (audioFile) {
      audioRef.current.src = audioFile;
      audioRef.current.loop = loopMusic;
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch((error) => console.error('Error playing audio:', error));
      }
    }
  }, [audioFile, loopMusic]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioFile) {
      audioRef.current.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioFile]);

  useEffect(() => {
    const handleEnded = () => {
      if (!loopMusic) setIsPlaying(false);
    };
    audioRef.current.addEventListener('ended', handleEnded);
    return () => audioRef.current.removeEventListener('ended', handleEnded);
  }, [loopMusic]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      if (audioFile) {
        URL.revokeObjectURL(audioFile);
      }
    };
  }, [audioFile]);

  return { 
    audioFile, setAudioFile, isPlaying, setIsPlaying, volume, setVolume, 
    loopMusic, setLoopMusic 
  };
}

export default useAudio;