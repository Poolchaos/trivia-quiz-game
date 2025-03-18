import { Question } from '@/lib/database/models/question';
import { Types } from 'mongoose';

interface LeanQuestionDocument {
  _id: Types.ObjectId | string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export async function validateAnswers(answers: Record<string, string>) {
  const questionIds = Object.keys(answers);
  const questions = await Question.find({
    _id: { $in: questionIds },
  }).lean();
  
  const questionsMap = questions.reduce<Record<string, LeanQuestionDocument>>((acc, question) => {
    const typedQuestion = question as unknown as LeanQuestionDocument;
    const questionId = typedQuestion._id.toString();
    acc[questionId] = typedQuestion;
    return acc;
  }, {});
  
  let correctCount = 0;
  
  for (const [questionId, selectedAnswer] of Object.entries(answers)) {
    const question = questionsMap[questionId];
    
    if (!question) continue;
    
    if (question.correctAnswer === selectedAnswer) {
      correctCount++;
    }
  }
  
  return {
    totalQuestions: questionIds.length,
    correctCount,
    percentage: (correctCount / questionIds.length) * 100,
  };
}