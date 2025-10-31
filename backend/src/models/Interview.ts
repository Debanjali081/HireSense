/// <reference types="mongoose" />
const mongoose = require('mongoose');
const { Schema } = mongoose;

interface IQuestion {
  question: string;
  answer?: string;
  feedback?: string;
  modelAnswer?: string;
  confidenceScore?: number;
  clarityScore?: number;
  relevanceScore?: number;
}

interface IInterview {
  user: any;
  resume: any;
  jobTitle: string;
  jobDescription?: string;
  questions: IQuestion[];
  overallFeedback?: string;
  overallScore?: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  feedback: {
    type: String,
  },
  modelAnswer: {
    type: String,
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  clarityScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  relevanceScore: {
    type: Number,
    min: 0,
    max: 10,
  },
});

const InterviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
    },
    questions: [QuestionSchema],
    overallFeedback: {
      type: String,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', InterviewSchema);

module.exports = Interview;
