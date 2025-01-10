// Timer formatting
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Answer validation
export const validateAnswers = (userAnswers, correctAnswers) => {
  let score = 0;
  const maxScore = 100;
  const results = {};

  Object.keys(correctAnswers).forEach(direction => {
    Object.keys(correctAnswers[direction]).forEach(number => {
      const correct = correctAnswers[direction][number];
      const user = userAnswers[direction]?.[number] || '';
      results[`${direction}-${number}`] = {
        isCorrect: correct.toLowerCase() === user.toLowerCase(),
        correct: correct
      };
      if (correct.toLowerCase() === user.toLowerCase()) {
        score += maxScore / Object.keys(correctAnswers).length;
      }
    });
  });

  return { score: Math.round(score), results };
}; 