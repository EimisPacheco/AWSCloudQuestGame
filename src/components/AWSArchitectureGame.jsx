import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AWSArchitectureDisplay from './AWSArchitectureDisplay';
import DraggableService from './DraggableService';
import { getCachedServiceIcon, SERVICE_MAPPINGS } from '../services/IconResolver';
import '../styles/DifficultyButtons.css';
import '../styles/AWSArchitectureGame.css';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const S3_BUCKET_URL = 'https://hackthon-backend-files-ep-2024.s3.amazonaws.com';
const ICONS_BASE_PATH = '/amazon-icons-set/Architecture-Service-Icons_06072024';
const API_URL = 'https://p7bwtrx47e.execute-api.us-east-1.amazonaws.com/stage/amazon-architecture';

const isValidArchitecture = (data) => {
  if (!data || !Array.isArray(data.services) || !Array.isArray(data.connections)) {
    console.warn("⚠️ Invalid JSON structure: Missing 'services' or 'connections'. Retrying...");
    return false;
  }

  const requiredMissingServices = ['missing_1', 'missing_2', 'missing_3'];

  const serviceNames = data.services.map(service => 
    typeof service === 'string' ? service : service?.name
  );

  if (!requiredMissingServices.every(ms => serviceNames.includes(ms))) {
    console.warn(`⚠️ JSON is invalid: One or more missing services (${requiredMissingServices.join(', ')}) are missing.`);
    return false;
  }

  const connectionNodes = new Set();
  data.connections.forEach(conn => {
    connectionNodes.add(conn.from);
    connectionNodes.add(conn.to);
  });

  if (!requiredMissingServices.every(ms => connectionNodes.has(ms))) {
    console.warn(`⚠️ JSON is invalid: One or more missing services (${requiredMissingServices.join(', ')}) are missing from the connections.`);
    return false;
  }

  return true;
};

const validateJSONStructure = (json, difficulty) => {
  let requiredMissingServices = ['missing_1', 'missing_2', 'missing_3'];

  if (difficulty === 'INTERMEDIATE') {
    requiredMissingServices = ['missing_1', 'missing_2', 'missing_3', 'missing_4', 'missing_5'];
  } else if (difficulty === 'ADVANCED') {
    requiredMissingServices = ['missing_1', 'missing_2', 'missing_3', 'missing_4', 'missing_5', 'missing_6', 'missing_7'];
  }

  return requiredMissingServices.every(service => json.missingServices.includes(service));
};

const getMaxPossibleScore = (difficulty) => {
  switch(difficulty) {
    case 'INTERMEDIATE':
      return 25; // 5 questions * 5 points
    case 'ADVANCED':
      return 35; // 7 questions * 5 points
    default: // BEGINNER
      return 15; // 3 questions * 5 points
  }
};

