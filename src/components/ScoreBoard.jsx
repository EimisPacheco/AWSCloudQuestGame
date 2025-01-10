import React from 'react';

const ScoreBoard = ({ score }) => (
  <div className="score">
    👾 Score: <span>{score}</span> 🕹️
  </div>
);

export default ScoreBoard;
