import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AWSArchitectureAI from '../services/AWSArchitectureAI';

export const fetchNextArchitecture = createAsyncThunk(
  'game/fetchNextArchitecture',
  async (_, { getState }) => {
    const { difficulty, history } = getState().game;
    const ai = new AWSArchitectureAI();
    return await ai.generateArchitecture(difficulty, history);
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    score: 0,
    level: 1,
    difficulty: 'beginner',
    history: [],
    currentArchitecture: null,
    loading: false,
    error: null
  },
  reducers: {
    updateScore(state, action) {
      state.score += action.payload;
    },
    setDifficulty(state, action) {
      state.difficulty = action.payload;
    },
    addToHistory(state, action) {
      state.history.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNextArchitecture.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNextArchitecture.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArchitecture = action.payload;
      })
      .addCase(fetchNextArchitecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { updateScore, setDifficulty, addToHistory } = gameSlice.actions;
export default gameSlice.reducer; 