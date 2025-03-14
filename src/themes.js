import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6B48FF' },
    secondary: { main: '#FF6B6B' },
    error: { main: '#FF3D71' },
    easy: { main: '#40C4FF' },
    medium: { main: '#FFD740' },
    hard: { main: '#FF5252' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6B48FF' },
    secondary: { main: '#FF6B6B' },
    error: { main: '#FF3D71' },
    easy: { main: '#40C4FF' },
    medium: { main: '#FFD740' },
    hard: { main: '#FF5252' },
    background: { default: '#1A1A2E', paper: '#2D2D44' },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});