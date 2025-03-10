import React, { useState, useEffect } from 'react';

function Box({ position, moveBox, difficulty }) {
  const [clicked, setClicked] = useState(false);
  const boxSize = difficulty === 'easy' ? 64 : difficulty === 'medium' ? 48 : 32;

  const handleClick = () => {
    setClicked(true);
    moveBox(true);
    setTimeout(() => setClicked(false), 100);
  };

  return (
    <div
      className={`box ${clicked ? 'clicked' : ''}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${boxSize}px`,
        height: `${boxSize}px`,
      }}
      onClick={handleClick}
    />
  );
}

export default Box;