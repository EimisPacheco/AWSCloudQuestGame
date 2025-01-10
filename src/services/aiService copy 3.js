import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true  // Added for development
});

const DIFFICULTY_MODIFIERS = {
  EASY: {
    popularity: "well-known",
    description: "commonly recognized phrases",
    temperature: 0.7
  },
  MEDIUM: {
    popularity: "moderately known",
    description: "somewhat challenging phrases",
    temperature: 0.8
  },
  HARD: {
    popularity: "obscure",
    description: "rare and challenging phrases",
    temperature: 0.9
  }
};

export const getPhrase = async (category = 'QUOTE', difficulty = 'MEDIUM') => {
  // Add default category if none is selected
  if (!category) {
    console.warn('No category provided, using default: QUOTE');
    category = 'QUOTE';
  }

  const difficultyConfig = DIFFICULTY_MODIFIERS[difficulty];
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a game master for 'Legendary Lines'. Generate ${difficultyConfig.popularity} content for the ${category} category. Focus on ${difficultyConfig.description}.`
        },
        {
          role: "user",
          content: `Generate a ${difficulty.toLowerCase()} difficulty ${category.toLowerCase()} phrase.`
        }
      ],
      functions: [{
        name: "generatePhrase",
        description: "Generate a phrase or quote for the game based on category and difficulty",
        parameters: {
          type: "object",
          properties: {
            phrase: {
              type: "string",
              description: "The actual quote or phrase to be guessed"
            },
            source: {
              type: "string",
              description: "The origin of the phrase (book title, movie name, etc.)"
            },
            year: {
              type: "number",
              description: "The year the source was released/published"
            },
            hint: {
              type: "string",
              description: "A subtle hint without giving away the answer"
            },
            additionalInfo: {
              type: "object",
              properties: {
                creator: {
                  type: "string",
                  description: "Director (for movies) or Artist/Band (for songs)"
                },
                genre: {
                  type: "string",
                  description: "The genre of the source material"
                }
              }
            }
          },
          required: ["phrase", "source", "year", "hint"]
        }
      }],
      function_call: { name: "generatePhrase" }
    });

    const functionCall = completion.choices[0].message.function_call;
    return JSON.parse(functionCall.arguments);
  } catch (error) {
    console.error('Error generating phrase:', error);
    throw error;
  }
};

export const checkAnswer = async (playerAnswer, correctAnswer, answerType = 'source') => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are validating answers for the Legendary Lines game."
        },
        {
          role: "user",
          content: `Compare the player's ${answerType} answer: "${playerAnswer}" with the correct ${answerType}: "${correctAnswer}"`
        }
      ],
      functions: [{
        name: "validateAnswer",
        description: "Validate player's answer against the correct source",
        parameters: {
          type: "object",
          properties: {
            isCorrect: {
              type: "boolean",
              description: "Whether the answer is correct"
            },
            similarity: {
              type: "number",
              description: "How close the answer is to the correct one (0-1)"
            },
            feedback: {
              type: "string",
              description: "Helpful feedback about why the answer was right or wrong"
            }
          },
          required: ["isCorrect", "feedback"]
        }
      }],
      function_call: { name: "validateAnswer" }
    });

    const functionCall = completion.choices[0].message.function_call;
    return JSON.parse(functionCall.arguments);
  } catch (error) {
    console.error('Error validating answer:', error);
    throw error;
  }
}; 