// HeaderTitle.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';

function HeaderTitle({ title = "Click the Moving Box!" }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [celebration, setCelebration] = useState(false);

  const checkCelebrationDay = () => {
    const today = new Date();
    const celebrations = [
      { month: 11, day: 25 }, // Christmas
      { month: 0, day: 1 },   // New Year's Day
    ];

    return celebrations.some(
      (celebration) => today.getMonth() === celebration.month && today.getDate() === celebration.day
    );
  };

  useEffect(() => {
    const isCelebration = checkCelebrationDay();
    setCelebration(isCelebration);
  }, []);

  return (
    <Box
      sx={{
        textAlign: 'center',
        position: 'relative',
        flexGrow: 1,
        maxWidth: '100%',
        px: isMobile ? 1 : 2, // Reduced padding for mobile
        py: isMobile ? 2 : 4, // Adjusted vertical spacing for mobile
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: isMobile ? 'none' : 'rotate(-2deg) scale(1.05)', // Disable hover effect on mobile
        },
      }}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h3'} // Reduced font size for mobile
        component="h1"
        sx={{
          fontWeight: 700,
          letterSpacing: isMobile ? '0.02em' : '0.05em', // Tighter letter spacing for mobile
          textShadow: `
            ${isMobile ? '1px 1px 0' : '2px 2px 0'} ${theme.palette.background.paper},
            ${isMobile ? '-1px -1px 0' : '-2px -2px 0'} ${theme.palette.background.paper}
          `,
          backgroundImage: celebration
            ? `linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)`
            : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.dark})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
          zIndex: 1,
          animation: celebration ? 'glow 1.5s infinite' : 'none',
          fontSize: isMobile ? '1.5rem' : '2.5rem', // Explicit font size control
          lineHeight: isMobile ? 1.2 : 1.5, // Improved line height for readability
        }}
      >
        {title}
      </Typography>

      {celebration && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden', // Prevent confetti from overflowing container
          }}
        >
          {[...Array(10)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: isMobile ? 4 + Math.random() * 6 : 8 + Math.random() * 10, // Smaller confetti on mobile
                height: isMobile ? 4 + Math.random() * 6 : 8 + Math.random() * 10, // Smaller confetti on mobile
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 3)],
                borderRadius: '50%',
                animation: `fall-${i % 3} 2s ${Math.random()}s infinite`,
                left: `${Math.random() * 100}%`,
                opacity: 0.8,
              }}
            />
          ))}
        </Box>
      )}

      <style>
        {`
          @keyframes fall-0 {
            0% { transform: translateY(-100%); opacity: 1; }
            100% { transform: translateY(120vh); opacity: 0; }
          }
          @keyframes fall-1 {
            0% { transform: translateY(-100%) rotate(45deg); opacity: 1; }
            100% { transform: translateY(120vh) rotate(45deg); opacity: 0; }
          }
          @keyframes fall-2 {
            0% { transform: translateY(-100%) rotate(-45deg); opacity: 1; }
            100% { transform: translateY(120vh) rotate(-45deg); opacity: 0; }
          }
          @keyframes glow {
            0% { text-shadow: 0 0 10px #ff6b6b; }
            50% { text-shadow: 0 0 20px #4ecdc4; }
            100% { text-shadow: 0 0 10px #45b7d1; }
          }
        `}
      </style>
    </Box>
  );
}

export default HeaderTitle;