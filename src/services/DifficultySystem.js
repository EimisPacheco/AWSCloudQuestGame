const PROGRESSION_RULES = {
  BEGINNER: {
    minScore: 0,
    maxScore: 500,
    nextLevel: 'INTERMEDIATE',
    requiredCorrectAnswers: 5
  },
  INTERMEDIATE: {
    minScore: 501,
    maxScore: 1500,
    nextLevel: 'ADVANCED',
    requiredCorrectAnswers: 10
  },
  ADVANCED: {
    minScore: 1501,
    maxScore: Infinity,
    requiredCorrectAnswers: 15
  }
};

class DifficultySystem {
  constructor() {
    this.currentDifficulty = 'BEGINNER';
    this.correctAnswers = 0;
    this.totalAnswers = 0;
  }

  updateProgress(correct) {
    this.totalAnswers++;
    if (correct) this.correctAnswers++;
    
    const currentRule = PROGRESSION_RULES[this.currentDifficulty];
    if (this.correctAnswers >= currentRule.requiredCorrectAnswers) {
      this.tryLevelUp();
    }
  }

  tryLevelUp() {
    const currentRule = PROGRESSION_RULES[this.currentDifficulty];
    if (currentRule.nextLevel) {
      this.currentDifficulty = currentRule.nextLevel;
      this.correctAnswers = 0;
      return true;
    }
    return false;
  }

  getCurrentDifficulty() {
    return this.currentDifficulty;
  }

  getProgress() {
    const currentRule = PROGRESSION_RULES[this.currentDifficulty];
    return {
      difficulty: this.currentDifficulty,
      progress: (this.correctAnswers / currentRule.requiredCorrectAnswers) * 100,
      nextLevel: currentRule.nextLevel
    };
  }
}

export const difficultySystem = new DifficultySystem(); 