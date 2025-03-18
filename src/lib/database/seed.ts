import { connectToDatabase, disconnectFromDatabase } from './connection';
import { Question } from './models/question';

const sampleQuestions = [
  {
    text: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    correctAnswer: 'Paris',
    category: 'Geography',
    difficulty: 'easy',
  },
  {
    text: 'Which planet is known as the Red Planet?',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    category: 'Science',
    difficulty: 'easy',
  },
  {
    text: 'What is the largest mammal in the world?',
    options: ['Blue Whale', 'African Elephant', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 'Blue Whale',
    category: 'Animals',
    difficulty: 'easy',
  },
  {
    text: 'Which famous scientist developed the theory of general relativity?',
    options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Stephen Hawking'],
    correctAnswer: 'Albert Einstein',
    category: 'Science',
    difficulty: 'medium',
  },
  {
    text: 'In which year did World War II end?',
    options: ['1945', '1939', '1942', '1950'],
    correctAnswer: '1945',
    category: 'History',
    difficulty: 'medium',
  },
  {
    text: 'What is the chemical symbol for gold?',
    options: ['Au', 'Ag', 'Fe', 'Cu'],
    correctAnswer: 'Au',
    category: 'Science',
    difficulty: 'medium',
  },
  {
    text: 'Which programming language was developed by Microsoft?',
    options: ['C#', 'Java', 'Python', 'Ruby'],
    correctAnswer: 'C#',
    category: 'Technology',
    difficulty: 'medium',
  },
  {
    text: 'What is the most spoken language in the world?',
    options: ['Mandarin', 'English', 'Spanish', 'Hindi'],
    correctAnswer: 'Mandarin',
    category: 'Language',
    difficulty: 'medium',
  },
  {
    text: 'Which of these is NOT a primary color?',
    options: ['Green', 'Red', 'Blue', 'Yellow'],
    correctAnswer: 'Green',
    category: 'Art',
    difficulty: 'hard',
  },
  {
    text: 'What is the smallest prime number?',
    options: ['2', '1', '0', '3'],
    correctAnswer: '2',
    category: 'Mathematics',
    difficulty: 'hard',
  },
];

async function seedDatabase() {
  try {
    await connectToDatabase();
    await Question.deleteMany({});
    await Question.insertMany(sampleQuestions);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await disconnectFromDatabase();
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };