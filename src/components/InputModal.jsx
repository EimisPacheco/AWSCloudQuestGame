import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/InputModal.css';

const InputModal = ({ isOpen, onSubmit, prompt, inputType = 'text' }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="input-modal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <form onSubmit={handleSubmit}>
            <input
              type={inputType}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={prompt}
              autoFocus
            />
            <button type="submit">Submit ✨</button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InputModal; 