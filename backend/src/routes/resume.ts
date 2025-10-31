const express = require('express');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require('../controllers/resume');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/resumes/upload
// @desc    Upload a new resume
// @access  Private
router.post('/upload', protect, upload.single('resume'), uploadResume);

// @route   GET /api/resumes
// @desc    Get all resumes for a user
// @access  Private
router.get('/', protect, getResumes);

// @route   GET /api/resumes/:id
// @desc    Get resume by ID
// @access  Private
router.get('/:id', protect, getResumeById);

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', protect, deleteResume);

module.exports = router;
