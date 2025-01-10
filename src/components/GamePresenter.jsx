import React, { useState } from 'react';
import Game from './Game';
import RulesModal from './RulesModal';
import '../styles/Game.css';

const GamePresenter = () => {
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [numberOfRounds, setNumberOfRounds] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    if (numberOfRounds >= 1 && numberOfRounds <= 10) {
      setGameStarted(true);
    }
  };

  if (gameStarted) {
    return <Game difficulty={difficulty} numberOfRounds={numberOfRounds} />;
  }

  return (
    <div className="game-container">
      <RulesModal />
      <div className="game-setup">
        <div className="difficulty-selector">
          <h3>Select Difficulty:</h3>
          <div className="difficulty-buttons">
            {['EASY', 'MEDIUM', 'HARD'].map((level) => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? 'selected' : ''}`}
                onClick={() => setDifficulty(level)}
              >
                {level}
                <span className="multiplier">
                  {level === 'EASY' ? '1x' : level === 'MEDIUM' ? '1.5x' : '2x'} points
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounds-selector">
          <h3>Number of Rounds:</h3>
          <input
            type="number"
            value={numberOfRounds}
            onChange={(e) => setNumberOfRounds(Number(e.target.value))}
            min="1"
            max="10"
            className="rounds-input"
          />
        </div>

        <button 
          className="start-btn"
          onClick={handleStartGame}
        >
          Start Game
        </button>

        <div className="game-stats">
          <div className="current-difficulty">Level: {difficulty}</div>
        </div>
      </div>
    </div>
  );
};

export default GamePresenter;
