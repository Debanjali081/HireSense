const mongoose = require('mongoose');

interface IResume {
  user: any;
  fileName: string;
  filePath: string;
  fileContent: string; // Parsed text content of the resume
  skills: string[];
  experience: string[];
  education: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileContent: {
      type: String,
      required: true,
    },
    skills: [{
      type: String,
    }],
    experience: [{
      type: String,
    }],
    education: [{
      type: String,
    }],
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = Resume;
