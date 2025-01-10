import React from 'react';
import ReactDOM from 'react-dom';
import { useWindowSize } from 'react-use';
import { useEffects } from '../context/EffectsContext';
import ReactConfetti from 'react-confetti';

function Effects() {
  const { width, height } = useWindowSize();
  const { showConfetti, showFireworks } = useEffects();

  return ReactDOM.createPortal(
    <>
      {(showConfetti || showFireworks) && (
        <div className="effects-container">
          <ReactConfetti
            width={width}
            height={height}
            recycle={showFireworks}
            numberOfPieces={showFireworks ? 500 : 200}
            colors={showFireworks ? ['#FFD700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF'] : undefined}
          />
        </div>
      )}
    </>,
    document.body
  );
}

export default Effects;