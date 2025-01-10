import { useReducer, useRef, useCallback, useEffect } from 'react';
import { gameReducer, initialGameState, GameActionTypes } from './gameReducer';

export const useGameLogic = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const animationFrameId = useRef(null);
  const imageCache = useRef(new Map());
  const renderCallback = useRef(null);

  // Cache images
  const getImage = useCallback((src) => {
    if (!imageCache.current.has(src)) {
      const img = new Image();
      img.src = src;
      imageCache.current.set(src, img);
    }
    return imageCache.current.get(src);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState.isPlaying && !gameState.gameOver && renderCallback.current) {
      renderCallback.current();
      animationFrameId.current = window.requestAnimationFrame(gameLoop);
    } else if (animationFrameId.current) {
      window.cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, [gameState.isPlaying, gameState.gameOver]);

  // Set render function
  const setRenderFunction = useCallback((renderFn) => {
    renderCallback.current = renderFn;
  }, []);

  // Start game timer
  useEffect(() => {
    let timerInterval;
    if (gameState.isPlaying && !gameState.gameOver) {
      timerInterval = setInterval(() => {
        dispatch({ type: GameActionTypes.UPDATE_TIME });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameState.isPlaying, gameState.gameOver]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      renderCallback.current = null;
      imageCache.current.clear();
    };
  }, []);

  // Start game function
  const startGame = useCallback(() => {
    dispatch({ type: GameActionTypes.START_GAME });
    if (!animationFrameId.current) {
      gameLoop();
    }
  }, [dispatch, gameLoop]);

  // Check if animation frame is active
  const isAnimating = useCallback(() => {
    return animationFrameId.current !== null;
  }, []);

  return {
    gameState,
    dispatch,
    getImage,
    gameLoop,
    setRenderFunction,
    startGame,
    isAnimating
  };
}; 