const AWSArchitectureGame = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [architecture, setArchitecture] = useState(null);
    const [architectureInfo, setArchitectureInfo] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [difficulty, setDifficulty] = useState('BEGINNER');
    const [score, setScore] = useState(0); 
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState({ isCorrect: false, message: '', points: 0 });
    const [currentMissingServiceIndex, setCurrentMissingServiceIndex] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [showSadFace, setShowSadFace] = useState(false);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(TouchSensor)
    );

    const getServiceIcon = (serviceName) => {
      if (!serviceName) {
        console.error('No service name provided to getServiceIcon');
        return null;
      }

      if (serviceName.toLowerCase().includes('missing')) {
        console.log('Loading missing service icon locally:', '/aws-icons/missing.svg');
        return '/aws-icons/missing.svg';
      }

      const cleanedServiceName = serviceName
        .toLowerCase()
        .replace(/^(amazon|aws)\s+/, '')
        .replace(/\s+/g, '-');
        
      const potentialS3Url = `${S3_BUCKET_URL}${ICONS_BASE_PATH}/Arch_${cleanedServiceName}_64.svg`;
      console.log(`🔍 Attempting to load icon for "${serviceName}" from: ${potentialS3Url}`);

      const resolvedIcon = getCachedServiceIcon(serviceName);
      
      if (resolvedIcon) {
        console.log(`✅ Successfully resolved icon for "${serviceName}": ${resolvedIcon}`);
        return resolvedIcon;
      }

      console.warn(`❌ Icon not found for "${serviceName}" at attempted path: ${potentialS3Url}`);
      return '/aws-icons/default.svg';
    };

    const loadNextArchitecture = useCallback(async () => {
      setScore(0); // Reset score when loading new architecture
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      let attempt = 0;
      let isValid = false;
      let data = null;
      let maxAttempts = 7;

      while (!isValid && attempt < maxAttempts) {
        try {
          console.log(`🔄 Attempt ${attempt + 1}: Fetching architecture data...`);
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty })
          });

          if (response.status === 503) {
            console.warn("⚠️ Received 503 error. Retrying in 3 seconds...");
            attempt++;
            await new Promise(resolve => setTimeout(resolve, 3000));
            continue;
          }

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          data = await response.json();
          console.log('Raw AI Response:', JSON.stringify(data, null, 2));
          console.log("📥 Received AI Response:", JSON.stringify(data, null, 2));

          isValid = isValidArchitecture(data);

          if (!isValid) {
            console.warn(`⛔ Invalid JSON structure. Retrying in 3 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
            console.log("✅ Valid architecture received, updating state...");
            break;
          }
        } catch (error) {
          console.error("❌ Failed to load architecture:", error);
          if (attempt >= maxAttempts - 1) {
            setError(error.message);
            setIsLoading(false);
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
        }

        attempt++;
      }

      if (!isValid) {
        console.error("❌ Maximum retries reached. Unable to get valid JSON.");
        setError("Failed to fetch a valid architecture after multiple attempts.");
        setIsLoading(false);
        return;
      }

      const transformedServices = data.services.map(serviceName => ({
        id: serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: serviceName,
        icon: getServiceIcon(serviceName)
      }));

      setArchitecture({
        services: transformedServices,
        connections: data.connections
      });

      if (data.missingServices?.length > 0) {
        const currentMissingService = data.missingServices[0];
        setCurrentQuestion({
          text: currentMissingService.question,
          optimizationFocus: currentMissingService.optimizationFocus,
          options: currentMissingService.options.map(opt => ({
            id: opt.service.toLowerCase().replace(/\s+/g, '-'),
            name: opt.service,
            isCorrect: opt.isCorrect,
            isOptimal: opt.isOptimal,
            explanation: opt.explanation,
            rating: opt.rating,
            icon: getServiceIcon(opt.service)
          }))
        });
      }

      setArchitectureInfo({
        name: data.architecture.name,
        description: data.architecture.description,
        missingServices: data.missingServices
      });

      setCurrentMissingServiceIndex(0);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
      setElapsedTime(0);
      setIsLoading(false);
    }, [difficulty]);

    const handleServiceSelection = (selectedService) => {
      if (!architectureInfo?.missingServices) return;
      
      const currentMissingService = architectureInfo.missingServices[currentMissingServiceIndex];
      const selectedOption = currentMissingService.options.find(opt => opt.service === selectedService);
      const correctOption = currentMissingService.options.find(opt => opt.isCorrect);
      const optimalOption = currentMissingService.options.find(opt => opt.isOptimal);

      if (selectedOption) {
        setShowFeedback(true);
        if (selectedOption.isCorrect) {
          // Calculate points based on whether it's optimal or just correct
          const points = selectedOption.isOptimal ? 5 : 2;
          
          setScore(prevScore => {
            const newScore = prevScore + points;
            // Check if we've reached the maximum possible score for current difficulty
            if (newScore === getMaxPossibleScore(difficulty)) {
              setShowFireworks(true);
              setTimeout(() => setShowFireworks(false), 5000);
            }
            return newScore;
          });
          
          if (selectedOption.isOptimal) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
          }

          setFeedback({
            isCorrect: true,
            message: selectedOption.explanation,
            points: points,
            isOptimal: selectedOption.isOptimal,
            optimalSolution: !selectedOption.isOptimal ? optimalOption.service : null,
            optimalExplanation: !selectedOption.isOptimal ? optimalOption.explanation : null
          });
        } else {
          setShowSadFace(true);
          setTimeout(() => setShowSadFace(false), 4000);

          setFeedback({
            isCorrect: false,
            message: `<div class="feedback-explanation">
              <p>${selectedOption.explanation}</p>
              <div class="correct-answer-wrapper">
                <p class="correct-answer-section">
                  <span style="color: lime; font-weight: bold;">The correct answer was: </span>
                  <strong>${correctOption.service}</strong>. ${correctOption.explanation}
                </p>
              </div>
            </div>`,
            points: 0,
            correctAnswer: correctOption.service
          });
        }
      }
    };

    const handleNext = () => {
      if (!architectureInfo?.missingServices) return;
      
      setShowFeedback(false);
      if (currentMissingServiceIndex < architectureInfo.missingServices.length - 1) {
        const nextIndex = currentMissingServiceIndex + 1;
        setCurrentMissingServiceIndex(nextIndex);
        
        const nextMissingService = architectureInfo.missingServices[nextIndex];
        setCurrentQuestion({
          text: nextMissingService.question,
          optimizationFocus: nextMissingService.optimizationFocus,
          options: nextMissingService.options.map(opt => ({
            id: opt.service.toLowerCase().replace(/\s+/g, '-'),
            name: opt.service,
            isCorrect: opt.isCorrect,
            isOptimal: opt.isOptimal,
            explanation: opt.explanation,
            rating: opt.rating,
            icon: getServiceIcon(opt.service)
          }))
        });
        setQuestionStartTime(Date.now());
        setElapsedTime(0);
      }
    };

    const handleDifficultyChange = (level) => {
      setDifficulty(level);
    };

    useEffect(() => {
      if (currentQuestion && !questionStartTime) {
        setQuestionStartTime(Date.now());
      }

      const timer = setInterval(() => {
        if (questionStartTime && !showFeedback) {
          const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
          setElapsedTime(elapsed);
        }
      }, 1000);

      return () => clearInterval(timer);
    }, [currentQuestion, questionStartTime, showFeedback]);

    return (
      <DndProvider backend={HTML5Backend}>
        <DndContext sensors={sensors}>
          <div className="game-container">
            <div className="game-header">
              <h2>{architectureInfo?.name || 'AWS Architecture Challenge'}</h2>
              <div className="game-stats">
                <div className="score">Score: {score}</div>
                <div className="complexity">
                  <span className="complexity-icon">🎯</span>
                  {difficulty}
                </div>
                {currentQuestion && !showFeedback && (
                  <div className={`timer ${
                    elapsedTime > 60 ? 'danger' : 
                    elapsedTime > 30 ? 'warning' : ''
                  }`}>
                    <span className="timer-icon">⏱️</span>
                    {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              <button 
                className="new-architecture-button"
                onClick={loadNextArchitecture}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'New Architecture'}
              </button>
            </div>
            
            {architectureInfo && <p className="architecture-description">{architectureInfo.description}</p>}
            
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                <AWSArchitectureDisplay 
                  architecture={architecture}
                  currentQuestion={currentQuestion}
                />
                
                {currentQuestion && (
                  <div className="question-container">
                    <h3 className="question-label">
                      <span className="highlight">Question:</span> {currentQuestion.text}
                    </h3>
                    <p className="optimization-focus-label">
                      <span className="highlight">Optimization Focus:</span> {currentQuestion.optimizationFocus}
                    </p>
                    
                    {showFeedback ? (
                      <div className={`feedback-modal ${feedback.isCorrect ? 'correct' : 'incorrect'} ${feedback.isOptimal ? 'optimal' : ''}`}>
                        {showSadFace && (
                          <div className="sad-face-overlay">
                            <span role="img" aria-label="sad face" className="sad-face">😢</span>
                          </div>
                        )}
                        <div className="feedback-content">
                          {feedback.isCorrect ? (
                            <>
                              <h3>🎉 Correct! +{feedback.points} points</h3>
                              {feedback.isOptimal ? (
                                <p>🌟 Perfect choice! This is the optimal solution.</p>
                              ) : (
                                <>
                                  <p>⚠️ This answer is correct but not the best option according to the Optimization Focus.</p>
                                  <p><span style={{ color: 'green' }}>The optimal answer is:</span> {feedback.optimalSolution}.</p>
                                </>
                              )}
                            </>
                          ) : (
                            <h3>❌ Not quite right</h3>
                          )}
                          <p dangerouslySetInnerHTML={{ __html: feedback.message }}></p>
                          
                          {currentMissingServiceIndex < (architectureInfo?.missingServices?.length - 1) && (
                            <button 
                              className="next-button"
                              onClick={handleNext}
                            >
                              Next Service ({currentMissingServiceIndex + 2} of {architectureInfo?.missingServices?.length})
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="service-options">
                        {currentQuestion.options.map((option, index) => (
                          <DraggableService
                            key={`${option.id}-${index}`}
                            service={option}
                            onClick={() => handleServiceSelection(option.name)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            <div className="game-status">
              <div className="progress">
                {architectureInfo?.missingServices ? 
                  `Service ${currentMissingServiceIndex + 1} of ${architectureInfo.missingServices.length}` :
                  'Learn and have fun!'
                }
              </div>
            </div>

            <div className="difficulty-selection">
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                <button
                  key={level}
                  className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange(level)}
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <br></br>
          <center>
            <img 
              src="https://hackthon-backend-files-ep-2024.s3.us-east-1.amazonaws.com/amazon-icons-set/Architecture-Service-Icons_06072024/AWSArchitectureApp.webp"
              alt="Loading..." 
              style={{ 
                width: '1200px',
                height: '900px',
                verticalAlign: 'middle',
                display: 'inline-block',
                borderRadius: '50px'
              }} 
            />
          </center>
          {showConfetti && (
            <ReactConfetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={200}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 'var(--z-index-confetti)'
              }} 
            />
          )}
          {showFireworks && (
            <ReactConfetti
              width={width}
              height={height}
              recycle={true}
              numberOfPieces={500}
              colors={['#FFD700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF']}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 'var(--z-index-confetti)'
              }}
            />
          )}
        </DndContext>
      </DndProvider>
    );
};

export default AWSArchitectureGame;