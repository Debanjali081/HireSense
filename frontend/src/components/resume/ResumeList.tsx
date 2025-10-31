import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../../services/api';
import { toast } from 'react-toastify';

interface Resume {
  _id: string;
  fileName: string;
  createdAt: string;
  skills: string[];
}

const ResumeList: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resumeAPI.getResumes();
      setResumes(response.data);
    } catch (err: any) {
      console.error('Error fetching resumes:', err);
      setError(err.response?.data?.message || 'Failed to load resumes. Please try again.');
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    try {
      await resumeAPI.deleteResume(resumeToDelete);
      setResumes(resumes.filter(resume => resume._id !== resumeToDelete));
      toast.success('Resume deleted successfully');
    } catch (err: any) {
      console.error('Error deleting resume:', err);
      toast.error(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    }
  };

  const handleViewResume = (id: string) => {
    navigate(`/resumes/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Resumes</h1>
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center"
          onClick={() => navigate('/resumes/upload')}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Upload New Resume
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-4">
        {resumes.length > 0 ? (
          <ul>
            {resumes.map((resume) => (
              <li key={resume._id} className="border-b border-gray-200 last:border-b-0">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold">{resume.fileName}</p>
                      <p className="text-sm text-gray-600">Uploaded on: {new Date(resume.createdAt).toLocaleDateString()}</p>
                      {resume.skills && resume.skills.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          Skills: {resume.skills.slice(0, 5).join(', ')}
                          {resume.skills.length > 5 && '...'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => handleViewResume(resume._id)}
                      aria-label="view"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(resume._id)}
                      aria-label="delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No resumes found</h2>
            <p className="text-gray-600 mb-4">
              Upload your resume to get started with AI-powered interview preparation.
            </p>
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center mx-auto"
              onClick={() => navigate('/resumes/upload')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Resume
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold mb-4">Delete Resume</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeList;
