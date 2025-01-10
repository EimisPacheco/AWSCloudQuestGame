import React, { createContext, useContext, useState } from 'react';

const EffectsContext = createContext();

export function EffectsProvider({ children }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  return (
    <EffectsContext.Provider value={{ 
      showConfetti, 
      setShowConfetti,
      showFireworks, 
      setShowFireworks 
    }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  return useContext(EffectsContext);
}