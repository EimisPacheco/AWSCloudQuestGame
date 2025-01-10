import React, { useEffect, useRef, useState } from 'react';
import '../styles/GameCanvas.css';
import { AWS_ICON_CATEGORIES, SERVICE_MAPPINGS } from '../services/IconResolver';

// Add these constants from IconResolver.js
const S3_BUCKET_URL = 'https://hackthon-backend-files-ep-2024.s3.amazonaws.com';
const ICONS_BASE_PATH = '/amazon-icons-set/Architecture-Service-Icons_06072024';
const S3_ROCKET_PATH = `${S3_BUCKET_URL}/games/rocket`;
const DEFAULT_ROCKET = `${S3_ROCKET_PATH}/rocket1.png`;
const FIREBALL_PATH = `${S3_BUCKET_URL}/games/bullet/fireball.png`;

const GameCanvas = () => {
  // First, declare all state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [selectedRocket, setSelectedRocket] = useState(() => {
    const savedRocket = localStorage.getItem('selectedRocket');
    return savedRocket || null;
  });
  const [showNameModal, setShowNameModal] = useState(true);
  const [tempPlayerName, setTempPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [playerName, setPlayerName] = useState(() => {
    const savedName = localStorage.getItem('playerName');
    return savedName || '';
  });
  const [rocketPosition, setRocketPosition] = useState({ x: 375, y: 550 });

  // Modify the instructions state initialization
  const [instructions] = useState(() => {
    const getRandomCategories = () => {
      const categories = Object.keys(AWS_ICON_CATEGORIES);
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      // Get all categories instead of just one
      return shuffled.map(category => {
        const displayName = category.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        return {
          text: `Shoot the ${displayName} icons!`,
          category: AWS_ICON_CATEGORIES[category],
          displayName: displayName
        };
      });
    };

    return getRandomCategories();
  });

  // Generate iconTypes based on the selected categories
  const [iconTypes] = useState(() => {
    return instructions.reduce((acc, instruction) => {
      const categoryServices = Object.entries(SERVICE_MAPPINGS)
        .filter(([_, path]) => path.includes(instruction.category))
        .map(([name, path]) => ({
          path: `${S3_BUCKET_URL}${ICONS_BASE_PATH}/${path}`,
          name: name
        }));

      acc[instruction.category] = categoryServices;
      return acc;
    }, {});
  });

  // Then declare refs
  const canvasRef = useRef(null);
  const iconsRef = useRef([]);
  const bulletsRef = useRef([]);
  const feedbacksRef = useRef([]);
  const rocketImage = useRef(new Image());
  const gameStateRef = useRef({
    iconsCount: 0,
    bulletsCount: 0,
    timeLeft: 60,
    score: 0,
    changingCategory: false
  });
  const fireballImage = new Image();
  fireballImage.src = FIREBALL_PATH;

  // Gun info
  const gunRef = useRef({
    x: 400 - 25,
    y: 800 - 100,
    width: 120,
    height: 120,
  });

  // Load rocket image
  useEffect(() => {
    if (selectedRocket) {
      rocketImage.current = new Image();
      rocketImage.current.onload = () => {
        console.log("Rocket image loaded successfully");
      };
      rocketImage.current.onerror = (e) => {
        console.error("Error loading rocket image:", e);
      };
      rocketImage.current.src = selectedRocket;
    }
  }, [selectedRocket]);

  // Function to get random X
  const getRandomX = () => {
    const canvas = canvasRef.current;
    return Math.floor(Math.random() * (canvas.width - 50));
  };

  // Add this state at the top with other states
  const [currentMission, setCurrentMission] = useState({
    category: '',
    displayName: '',
    targetIcons: []
  });

  // Add a state for empty icons
  const [iconsEmpty, setIconsEmpty] = useState(false);

  // Modify the initialization useEffect
  useEffect(() => {
    if (!canvasRef.current || !gameStarted || !selectedRocket || gameInitialized) {
      return;
    }

    console.log("Initializing game for the first time");
    
    const canvas = canvasRef.current;
    canvas.width = 1200;
    canvas.height = 800;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;

    // Initialize first category and mission
    const firstCategory = instructions[0];
    const categoryIcons = Object.entries(SERVICE_MAPPINGS)
      .filter(([_, path]) => path.includes(firstCategory.category))
      .map(([name]) => name);
    
    const selectedTargets = [...categoryIcons]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    
    setCurrentMission({
      category: firstCategory.category,
      displayName: firstCategory.displayName,
      targetIcons: selectedTargets
    });

    // Generate initial icons
    generateNewIcons(firstCategory.category, selectedTargets);
    setGameInitialized(true);

    return () => {
      setGameInitialized(false);
    };
  }, [gameStarted, selectedRocket]);

  // Separate useEffect for game loop
  useEffect(() => {
    if (!gameInitialized || !canvasRef.current) return;

    console.log("Starting game loop");
    const gameLoopId = requestAnimationFrame(gameLoop);

    return () => {
      console.log("Cleaning up game loop");
      cancelAnimationFrame(gameLoopId);
    };
  }, [gameInitialized]);

  // Separate useEffect for initial mission
  useEffect(() => {
    if (!gameInitialized || !currentMission.category) return;

    console.log("Setting up initial mission");
    generateNewIcons(currentMission.category, currentMission.targetIcons);
  }, [gameInitialized, currentMission.category]);

  // Update the useEffect that handles category changes
  useEffect(() => {
    if (!iconsEmpty || !gameStarted || !timeLeft) return;

    console.log('\n🔄 CHANGING CATEGORY');
    
    const nextIndex = (currentInstructionIndex + 1) % instructions.length;
    const nextCategory = instructions[nextIndex];
    
    console.log(`Current Index: ${currentInstructionIndex}`);
    console.log(`Next Index: ${nextIndex}`);
    console.log(`Next Category: ${nextCategory.displayName}`);
    
    // Get icons for next category with validation
    const categoryIcons = Object.entries(SERVICE_MAPPINGS)
      .filter(([_, path]) => path.includes(nextCategory.category))
      .map(([name]) => name);
    
    if (categoryIcons.length === 0) {
      console.error('❌ No icons found for category:', nextCategory.category);
      return;
    }

    // Always select exactly 4 target icons, with duplicates if necessary
    let selectedTargets = [];
    while (selectedTargets.length < 4) {
      const availableIcons = categoryIcons.filter(icon => 
        selectedTargets.filter(target => target === icon).length < 2
      );
      
      if (availableIcons.length === 0) {
        // If we can't find any more unique icons, duplicate from existing targets
        selectedTargets.push(selectedTargets[0]);
      } else {
        const randomIcon = availableIcons[Math.floor(Math.random() * availableIcons.length)];
        selectedTargets.push(randomIcon);
      }
    }
    
    console.log('Selected Target Icons:', selectedTargets);
    
    // Update mission with new targets
    const newMission = {
      category: nextCategory.category,
      displayName: nextCategory.displayName,
      targetIcons: selectedTargets
    };
    
    // First update the mission
    setCurrentMission(newMission);
    setCurrentInstructionIndex(nextIndex);
    
    // Then generate new icons using the new mission data
    generateNewIcons(newMission.category, selectedTargets);
    setIconsEmpty(false);
  }, [iconsEmpty, gameStarted, timeLeft]);

  // Show feedback
  const showFeedback = (x, y, isCorrect, points, iconName) => {
    feedbacksRef.current.push({
      x,
      y,
      isCorrect,
      points,
      name: iconName,
      time: Date.now(),
    });
  };

  // Check collisions and update score
  const checkCollisions = () => {
    const bullets = bulletsRef.current;
    const icons = iconsRef.current;
    const canvas = canvasRef.current;

    icons.forEach((icon, iconIndex) => {
      bulletsRef.current = bulletsRef.current.filter((bullet) => {
        if (
          bullet.x > icon.x &&
          bullet.x < icon.x + 50 &&
          bullet.y > icon.y &&
          bullet.y < icon.y + 50
        ) {
          icon.hit = true;

          // Check if this is a target icon
          const isCorrectIcon = icon.isTarget;

          if (isCorrectIcon) {
            const heightPercentage = 1 - (icon.y / canvas.height);
            const heightBonus = Math.floor(heightPercentage * 20);
            const points = 5 + heightBonus;
            
            setScore((prev) => {
              if (prev + points > Math.max(...highScores.map(s => s.score))) {
                showCheerleaderMessage('highScore');
              } else if (heightBonus > 15) {
                showCheerleaderMessage('goodShot');
              }
              return prev + points;
            });
            showFeedback(icon.x, icon.y, true, points, icon.name);
            playSound('correct');
            createExplosion(icon.x + 25, icon.y + 25, '#4CAF50');
          } else {
            setScore((prev) => prev - 5);
            showFeedback(icon.x, icon.y, false, -5, icon.name);
            playSound('incorrect');
          }

          icons.splice(iconIndex, 1);
          return false;
        }
        return true;
      });
    });
  };

  // The main game loop
  const gameLoop = () => {
    if (!gameStarted || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update game state ref silently
    gameStateRef.current = {
      iconsCount: iconsRef.current.length,
      bulletsCount: bulletsRef.current.length,
      timeLeft: timeLeft,
      score: score
    };

    if (gameStarted) {
      // Draw the rocket (gun)
      const { x: gunX, y: gunY, width, height } = gunRef.current;
      ctx.drawImage(rocketImage.current, gunX, gunY, width, height);

      // Draw icons
      iconsRef.current.forEach((icon) => {
        if (!icon.hit) {
          ctx.save();
          const radius = 10;
          const x = icon.x;
          const y = icon.y;
          const width = 50;
          const height = 50;
          
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.clip();
          
          ctx.drawImage(icon.image, x, y, width, height);
          ctx.restore();
          
          icon.y += 0.7; 
        }
      });

      // Filter icons off-screen
      iconsRef.current = iconsRef.current.filter(icon => icon.y < canvas.height);

      // Check for empty icons and generate new category
      if (iconsRef.current.length === 0 && !iconsEmpty) {
        setIconsEmpty(true);
      }

      // Draw bullets
      bulletsRef.current.forEach((bullet) => {
        ctx.drawImage(fireballImage, bullet.x, bullet.y, 20, 20);
        bullet.y -= 5;
      });
      bulletsRef.current = bulletsRef.current.filter((b) => b.y > 0);

      // Draw feedback
      const now = Date.now();
      feedbacksRef.current = feedbacksRef.current.filter((feedback) => {
        const elapsed = now - feedback.time;
        if (elapsed < 3000) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.fillStyle = feedback.isCorrect ? '#4CAF50' : '#F44336';
          ctx.font = 'bold 28px Arial';

          // Points text
          const pointsText = feedback.points > 0 ? `+${feedback.points}` : `${feedback.points}`;
          ctx.fillText(pointsText, feedback.x + 10, feedback.y - 20);

          // Icon name
          ctx.font = '16px Arial';
          ctx.fillText(feedback.name, feedback.x + 60, feedback.y + 25);

          // Checkmark or X
          ctx.font = 'bold 55px Arial';
          ctx.fillText(feedback.isCorrect ? '✔' : '✘', feedback.x + 10, feedback.y + 30);

          ctx.shadowBlur = 0;
          return true;
        }
        return false;
      });

      checkCollisions();

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        if (particle.lifetime > 0 && particle.size > 0) {
          particle.update();
          particle.draw(ctx);
          return true;
        }
        return false;
      });
    }

    // Only request next frame if game is still running
    if (gameStarted && !gameOver) {
      requestAnimationFrame(gameLoop);
    }
  };

  // Sounds
  const sounds = useRef({});
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  useEffect(() => {
    const soundFiles = {
      shoot:  `${S3_BUCKET_URL}/games/sounds/pistol_sound.mp3`,
      correct: `${S3_BUCKET_URL}/games/sounds/correct_sound.mp3`,
      incorrect: `${S3_BUCKET_URL}/games/sounds/incorrect_sound.mp3`,
      levelup: `${S3_BUCKET_URL}/games/sounds/levelup.mp3`
    };

    const createSafeAudio = (path) => {
      const audio = new Audio();
      return new Promise((resolve) => {
        audio.addEventListener('error', () => {
          console.warn(`Sound file not found: ${path}`);
          resolve(null);
        });
        audio.addEventListener('canplaythrough', () => {
          resolve(audio);
        });
        setTimeout(() => resolve(null), 2000);
        audio.src = path;
      });
    };

    const loadSounds = async () => {
      const loadedSounds = {};
      for (const [key, path] of Object.entries(soundFiles)) {
        loadedSounds[key] = await createSafeAudio(path);
      }
      sounds.current = loadedSounds;
      setSoundsLoaded(true);
    };
    loadSounds();

    return () => {
      Object.values(sounds.current).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.src = '';
        }
      });
    };
  }, []);

  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    Object.values(sounds.current).forEach(sound => {
      if (sound) {
        sound.muted = !sound.muted;
      }
    });
  };

  const playSound = (soundName) => {
    const sound = sounds.current[soundName];
    if (sound && !isMuted) {
      try {
        sound.currentTime = 0;
        sound.volume = 0.3;
        sound.play().catch(err => {
          console.warn(`Error playing sound ${soundName}:`, err);
        });
      } catch (err) {
        console.warn(`Error with sound ${soundName}:`, err);
      }
    }
  };

  // Particles and timer
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : [];
  });
  const [gameOver, setGameOver] = useState(false);
  const particlesRef = useRef([]);
  const [gameOverHandled, setGameOverHandled] = useState(false);

  useEffect(() => {
    return () => {
      setGameStarted(false);
      setShowRocketModal(true);
    };
  }, []);

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = Math.random() * 3 + 2;
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 6 - 3;
      this.lifetime = 1;
      this.initialSize = this.size;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.lifetime -= 0.02;
      this.size = Math.max(0, this.initialSize * this.lifetime);
    }
    draw(ctx) {
      if (this.size <= 0) return;
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.lifetime;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  const createExplosion = (x, y, color) => {
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push(new Particle(x, y, color));
    }
  };

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !gameOverHandled) {
      handleGameOver();
    }
  }, [timeLeft, gameOver, gameOverHandled, gameStarted]);

  const handleGameOver = () => {
    if (gameOverHandled) return;
    setGameOver(true);
    setGameOverHandled(true);
    
    const newScore = { name: playerName, score };
    const newHighScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    setHighScores(newHighScores);
    localStorage.setItem('highScores', JSON.stringify(newHighScores));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      let newX = e.clientX - rect.left - (gunRef.current.width / 2);
      newX = Math.max(-30, Math.min(newX, canvas.width - gunRef.current.width + 30));
      gunRef.current.x = newX;
    };

    const handleCanvasClick = () => {
      if (gameStarted && timeLeft > 0) {
        playSound('shoot');
        bulletsRef.current.push({
          x: gunRef.current.x + gunRef.current.width / 2 - 10,
          y: gunRef.current.y - 20,
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [gameStarted]);

  useEffect(() => {
    localStorage.removeItem('playerName');
    localStorage.removeItem('selectedRocket');
  }, []);

  const [showRocketModal, setShowRocketModal] = useState(true);

  const rocketOptions = [
    { id: `${S3_ROCKET_PATH}/rocket1.png`, name: 'Modern Rocket' },
    { id: `${S3_ROCKET_PATH}/rocket2.png`, name: 'Power Rocket' },
    { id: `${S3_ROCKET_PATH}/rocket3.png`, name: 'Stealth Rocket' },
    { id: `${S3_ROCKET_PATH}/rocket4.png`, name: 'Classic Rocket' },
  ];

  const handleRocketSelect = (rocketId) => {
    setSelectedRocket(rocketId);
    localStorage.setItem('selectedRocket', rocketId);
    rocketImage.current.src = rocketId;
    setShowRocketModal(false);
    setGameStarted(true);
  };

  const [cheerMessage, setCheerMessage] = useState('');
  const [showCheerMessage, setShowCheerMessage] = useState(false);

  const cheerleaderMessages = {
    goodShot: [
      "Great shot! You're an AWS Pro! 🌟",
      "Amazing cloud skills! Keep it up! 🎯",
      "You're on fire in the cloud! 🔥",
      "That's how AWS experts do it! 👏",
    ],
    combo: [
      "Cloud combo! 🎮",
      "You're scaling infinitely! ⚡",
      "What an AWS streak! 🌈",
    ],
    timeWarning: [
      "30 seconds left - you're highly available! ⏰",
      "Time for the final deployment! 💪",
      "Make every compute unit count! ⭐",
    ],
    encouragement: [
      "You've got this, cloud warrior! 🚀",
      "Keep going! You're AWS certified material! ",
      "I believe in your cloud powers! 💫",
      "Show them your AWS expertise! 💪",
    ],
    highScore: [
      "New high score! You're going serverless! 🏆",
      "You're breaking cloud records! 🎖️",
      "Legendary AWS performance! 👑",
    ]
  };

  const showCheerleaderMessage = (category) => {
    const messages = cheerleaderMessages[category];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCheerMessage(randomMessage);
    setShowCheerMessage(true);
    setTimeout(() => {
      setShowCheerMessage(false);
    }, 3000);
  };

  useEffect(() => {
    const encouragementInterval = setInterval(() => {
      if (timeLeft > 0 && Math.random() < 0.3) {
        showCheerleaderMessage('encouragement');
      }
    }, 10000);
    return () => clearInterval(encouragementInterval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 30) {
      showCheerleaderMessage('timeWarning');
    }
  }, [timeLeft]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (tempPlayerName.trim().length < 2) {
      setNameError('Name must be at least 2 characters long');
      return;
    }
    if (tempPlayerName.trim().length > 15) {
      setNameError('Name must be less than 15 characters');
      return;
    }
    setPlayerName(tempPlayerName.trim());
    localStorage.setItem('playerName', tempPlayerName.trim());
    setShowNameModal(false);
  };

  // Update the generateNewIcons function with detailed logging
  const generateNewIcons = (category, targetIcons) => {
    console.log('\n==== GENERATING NEW ICONS ====');
    console.log('Current Category:', category);
    console.log('Target Icons:', targetIcons);
    
    if (!targetIcons || targetIcons.length !== 4) {
      console.error('❌ Invalid target icons count:', targetIcons?.length);
      return;
    }
    
    iconsRef.current = [];
    const positions = [];
    
    // Get ALL possible distractor icons
    const otherIcons = Object.entries(SERVICE_MAPPINGS)
      .filter(([name, path]) => {
        const isCurrentCategory = path.includes(category);
        const isTargetIcon = targetIcons.includes(name);
        return !isCurrentCategory && !isTargetIcon;
      })
      .map(([name, path]) => ({
        path: `${S3_BUCKET_URL}${ICONS_BASE_PATH}/${path}`,
        name: name,
        category: path.split('/')[1]
      }));

    // Always select exactly 6 distractor icons
    const selectedOtherIcons = [...otherIcons]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    if (selectedOtherIcons.length < 6) {
      console.error('❌ Not enough distractor icons:', selectedOtherIcons.length);
      return;
    }

    // Combine all icons (4 targets + 6 distractors = 10 total)
    const gameIcons = [
      ...targetIcons.map(name => ({
        path: `${S3_BUCKET_URL}${ICONS_BASE_PATH}/${SERVICE_MAPPINGS[name]}`,
        name: name,
        category: category,
        isTarget: true
      })),
      ...selectedOtherIcons.map(icon => ({
        ...icon,
        isTarget: false
      }))
    ];

    console.log('\nAdding Icons to Game:');
    console.log('Total Icons:', gameIcons.length);
    console.log('Target Icons:', gameIcons.filter(icon => icon.isTarget).map(icon => icon.name));
    console.log('Distractor Icons:', gameIcons.filter(icon => !icon.isTarget).map(icon => icon.name));

    // Add all icons to the game
    gameIcons.forEach((iconInfo) => {
      let x = getRandomX();
      while (positions.some((pos) => Math.abs(pos - x) < 50)) {
        x = getRandomX();
      }
      positions.push(x);

      const iconImage = new Image();
      iconImage.src = iconInfo.path;

      iconsRef.current.push({
        x,
        y: -50,
        type: iconInfo.category,
        name: iconInfo.name,
        image: iconImage,
        hit: false,
        isTarget: iconInfo.isTarget
      });
    });

    console.log('\nIcons Generated Successfully');
    console.log('============================\n');
  };

  return (
    <div className="gameCanvas-container">
      <h1 className="gameCanvas-game-title">AWS Cloud Shooter</h1>
      <div className="gameCanvas-game-content">
        <div className="gameCanvas-canvas-wrapper">
          <canvas ref={canvasRef} className="gameCanvas-game-canvas" />
        </div>
        <div className="gameCanvas-instruction-panel">
          <div className="gameCanvas-player-info">
            <div className="gameCanvas-player-name">
              Player: {playerName}
            </div>
            <div className="gameCanvas-score-display">
              <span role="img" aria-label="alien">👾</span>{' '}
              Score: {score}{' '}
              <span role="img" aria-label="joystick">🕹️</span>
              {soundsLoaded && Object.values(sounds.current).some(sound => sound) && (
                <button 
                  className="gameCanvas-sound-toggle"
                  onClick={toggleMute}
                  aria-label="Toggle sound"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              )}
            </div>
          </div>

          <div className="gameCanvas-timer-display">
            Time: {timeLeft}s
          </div>

          <div className="gameCanvas-score-explanation">
            <h4>How to Score:</h4>
            <ul>
              <li>• Hit correct icon: +5 points</li>
              <li>• Height bonus: up to +20</li>
              <li>• Wrong hit: -5 points</li>
              <li>• Tip: Shoot icons as high as possible!</li>
            </ul>
          </div>

          <div className="gameCanvas-high-scores">
            <h4>High Scores</h4>
            <ul>
              {highScores.map((entry, index) => (
                <li key={index}>
                  <span className="gameCanvas-high-score-name">{entry.name}:</span> {entry.score}
                </li>
              ))}
            </ul>
          </div>

          <div className="gameCanvas-mission-container">
            <h3 className="gameCanvas-mission-title">
              Current Mission
            </h3>
            <div className="gameCanvas-mission-text">
              {instructions[currentInstructionIndex].text}
            </div>
          </div>
        </div>
      </div>

      {showRocketModal && (
        <div className="gameCanvas-modal-overlay">
          <div className="gameCanvas-rocket-selection-modal">
            <h2>Choose Your Rocket</h2>
            <div className="gameCanvas-rocket-grid">
              {rocketOptions.map((rocket) => (
                <div 
                  key={rocket.id} 
                  className={`gameCanvas-rocket-option ${selectedRocket === rocket.id ? 'selected' : ''}`}
                  onClick={() => handleRocketSelect(rocket.id)}
                >
                  <img 
                    src={rocket.id} 
                    alt={rocket.name}
                  />
                  <p>{rocket.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="gameCanvas-game-over">
          <h3>Game Over!</h3>
          <button onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}

      {showCheerMessage && (
        <div className="gameCanvas-cheerleader-container">
          <div className="gameCanvas-cheerleader-character">
            <img src={`${S3_BUCKET_URL}/games/utilities/cheerleader.png`} alt="Cheerleader"   style={{ 
                borderRadius: '20px'
              }} />
          </div>
          <div className="gameCanvas-cheer-message" style={{
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontSize: '18px',
            color: '#333',
            maxWidth: '300px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1000
          }}>
            {cheerMessage}
          </div>
        </div>
      )}

      {showNameModal && (
        <div className="gameCanvas-modal-overlay">
          <div className="gameCanvas-modal">
            <h2>Welcome to AWS Cloud Shooter!</h2>
            <p>Enter your name to start the game:</p>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={tempPlayerName}
                onChange={(e) => {
                  setTempPlayerName(e.target.value);
                  setNameError('');
                }}
                placeholder="Your name"
                className="gameCanvas-name-input"
                autoFocus
              />
              {nameError && <div className="gameCanvas-name-error">{nameError}</div>}
              <button type="submit" className="gameCanvas-start-button">
                Start Game
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
