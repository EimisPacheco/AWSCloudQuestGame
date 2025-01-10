import React, { useState, useEffect } from 'react';
import MagicalQuestionCard from './MagicalQuestionCard';
import InputModal from './InputModal';
import ThreeDArchitecture from './ThreeDArchitecture';
import { getPhrase, checkAnswer } from '../services/aiService';
import '../styles/Game.css';
import CrosswordGrid from './CrosswordGrid';

const Game = () => {
  const [showSolution, setShowSolution] = useState(false);
  const [grid, setGrid] = useState(/* initial grid state */);
  const [answers, setAnswers] = useState(/* answers data */);
  const [triggerEffect, setTriggerEffect] = useState(0);

  const handleSolveCrossword = () => {
    setShowSolution(true);
    setTriggerEffect(prev => prev + 1); // Trigger particle effect
  };

  return (
    <div className="game-container">
      <CrosswordGrid 
        grid={grid}
        answers={answers}
        showSolution={showSolution}
      />
      <div className="button-group">
        <button onClick={() => setShowSolution(false)}>New Game</button>
        <button onClick={() => checkAnswers()}>Check Answers</button>
        <button onClick={() => resetGrid()}>Reset</button>
        <button 
          className="solve-button"
          onClick={handleSolveCrossword}
        >
          Solve Crossword
        </button>
      </div>
    </div>
  );
};

export default Game;