import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import architectureReducer from './architectureSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    architecture: architectureReducer,
    user: userReducer
  }
}); 