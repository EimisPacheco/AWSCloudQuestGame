export const ACHIEVEMENTS = {
  BEGINNER: {
    id: 'beginner_complete',
    title: 'AWS Rookie',
    description: 'Complete 5 beginner architectures',
    threshold: 5,
    icon: '🌟'
  },
  PERFECT_STREAK: {
    id: 'perfect_streak',
    title: 'Perfect Architect',
    description: 'Get 10 correct answers in a row',
    threshold: 10,
    icon: '🏆'
  }
  // Add more achievements...
};

class AchievementSystem {
  constructor() {
    this.achievements = new Set();
    this.listeners = new Set();
  }

  checkAchievement(type, value) {
    const achievement = ACHIEVEMENTS[type];
    if (achievement && value >= achievement.threshold && !this.achievements.has(achievement.id)) {
      this.unlockAchievement(achievement);
    }
  }

  unlockAchievement(achievement) {
    this.achievements.add(achievement.id);
    this.notifyListeners(achievement);
    soundManager.play('achievement');
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners(achievement) {
    this.listeners.forEach(listener => listener(achievement));
  }
}

export const achievementSystem = new AchievementSystem(); 