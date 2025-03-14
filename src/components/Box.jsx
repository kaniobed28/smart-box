import React, { useState } from 'react';

function Box({ position, moveBox, difficulty }) {
  const [clicked, setClicked] = useState(false);

  // Define box size and animation speed based on difficulty
  const boxSize = {
    easy: 64,
    medium: 48,
    hard: 32,
  };

  const animationDuration = {
    easy: 1000, // milliseconds
    medium: 750,
    hard: 500,
  };

  const handleClick = () => {
    setClicked(true);
    moveBox(true); // Notify parent that the box was clicked
    setTimeout(() => setClicked(false), animationDuration[difficulty]);
  };

  return (
    <div
      className={`box ${clicked ? 'clicked' : ''}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${boxSize[difficulty]}px`,
        height: `${boxSize[difficulty]}px`,
        position: 'absolute',
        backgroundColor: '#007bff',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: `transform ${animationDuration[difficulty]}ms ease`,
      }}
      onClick={handleClick}
    />
  );
}

export default Box;