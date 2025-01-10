import { AWS_ICON_CATEGORIES } from '../services/IconResolver';

// Game state types
export const GameActionTypes = {
  START_GAME: 'START_GAME',
  END_GAME: 'END_GAME',
  UPDATE_SCORE: 'UPDATE_SCORE',
  UPDATE_TIME: 'UPDATE_TIME',
  SET_PLAYER_NAME: 'SET_PLAYER_NAME',
  SET_ROCKET: 'SET_ROCKET',
  UPDATE_INSTRUCTION: 'UPDATE_INSTRUCTION',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  INITIALIZE_INSTRUCTIONS: 'INITIALIZE_INSTRUCTIONS',
  UPDATE_HIGH_SCORES: 'UPDATE_HIGH_SCORES'
};

// Helper function to get random categories
const getRandomCategories = () => {
  const categories = Object.keys(AWS_ICON_CATEGORIES);
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

export const initialGameState = {
  isPlaying: false,
  score: 0,
  timeLeft: 60,
  playerName: '',
  selectedRocket: null,
  currentInstructionIndex: 0,
  isMuted: false,
  gameOver: false,
  instructions: [],
  iconTypes: {},
  highScores: (() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : [];
  })() // Initialize from localStorage
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case GameActionTypes.START_GAME:
      // Get initial instructions when game starts
      const initialInstructions = getRandomCategories().map(category => {
        const displayName = category.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        return {
          text: `Shoot the ${displayName} icons!`,
          category: AWS_ICON_CATEGORIES[category],
          displayName: displayName
        };
      });

      return {
        ...state,
        isPlaying: true,
        score: 0,
        timeLeft: 60,
        gameOver: false,
        instructions: initialInstructions,
        currentInstructionIndex: 0
      };
      
    case GameActionTypes.END_GAME:
      return {
        ...state,
        isPlaying: false,
        gameOver: true
      };
      
    case GameActionTypes.UPDATE_SCORE:
      return {
        ...state,
        score: state.score + action.payload
      };
      
    case GameActionTypes.UPDATE_TIME:
      const newTime = state.timeLeft - 1;
      return {
        ...state,
        timeLeft: newTime,
        gameOver: newTime <= 0
      };
      
    case GameActionTypes.SET_PLAYER_NAME:
      return {
        ...state,
        playerName: action.payload
      };
      
    case GameActionTypes.SET_ROCKET:
      return {
        ...state,
        selectedRocket: action.payload
      };
      
    case GameActionTypes.INITIALIZE_INSTRUCTIONS:
      const instructions = getRandomCategories().map(category => {
        const displayName = category.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        return {
          text: `Shoot the ${displayName} icons!`,
          category: AWS_ICON_CATEGORIES[category],
          displayName: displayName
        };
      });
      
      return {
        ...state,
        instructions,
        currentInstructionIndex: 0
      };
      
    case GameActionTypes.UPDATE_INSTRUCTION:
      const newIndex = (state.currentInstructionIndex + 1) % state.instructions.length;

      if (newIndex === 0) {
        const newInstructions = getRandomCategories().map(category => {
          const displayName = category.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          
          return {
            text: `Shoot the ${displayName} icons!`,
            category: AWS_ICON_CATEGORIES[category],
            displayName: displayName
          };
        });

        return {
          ...state,
          instructions: newInstructions,
          currentInstructionIndex: 0
        };
      }

      return {
        ...state,
        currentInstructionIndex: newIndex
      };
      
    case GameActionTypes.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted
      };
      
    case GameActionTypes.UPDATE_HIGH_SCORES:
      const newHighScores = [...action.payload]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      localStorage.setItem('highScores', JSON.stringify(newHighScores));
      return {
        ...state,
        highScores: newHighScores
      };
      
    default:
      return state;
  }
}; 