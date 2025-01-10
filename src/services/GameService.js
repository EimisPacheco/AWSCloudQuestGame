import { create } from 'zustand';
import { API, Auth, DataStore } from 'aws-amplify';
import { Game, Player, Leaderboard } from './models';

export const useGameStore = create((set) => ({
  currentGame: null,
  players: [],
  leaderboard: [],
  
  // Update local state
  updateGame: (gameData) => set({ currentGame: gameData }),
  updatePlayers: (players) => set({ players }),
  
  // AWS Amplify integration
  startMultiplayerGame: async (userId) => {
    try {
      const game = await DataStore.save(
        new Game({
          hostId: userId,
          status: 'waiting',
          players: [userId],
          timestamp: new Date().toISOString()
        })
      );
      
      // Subscribe to real-time updates
      const subscription = DataStore.observe(Game, game.id).subscribe(msg => {
        set({ currentGame: msg.element });
      });
      
      return game.id;
    } catch (error) {
      console.error('Error starting game:', error);
    }
  },
  
  updateLeaderboard: async (score) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await API.post('gameApi', '/leaderboard', {
        body: {
          userId: user.username,
          score: score,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  },
  
  fetchLeaderboard: async () => {
    try {
      const leaderboardData = await API.get('gameApi', '/leaderboard');
      set({ leaderboard: leaderboardData });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }
})); 