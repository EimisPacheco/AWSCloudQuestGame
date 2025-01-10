import React, { useState, useEffect, useRef } from 'react';
import MagicalQuestionCard from './MagicalQuestionCard';
import InputModal from './InputModal';
import { getPhrase, checkAnswer } from '../services/aiService';
import '../styles/Game.css';

const CATEGORIES = {
  SONG: { name: 'Song', points: 1 },
  MOVIE: { name: 'Movie', points: 2 },
  FAMOUS_PERSON: { name: 'Famous Person', points: 3 },
  FICTIONAL_CHARACTER: { name: 'Fictional Character', points: 3 },
  BOOK: { name: 'Book', points: 4 },
  POET: { name: 'Poet', points: 5 },
  QUOTE: { name: 'Quote', points: 6 }
};

const Game = ({ difficulty, numberOfRounds }) => {
  // State declarations
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [triggerEffect, setTriggerEffect] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentQuestionType, setCurrentQuestionType] = useState('source');
  const [phraseData, setPhraseData] = useState(null);
  const [previousScore, setPreviousScore] = useState(0);

  // Add new states for the conversation flow
  const [playerNickname, setPlayerNickname] = useState('');
  const [gamePhase, setGamePhase] = useState('greeting');
  const [aiMessage, setAiMessage] = useState('');

  // Add new states for bonus question flow
  const [isAwaitingBonusConfirmation, setIsAwaitingBonusConfirmation] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Add new state to track round points
  const [roundPoints, setRoundPoints] = useState(0);

  // Add this inside the Game component, with other state declarations
  const fireworksAudio = useRef(new Audio('https://hackthon-backend-files-ep-2024.s3.us-east-1.amazonaws.com/games/fireworks-sound.mp3'));

  useEffect(() => {
    // Initial greeting
    setAiMessage("👋 Hello, brilliant player! Welcome to 🎮 Legendary Lines Game !\nReady to test your memory and wit? Let's dive into a world of words and wonders!\n🎭 Choose an epic alias for your adventure!");
    setShowAnswerModal(true);
  }, []);

  const handlePlayerInput = async (input) => {
    switch(gamePhase) {
      case 'greeting':
        setPlayerNickname(input);
        setGamePhase('playing');
        setAiMessage(`${input}! Love that name! 🎯\nAlright hotshot, pick your poison - which category are you brave enough to tackle first? 💪`);
        setShowAnswerModal(false);
        break;

      case 'playing':
        if (!phraseData) {
          await handleCategorySelect(input.toUpperCase());
        } else {
          try {
            if (isAwaitingBonusConfirmation) {
              const bonusQuestion = {
                type: 'bonus_question',
                questionType: currentQuestionType,
                playerAnswer: input
              };
              
              const result = await checkAnswer(
                input, 
                'yes',
                'bonus_confirmation',
                [...conversationHistory, bonusQuestion]
              );

              if (result.isBonusResponse) {
                if (result.isCorrect) {
                  setIsAwaitingBonusConfirmation(false);
                  const promptMessage = currentQuestionType === 'year' 
                    ? "Enter the year..." 
                    : `Enter the ${selectedCategory === 'MOVIE' ? 'director' : 'artist'}...`;
                  setAiMessage(promptMessage);
                } else {
                  setAiMessage(`Alright! You keep your ${roundPoints} points for this round. 🎯`);
                  setTimeout(() => handleNextRound(), 2000);
                }
              }
              return;
            }
            
            const correctAnswer = currentQuestionType === 'creator' 
              ? phraseData.additionalInfo.creator 
              : phraseData[currentQuestionType];

            const result = await checkAnswer(
              input, 
              correctAnswer, 
              currentQuestionType,
              conversationHistory
            );
            
            handleAnswerResult(result);
          } catch (error) {
            console.error('Error checking answer:', error);
            setAiMessage('Sorry, there was an error checking your answer. Please try again.');
          }
        }
        break;
    }
  };

  const handleAnswerResult = (result) => {
    if (result.isCorrect) {
      const currentPoints = calculatePoints(selectedCategory, currentQuestionType);
      const newRoundPoints = roundPoints + currentPoints;
      setRoundPoints(newRoundPoints);
      setScore(previousScore + newRoundPoints);

      if (currentQuestionType === 'source') {
        setIsAwaitingBonusConfirmation(true);
        setCurrentQuestionType('year');
      } else if (currentQuestionType === 'year' && 
                ['MOVIE', 'SONG', 'BOOK'].includes(selectedCategory)) {
        setIsAwaitingBonusConfirmation(true);
        setCurrentQuestionType('creator');
      } else {
        const maxPoints = getMaxPointsForCategory(selectedCategory);
        
        if (newRoundPoints === maxPoints) {
          setTriggerEffect(prev => prev + 1);
          fireworksAudio.current.currentTime = 0;
          fireworksAudio.current.play();
          
          setTimeout(() => {
            fireworksAudio.current.pause();
            fireworksAudio.current.currentTime = 0;
          }, 5000);
        }
        
        setTimeout(() => handleNextRound(), 6000);
      }

      setStreak(prev => prev + 1);
      
      console.log('Score update:', {
        currentPoints,
        newRoundPoints,
        previousScore,
        newTotalScore: previousScore + newRoundPoints,
        category: selectedCategory,
        questionType: currentQuestionType
      });
    } else {
      handleIncorrectAnswer(result.feedback);
    }
    
    setAiMessage(result.feedback);
    updateConversationHistory(result.feedback, result.isCorrect);
  };

  // Update the conversation history function to include more context
  const updateConversationHistory = (feedback, wasCorrect) => {
    const newEntry = {
      round,
      category: selectedCategory,
      questionType: currentQuestionType,
      wasCorrect,
      feedback,
      isAwaitingBonus: isAwaitingBonusConfirmation,
      timestamp: new Date().toISOString()
    };
    setConversationHistory(prev => [...prev, newEntry]);
  };

  const handleCategorySelect = async (category) => {
    // Check if category was already played in conversation history
    const categoryPlayed = conversationHistory.some(
      entry => entry.category === category
    );

    setSelectedCategory(category);
    try {
      const data = await getPhrase(category, difficulty, categoryPlayed ? conversationHistory : undefined);
      setPhraseData(data);
      setAiMessage(`🎭 Here's your ${category.toLowerCase()} phrase:\n\n"${data.phrase}"\n\n🤔 Can you tell me the source?`);
      setTriggerEffect(prev => prev + 1);
      setCurrentQuestionType('source');
      setIsAwaitingBonusConfirmation(false);
      setTimeout(() => {
        setShowAnswerModal(true);
      }, 1000);
    } catch (error) {
      console.error('Error fetching phrase:', error);
      setAiMessage('😅 Oops! Had trouble fetching a phrase. Try another category!');
    }
  };

  const getPromptForPhase = (phase, questionType) => {
    switch (phase) {
      case 'greeting':
        return 'Enter your nickname...';
      case 'playing':
        switch (questionType) {
          case 'source':
            return 'Enter the source...';
          case 'year':
            return 'Enter the year...';
          case 'creator':
            switch (selectedCategory) {
              case 'MOVIE':
                return 'Enter the director...';
              case 'SONG':
                return 'Enter the artist/band...';
              case 'BOOK':
                return 'Enter the author...';
              default:
                return 'Enter the creator...';
            }
          default:
            return 'Enter your answer...';
        }
      default:
        return 'Enter your response...';
    }
  };

  const handleNextRound = () => {
    if (round < numberOfRounds) {
      setPreviousScore(score);
      setRoundPoints(0);
      setRound(prev => prev + 1);
      setSelectedCategory(null);
      setCurrentQuestionType('source');
      setPhraseData(null);
      setCurrentPhrase(null);
      setAiMessage(`Alright ${playerNickname}, you're on a roll! 🎲\nTime to conquer round ${round + 1}! Which category's calling your name? 🌟`);
    } else {
      // Game Over with more personality
      const finalMessage = score === (numberOfRounds * 6) 
        ? `🏆 ABSOLUTELY INCREDIBLE! ${score} POINTS?! You're not just a player, you're a LEGEND! Take a bow, champion! 🎉` 
        : `Game over, superstar! ${score} points - not too shabby! 🌟 Come back and show me what else you've got! 💪`;
      setAiMessage(finalMessage);
      setGamePhase('completed');
    }
    setShowAnswerModal(false);
  };

  const handleIncorrectAnswer = (feedback) => {
    setTriggerEffect(prev => prev + 1);
    setScore(previousScore);
    setStreak(0);
    
    setTimeout(() => {
      handleNextRound();
    }, 5000);
  };

  const calculatePoints = (category, questionType) => {
    const basePoints = CATEGORIES[category].points;
    switch (questionType) {
        case 'source': return basePoints;
        case 'year': return basePoints * 2;
        case 'creator': return basePoints * 3;
        default: return basePoints;
    }
  };

  // Update getMaxPointsForCategory to be more precise
  const getMaxPointsForCategory = (category) => {
    const basePoints = CATEGORIES[category].points;
    
    if (['SONG', 'MOVIE', 'BOOK'].includes(category)) {
      // For Song (1 point base):
      // Base (1) + Year (2) + Artist (3) = 6 points total
      return basePoints + (basePoints * 2) + (basePoints * 3);
    }
    
    // For other categories:
    // Base + Year (double) = Base * 3 total
    return basePoints * 3;
  };

  // Helper function to calculate points lost on incorrect answer
  const calculatePointsLost = () => {
    const pointsEarned = score - previousScore;
    return pointsEarned > 0 ? pointsEarned : 0;
  };

  function handleInputSubmission(inputValue) {
    // Ensure inputValue is being processed correctly
    if (inputValue) {
        // Logic to send inputValue to the AI
        console.log("My input value is:", inputValue);
        handlePlayerInput(inputValue);
    } else {
        console.error("Input value is empty");
    }
  }

  // Update isRoundComplete to check against maxPoints
  const isRoundComplete = (category, currentScore, prevScore) => {
    if (!category || !CATEGORIES[category]) {
      return false;
    }
    
    const maxPoints = getMaxPointsForCategory(category);
    console.log('Round completion check:', {
      category,
      roundPoints,
      maxPoints,
      currentScore,
      prevScore
    });
    
    return roundPoints === maxPoints;
  };

  // Add cleanup for audio when component unmounts
  useEffect(() => {
    return () => {
      fireworksAudio.current.pause();
      fireworksAudio.current.currentTime = 0;
    };
  }, []);

  // JSX Return
  return (
    <div className="game-container">
      <div className="game-header">
        <div>Round: {round}/{numberOfRounds}</div>
        <div>Score: {score}</div>
        <div>Streak: {streak}</div>
      </div>

      <MagicalQuestionCard 
        message={aiMessage}
        triggerEffect={triggerEffect}
        isRoundComplete={selectedCategory ? isRoundComplete(selectedCategory, score, previousScore) : false}
      />

      <InputModal 
        isOpen={showAnswerModal}
        onSubmit={handleInputSubmission}
        prompt={getPromptForPhase(gamePhase, currentQuestionType)}
      />

      {gamePhase === 'playing' && (
        <div className="category-selector">
          <h3>Available Categories:</h3>
          <div className="category-buttons">
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <button
                key={key}
                className={`category-btn ${selectedCategory === key ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(key)}
              >
                {value.name}
                <span className="points">({value.points} pts)</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;