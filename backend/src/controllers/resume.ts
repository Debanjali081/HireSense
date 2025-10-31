import type { Request, Response } from 'express';
const Resume = require('../models/Resume');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// @desc    Upload a new resume
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!(req as any).file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, path } = (req as any).file;

    // Read file buffer
    const fileBuffer = fs.readFileSync(path);

    // Parse PDF content
    const pdfData = await pdfParse(fileBuffer);
    const fileContent = pdfData.text;

    const resume = await Resume.create({
      user: req.user._id,
      fileName: originalname,
      filePath: path,
      fileContent,
      skills: [],
      experience: [],
      education: [],
    });

    res.status(201).json(resume);
  } catch (error: any) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error: any) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error: any) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await resume.deleteOne();

    res.json({ message: 'Resume removed' });
  } catch (error: any) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
};
