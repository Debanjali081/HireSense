import type { Request, Response } from 'express';
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const { generateInterviewQuestions, analyzeAnswer } = require('../utils/openai');

// @desc    Create a new interview
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req:Request, res:Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { resumeId, jobTitle, jobDescription } = req.body;

    // Check if resume exists and belongs to user
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!resume.fileContent || resume.fileContent.trim() === '') {
      return res.status(400).json({ message: 'Resume content not available' });
    }

    // Generate questions immediately
    const questions = await generateInterviewQuestions(
      resume.fileContent,
      jobTitle || '',
      jobDescription || ''
    );

    const interview = await Interview.create({
      user: req.user._id,
      resume: resumeId,
      jobTitle,
      jobDescription,
      questions: questions.map((q: string) => ({ question: q })),
      status: 'in-progress',
    });

    res.status(201).json(interview);
  } catch (error: any) {
    console.error('Create interview error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all interviews for a user
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('resume', 'fileName');

    res.json(interviews);
  } catch (error: any) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('resume');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error: any) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Update fields
    interview.jobTitle = req.body.jobTitle || interview.jobTitle;
    interview.jobDescription = req.body.jobDescription || interview.jobDescription;
    interview.status = req.body.status || interview.status;

    const updatedInterview = await interview.save();

    res.json(updatedInterview);
  } catch (error: any) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    await interview.deleteOne();

    res.json({ message: 'Interview removed' });
  } catch (error: any) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Generate interview questions based on resume and job
// @route   POST /api/interviews/generate
// @access  Private
const generateQuestions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const interviewId = req.params.id;

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id,
    }).populate('resume');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (!interview.resume || !interview.resume.fileContent) {
      return res.status(400).json({ message: 'Resume content not available' });
    }

    // Generate questions using Gemini
    const questions = await generateInterviewQuestions(
      interview.resume.fileContent,
      interview.jobTitle || '',
      interview.jobDescription || ''
    );

    // Update interview with generated questions
    interview.questions = questions.map((q: string) => ({ question: q }));
    interview.status = 'in-progress';
    await interview.save();

    res.json(interview);
  } catch (error: any) {
    console.error('Generate questions error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Submit answer to a question
// @route   POST /api/interviews/:id/answer
// @access  Private
const submitAnswer = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { questionIndex, answer } = req.body;

    if (questionIndex === undefined || questionIndex === null) {
      return res.status(400).json({ message: 'Question index is required' });
    }

    if (!answer) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (!interview.questions[questionIndex]) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Save the answer
    interview.questions[questionIndex].answer = answer;

    // Analyze the answer using Gemini
    const feedback = await analyzeAnswer(
      interview.questions[questionIndex].question as string,
      answer,
      interview.jobTitle || ''
    );

    // Update question with feedback
    interview.questions[questionIndex].feedback = feedback.feedback;
    interview.questions[questionIndex].modelAnswer = feedback.modelAnswer;
    interview.questions[questionIndex].confidenceScore = feedback.confidenceScore;
    interview.questions[questionIndex].clarityScore = feedback.clarityScore;
    interview.questions[questionIndex].relevanceScore = feedback.relevanceScore;

    await interview.save();

    res.json(interview.questions[questionIndex]);
  } catch (error: any) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get feedback for an interview
// @route   GET /api/interviews/:id/feedback
// @access  Private
const getInterviewFeedback = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Calculate overall scores
    let totalConfidence = 0;
    let totalClarity = 0;
    let totalRelevance = 0;
    let answeredQuestions = 0;

    interface Question {
      answer?: string;
      confidenceScore?: number;
      clarityScore?: number;
      relevanceScore?: number;
    }

    (interview.questions as Question[]).forEach((q: Question) => {
      if (q.answer) {
        answeredQuestions++;
        totalConfidence += q.confidenceScore || 0;
        totalClarity += q.clarityScore || 0;
        totalRelevance += q.relevanceScore || 0;
      }
    });

    const overallScore = answeredQuestions > 0
      ? Math.round(((totalConfidence + totalClarity + totalRelevance) / (answeredQuestions * 3)) * 10)
      : 0;

    // Update interview with overall score
    interview.overallScore = overallScore;
    interview.status = 'completed';
    await interview.save();

    res.json({
      overallScore,
      confidenceScore: answeredQuestions > 0 ? Math.round((totalConfidence / answeredQuestions) * 10) / 10 : 0,
      clarityScore: answeredQuestions > 0 ? Math.round((totalClarity / answeredQuestions) * 10) / 10 : 0,
      relevanceScore: answeredQuestions > 0 ? Math.round((totalRelevance / answeredQuestions) * 10) / 10 : 0,
      questions: interview.questions,
    });
  } catch (error: any) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  generateQuestions,
  submitAnswer,
  getInterviewFeedback
};
