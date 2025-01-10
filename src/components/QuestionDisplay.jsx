import React from 'react';
import { motion } from 'framer-motion';

const QuestionDisplay = ({ question, isLoading }) => {
  if (isLoading) {
    return (
      <div className="question-container">
        <div className="loading">Loading next challenge...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="question-container"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="question-text">{question?.text || 'Loading question...'}</h2>
      <div className="question-hint">{question?.hint || ''}</div>
    </motion.div>
  );
};

export default QuestionDisplay; 