import React, { useState } from 'react';
import ReactConfetti from 'react-confetti';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 999,
          }}
        />
      )}
      <Router>
        {/* Your Routes */}
      </Router>
    </>
  );
}

export default App; 