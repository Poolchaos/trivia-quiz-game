import mongoose, { Schema, Document } from 'mongoose';

export interface IScore extends Document {
  username: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreSchema = new Schema<IScore>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      maxlength: [50, 'Username cannot be more than 50 characters'],
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions is required'],
      min: [1, 'Total questions must be at least 1'],
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot be more than 100'],
    },
    timeTaken: {
      type: Number,
      required: [true, 'Time taken is required'],
      min: [0, 'Time taken cannot be negative'],
    },
  },
  { timestamps: true }
);

// Create virtual field for performance score (combination of score and time)
ScoreSchema.virtual('performanceScore').get(function(this: IScore) {
  // Higher score and lower time means better performance
  return (this.percentage * 100) - (this.timeTaken / 10);
});

// Add index for faster leaderboard queries
ScoreSchema.index({ score: -1, timeTaken: 1 });

export const Score = mongoose.models.Score || mongoose.model<IScore>('Score', ScoreSchema);