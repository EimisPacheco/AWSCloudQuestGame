import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialOverlay = ({ step, onComplete }) => {
  if (!step) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="tutorial-content">
          <h2>{step.title}</h2>
          <p>{step.content}</p>
          <button 
            className="tutorial-button"
            onClick={onComplete}
          >
            Next
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay; 