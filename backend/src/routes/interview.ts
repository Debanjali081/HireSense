const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  generateQuestions,
  submitAnswer,
  getInterviewFeedback
} = require('../controllers/interview');

const router = express.Router();

// @route   POST /api/interviews
// @desc    Create a new interview
// @access  Private
router.post('/', protect, createInterview);

// @route   GET /api/interviews
// @desc    Get all interviews for a user
// @access  Private
router.get('/', protect, getInterviews);

// @route   GET /api/interviews/:id
// @desc    Get interview by ID
// @access  Private
router.get('/:id', protect, getInterviewById);

// @route   PUT /api/interviews/:id
// @desc    Update interview
// @access  Private
router.put('/:id', protect, updateInterview);

// @route   DELETE /api/interviews/:id
// @desc    Delete interview
// @access  Private
router.delete('/:id', protect, deleteInterview);

// @route   POST /api/interviews/:id/generate-questions
// @desc    Generate interview questions based on resume and job
// @access  Private
router.post('/:id/generate-questions', protect, generateQuestions);

// @route   POST /api/interviews/:id/answer
// @desc    Submit answer to a question
// @access  Private
router.post('/:id/answer', protect, submitAnswer);

// @route   GET /api/interviews/:id/feedback
// @desc    Get feedback for an interview
// @access  Private
router.get('/:id/feedback', protect, getInterviewFeedback);

module.exports = router;
