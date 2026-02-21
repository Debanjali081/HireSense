import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, interviewAPI } from '../../services/api';
import { toast } from 'react-toastify';

interface Resume {
  _id: string;
  fileName: string;
  createdAt: string;
}

const NewInterview: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await resumeAPI.getResumes();
        setResumes(response.data);
        
        if (response.data.length > 0) {
          setSelectedResume(response.data[0]._id);
        }
      } catch (err: any) {
        console.error('Error fetching resumes:', err);
        setError(err.response?.data?.message || 'Failed to load resumes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleCreateInterview = async () => {
    if (!selectedResume || !jobTitle.trim()) {
      toast.error('Please select a resume and enter a job title');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const response = await interviewAPI.createInterview(selectedResume, jobTitle);
      await interviewAPI.generateQuestions(response.data._id);

      toast.success('Interview created successfully!');
      navigate(`/interviews/${response.data._id}`);
    } catch (err: any) {
      console.error('Error creating interview:', err);
      setError(err.response?.data?.message || 'Failed to create interview. Please try again.');
      toast.error('Failed to create interview');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/interviews')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Interview</h1>
          <p className="text-gray-500 text-sm">Configure your mock interview session</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Upload a resume to start practicing with personalized interview questions
            </p>
            <button
              onClick={() => navigate('/resumes/upload')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Step 1: Resume Selection */}
            <div>
              <div className="flex items-center mb-5">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full mr-3">
                  STEP 1
                </span>
                <h2 className="text-sm font-medium text-gray-700">Select Resume</h2>
              </div>
              
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className={`group relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedResume === resume._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setSelectedResume(resume._id)}
                  >
                    <div className="flex-1 flex items-center min-w-0">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📄</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resume.fileName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(resume.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {selectedResume === resume._id && (
                      <div className="flex-shrink-0 ml-3">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/resumes/${resume._id}`);
                      }}
                      className="ml-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Job Details */}
            <div>
              <div className="flex items-center mb-5">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full mr-3">
                  STEP 2
                </span>
                <h2 className="text-sm font-medium text-gray-700">Job Title</h2>
              </div>

              <div>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <p className="mt-2 text-xs text-gray-400">
                  This helps generate role-specific questions
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={handleCreateInterview}
                disabled={!selectedResume || !jobTitle.trim() || creating}
                className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  !selectedResume || !jobTitle.trim() || creating
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#1E3A8A] text-white hover:bg-blue-700'
                }`}
              >
                {creating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Start Interview'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewInterview;