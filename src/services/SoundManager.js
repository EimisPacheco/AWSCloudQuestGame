class SoundManager {
  constructor() {
    this.sounds = {
      correct: new Audio('/sounds/correct.mp3'),
      incorrect: new Audio('/sounds/incorrect.mp3'),
      hover: new Audio('/sounds/hover.mp3'),
      select: new Audio('/sounds/select.mp3'),
      achievement: new Audio('/sounds/achievement.mp3')
    };
    
    this.enabled = true;
  }

  play(soundName) {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}

export const soundManager = new SoundManager(); 