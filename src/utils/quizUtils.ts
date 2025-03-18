export function validateAnswer(
  questionId: string,
  selectedAnswer: string,
  correctAnswers: Record<string, string>
) {
  return correctAnswers[questionId] === selectedAnswer;
}

export function calculateScore(
  answers: Record<string, string>,
  correctAnswers: Record<string, string>
) {
  let correct = 0;
  
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    if (validateAnswer(questionId, selectedAnswer, correctAnswers)) {
      correct++;
    }
  });
  
  const total = Object.keys(correctAnswers).length;
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  
  return {
    correct,
    total,
    percentage,
  };
}

// Format time (seconds) to MM:SS
export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Get difficulty text and color
export function getDifficultyInfo(difficulty: string | undefined) {
  switch (difficulty) {
    case 'easy':
      return { text: 'Easy', color: 'text-green-600 bg-green-100' };
    case 'medium':
      return { text: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
    case 'hard':
      return { text: 'Hard', color: 'text-red-600 bg-red-100' };
    default:
      return { text: 'Unknown', color: 'text-gray-600 bg-gray-100' };
  }
}