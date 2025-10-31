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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <button
            className="group bg-white/80 backdrop-blur-lg text-gray-700 px-6 py-3 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl border border-white/60 flex items-center mb-6"
            onClick={() => navigate('/interviews')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Interviews
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Start New Interview
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your resume and enter the job title to begin your AI-powered mock interview session.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600">⚠️</span>
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📄</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Resumes Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You need to upload a resume before you can start an interview. Your resume helps us generate personalized questions.
              </p>
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center mx-auto"
                onClick={() => navigate('/resumes/upload')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upload Your First Resume
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Resume Selection Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Select a Resume</h2>
                    <p className="text-gray-600">Choose which resume to use for this interview</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resumes.map((resume) => (
                    <div
                      key={resume._id}
                      className={`relative rounded-xl p-6 cursor-pointer transition-all duration-200 border-2 ${
                        selectedResume === resume._id
                          ? 'border-blue-500 bg-blue-50/50 shadow-lg transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedResume(resume._id)}
                    >
                      {selectedResume === resume._id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-600">📄</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {resume.fileName}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500">
                            Uploaded {new Date(resume.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/resumes/${resume._id}`);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Title Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Enter Job Details</h2>
                    <p className="text-gray-600">Specify the role you're preparing for</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist..."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This helps us generate role-specific questions for your interview practice.
                  </p>
                </div>
              </div>

              {/* Action Section */}
              <div className="text-center pt-6">
                <button
                  className={`group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center mx-auto ${
                    !selectedResume || !jobTitle.trim() || creating 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:-translate-y-0.5'
                  }`}
                  disabled={!selectedResume || !jobTitle.trim() || creating}
                  onClick={handleCreateInterview}
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Interview...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Interview Session
                    </>
                  )}
                </button>
                
                {(!selectedResume || !jobTitle.trim()) && (
                  <p className="text-gray-500 text-sm mt-3">
                    Please select a resume and enter a job title to continue
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewInterview;