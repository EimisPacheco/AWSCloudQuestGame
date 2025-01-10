import { create } from 'zustand';

const useGameStore = create((set) => ({
  score: 0,
  level: 1,
  streak: 0,
  hints: 3,
  timeBonus: 0,
  history: [],

  updateScore: (points, timeBonus) => set((state) => ({
    score: state.score + points + timeBonus,
    timeBonus: timeBonus
  })),

  updateStreak: (correct) => set((state) => ({
    streak: correct ? state.streak + 1 : 0,
    // Bonus points for maintaining streaks
    score: correct && state.streak > 2 ? 
      state.score + (state.streak * 10) : state.score
  })),

  useHint: () => set((state) => ({
    hints: state.hints - 1,
    score: state.score - 50 // Penalty for using hints
  })),

  addToHistory: (question) => set((state) => ({
    history: [...state.history, question]
  })),

  levelUp: () => set((state) => ({
    level: state.level + 1,
    hints: state.hints + 1 // Bonus hint on level up
  }))
}));

export default useGameStore; 