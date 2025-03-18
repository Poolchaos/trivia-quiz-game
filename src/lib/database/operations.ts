import { connectToDatabase } from './connection';
import { Question, IQuestion } from './models/question';
import { Score, IScore } from './models/score';

type QuestionQueryFilter = {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

export async function getQuestions(limit = 10, category?: string, difficulty?: 'easy' | 'medium' | 'hard') {
  await connectToDatabase();
  
  const query: QuestionQueryFilter = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  
  const questions = await Question.aggregate([
    { $match: query },
    { $sample: { size: limit } },
  ]);
  
  return JSON.parse(JSON.stringify(questions));
}

export async function createQuestion(questionData: Partial<IQuestion>) {
  await connectToDatabase();
  const question = new Question(questionData);
  await question.save();
  return JSON.parse(JSON.stringify(question));
}

export async function getTopScores(limit = 10) {
  await connectToDatabase();
  const scores = await Score.find()
    .sort({ score: -1, timeTaken: 1 })
    .limit(limit)
    .lean();
  
  return JSON.parse(JSON.stringify(scores));
}

export async function saveScore(scoreData: Partial<IScore>) {
  await connectToDatabase();
  const score = new Score(scoreData);
  await score.save();
  return JSON.parse(JSON.stringify(score));
}