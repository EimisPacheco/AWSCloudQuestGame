import OpenAI from 'openai';

// Debug mode configuration
const DEBUG = {
  enabled: process.env.REACT_APP_DEBUG_MODE === 'true',
  verbose: process.env.REACT_APP_DEBUG_VERBOSE === 'true',
  logLevel: process.env.REACT_APP_DEBUG_LEVEL || 'info',
  retrySimulation: process.env.REACT_APP_SIMULATE_RETRIES === 'true'
};

// Enhanced retry patterns
const RETRY_PATTERNS = {
  AGGRESSIVE: {
    maxRetries: 5,
    baseDelay: 500,
    backoffMultiplier: 1.2,
    jitterMax: 100,
    timeout: 8000
  },
  CONSERVATIVE: {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 2,
    jitterMax: 200,
    timeout: 15000
  },
  ADAPTIVE: {
    initialMaxRetries: 3,
    maxRetriesLimit: 7,
    baseDelay: 800,
    successThreshold: 0.7,
    failureThreshold: 0.3,
    adaptiveWindow: 10 // Number of requests to consider for adaptation
  }
};

// Retry history for adaptive pattern
const retryHistory = {
  attempts: [],
  successes: 0,
  failures: 0
};

const debugLog = (level, message, data = {}) => {
  if (!DEBUG.enabled) return;
  
  const timestamp = new Date().toISOString();
  const logLevels = ['error', 'warn', 'info', 'debug'];
  
  if (logLevels.indexOf(level) <= logLevels.indexOf(DEBUG.logLevel)) {
    console[level](`[${timestamp}] ${message}`, {
      ...data,
      debugMode: true,
      logLevel: level
    });
  }
};

// Adaptive retry strategy
const updateRetryStrategy = () => {
  if (retryHistory.attempts.length < RETRY_PATTERNS.ADAPTIVE.adaptiveWindow) {
    return RETRY_PATTERNS.CONSERVATIVE;
  }

  const recentAttempts = retryHistory.attempts.slice(-RETRY_PATTERNS.ADAPTIVE.adaptiveWindow);
  const successRate = recentAttempts.filter(a => a.success).length / recentAttempts.length;

  debugLog('info', 'Updating retry strategy', { successRate, recentAttempts });

  if (successRate > RETRY_PATTERNS.ADAPTIVE.successThreshold) {
    return {
      ...RETRY_PATTERNS.CONSERVATIVE,
      maxRetries: Math.max(2, RETRY_PATTERNS.CONSERVATIVE.maxRetries - 1)
    };
  } else if (successRate < RETRY_PATTERNS.ADAPTIVE.failureThreshold) {
    return {
      ...RETRY_PATTERNS.AGGRESSIVE,
      maxRetries: Math.min(RETRY_PATTERNS.ADAPTIVE.maxRetriesLimit, 
                          RETRY_PATTERNS.AGGRESSIVE.maxRetries + 1)
    };
  }

  return RETRY_PATTERNS.CONSERVATIVE;
};

// Circuit breaker implementation
const circuitBreaker = {
  failures: 0,
  lastFailure: null,
  threshold: 5,
  resetTimeout: 30000,
  
  isOpen() {
    if (!this.lastFailure) return false;
    const timeSinceLastFailure = Date.now() - this.lastFailure;
    return this.failures >= this.threshold && timeSinceLastFailure < this.resetTimeout;
  },
  
  recordFailure() {
    this.failures++;
    this.lastFailure = Date.now();
    debugLog('warn', 'Circuit breaker failure recorded', { 
      failures: this.failures,
      threshold: this.threshold 
    });
  },
  
  reset() {
    this.failures = 0;
    this.lastFailure = null;
    debugLog('info', 'Circuit breaker reset');
  }
};

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const DIFFICULTY_MODIFIERS = {
  EASY: {
    description: "well-known and popular quotes from the last 30 years",
    popularity: "highly popular",
    maxRetries: 3,
    temperature: 0.5
  },
  MEDIUM: {
    description: "moderately known quotes from the last 50 years",
    popularity: "moderately known",
    maxRetries: 3,
    temperature: 0.7
  },
  HARD: {
    description: "obscure or historical quotes from any time period",
    popularity: "less known",
    maxRetries: 3,
    temperature: 0.9
  }
};

// Enhanced error types
const ERROR_TYPES = {
  API_KEY: 'API_KEY_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  CONTENT_FILTER: 'CONTENT_FILTER_ERROR',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error tracking analytics
const errorStats = {
  counts: {},
  lastOccurrence: {},
  retrySuccess: {},
};

// Sophisticated retry configuration
const RETRY_CONFIG = {
  baseDelay: 1000,
  maxRetries: 3,
  timeoutMs: 10000,
  backoffMultiplier: 1.5,
  jitterMax: 200,
  retryableStatuses: [429, 503, 502, 500],
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add jitter to avoid thundering herd problem
const getJitter = () => Math.random() * RETRY_CONFIG.jitterMax;

// Enhanced error classification
const classifyError = (error) => {
  // Log error for debugging
  console.debug('Error details:', {
    message: error.message,
    status: error.response?.status,
    type: error.type,
    stack: error.stack,
  });

  if (error.message.includes('API key')) return ERROR_TYPES.API_KEY;
  if (error.response?.status === 429) return ERROR_TYPES.RATE_LIMIT;
  if (error.message.includes('network')) return ERROR_TYPES.NETWORK;
  if (error.message.includes('timeout')) return ERROR_TYPES.TIMEOUT;
  if (error.response?.status >= 500) return ERROR_TYPES.SERVER;
  if (error.message.includes('content filter')) return ERROR_TYPES.CONTENT_FILTER;
  if (error.message.includes('quota')) return ERROR_TYPES.QUOTA_EXCEEDED;
  if (error.message.includes('Invalid API response')) return ERROR_TYPES.VALIDATION;
  return ERROR_TYPES.UNKNOWN;
};

// Error logging with timestamp and context
const logError = (error, context = {}) => {
  const errorType = classifyError(error);
  const timestamp = new Date().toISOString();
  
  // Update error statistics
  errorStats.counts[errorType] = (errorStats.counts[errorType] || 0) + 1;
  errorStats.lastOccurrence[errorType] = timestamp;

  // Log to console with structured format
  console.error('Game Error:', {
    type: errorType,
    timestamp,
    message: error.message,
    context,
    stats: errorStats.counts[errorType],
    stack: error.stack,
  });

  // Could be extended to send to external error tracking service
  if (process.env.REACT_APP_ERROR_TRACKING_ENABLED === 'true') {
    // Example: sendToErrorTracking(error, context);
  }
};

// Sophisticated retry strategy with exponential backoff and jitter
const calculateRetryDelay = (attempt) => {
  const exponentialDelay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return exponentialDelay + getJitter();
};

// Enhanced error handling with retry strategy
export const handleAPIError = async (error, retryCount = 0, context = {}) => {
  if (DEBUG.enabled) {
    debugLog('error', 'API Error occurred', { error, retryCount, context });
  }

  // Check circuit breaker
  if (circuitBreaker.isOpen()) {
    throw new Error('Service temporarily unavailable. Please try again later.');
  }

  const errorType = classifyError(error);
  const retryPattern = updateRetryStrategy();

  if (DEBUG.retrySimulation) {
    debugLog('info', 'Simulating retry scenario', { errorType, retryPattern });
  }

  try {
    // ... existing error handling logic ...

    // Record success in retry history
    retryHistory.attempts.push({ success: true, timestamp: Date.now() });
    circuitBreaker.reset();

    return {
      shouldRetry: true,
      delay: calculateRetryDelay(retryCount, retryPattern),
      errorType,
      retryCount: retryCount + 1,
      retryPattern: retryPattern.name
    };
  } catch (err) {
    // Record failure in retry history
    retryHistory.attempts.push({ success: false, timestamp: Date.now() });
    circuitBreaker.recordFailure();

    if (DEBUG.enabled) {
      debugLog('error', 'Retry attempt failed', { 
        attempt: retryCount + 1,
        maxRetries: retryPattern.maxRetries,
        error: err
      });
    }

    throw err;
  }
};

// Export error statistics for monitoring
export const getErrorStats = () => ({
  ...errorStats,
  timestamp: new Date().toISOString(),
});

// Export error types for external use
export const ERROR_TYPES_ENUM = ERROR_TYPES;

const retryWithExponentialBackoff = async (operation, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (error.response?.status === 429 || error.response?.status === 503) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

export const getPhrase = async (category, difficulty = 'MEDIUM') => {
  const difficultyConfig = DIFFICULTY_MODIFIERS[difficulty];
  
  const operation = async () => {
    try {
      const systemPrompt = `You are a game master for 'Legendary Lines'. 
        Generate ${difficultyConfig.popularity} content for the ${category} category.
        Focus on ${difficultyConfig.description}.`;
      
      const prompt = `Generate a ${difficulty.toLowerCase()} difficulty ${category.toLowerCase()} quote or phrase.
        The response must be in this exact JSON format:
        {
          "phrase": "the actual quote or phrase",
          "source": "where it's from",
          "year": YYYY,
          "hint": "a subtle hint without giving away the answer",
          "difficulty": "${difficulty}",
          "category": "${category}"
        }`;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        model: "gpt-4",
        temperature: difficultyConfig.temperature,
      });

      const response = JSON.parse(completion.choices[0].message.content);
      
      // Validate response format
      const requiredFields = ['phrase', 'source', 'year', 'hint', 'difficulty', 'category'];
      for (const field of requiredFields) {
        if (!response[field]) {
          throw new Error(`Invalid API response: missing ${field}`);
        }
      }

      return response;
    } catch (error) {
      if (error.message.includes('Invalid API response')) {
        throw new Error('Failed to generate valid phrase. Please try again.');
      }
      throw error;
    }
  };

  return retryWithExponentialBackoff(
    operation,
    difficultyConfig.maxRetries
  );
};

export const checkAnswer = async (userAnswer, correctAnswer, category) => {
  const operation = async () => {
    try {
      const systemPrompt = `You are an answer validator for the 'Legendary Lines' game.`;
      
      const prompt = `Compare these answers for a ${category} quote:
        User's answer: "${userAnswer}"
        Correct answer: "${correctAnswer.source}"
        Difficulty level: ${correctAnswer.difficulty}
        
        Consider variations in naming and common abbreviations.
        For harder difficulty levels, be more lenient with partial matches.
        Return a JSON response in this format:
        {
          "isCorrect": boolean,
          "explanation": "brief explanation of why it's correct or incorrect",
          "similarity": "percentage of similarity",
          "partialCredit": "percentage of points to award for close answers (0-100)"
        }`;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        model: "gpt-4",
        temperature: 0.1,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      throw new Error('Failed to validate answer. Please try again.');
    }
  };

  return retryWithExponentialBackoff(operation);
}; 

// Debug utilities
export const getDebugInfo = () => {
  if (!DEBUG.enabled) return null;
  
  return {
    retryHistory: retryHistory.attempts,
    circuitBreakerStatus: {
      failures: circuitBreaker.failures,
      isOpen: circuitBreaker.isOpen(),
      lastFailure: circuitBreaker.lastFailure
    },
    currentRetryStrategy: updateRetryStrategy(),
    errorStats: getErrorStats()
  };
};

// Debug mode toggle
export const toggleDebugMode = (options = {}) => {
  if (!process.env.NODE_ENV === 'development') {
    console.warn('Debug mode can only be toggled in development environment');
    return;
  }

  DEBUG.enabled = options.enabled ?? !DEBUG.enabled;
  DEBUG.verbose = options.verbose ?? DEBUG.verbose;
  DEBUG.logLevel = options.logLevel ?? DEBUG.logLevel;
  DEBUG.retrySimulation = options.retrySimulation ?? DEBUG.retrySimulation;

  debugLog('info', 'Debug mode settings updated', DEBUG);
}; 