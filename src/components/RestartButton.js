import React from 'react';
import './RestartButton.css';

const RestartButton = () => {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <button className="restart-button" onClick={handleRestart}>
      Restart
    </button>
  );
}

export default RestartButton;
