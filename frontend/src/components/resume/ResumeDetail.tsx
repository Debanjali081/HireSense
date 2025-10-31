import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../../services/api';
import { toast } from 'react-toastify';

interface Resume {
  _id: string;
  fileName: string;
  fileContent: string;
  skills: string[];
  experience: string[];
  education: string[];
  createdAt: string;
}

const ResumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await resumeAPI.getResume(id);
        setResume(response.data);
      } catch (err: any) {
        console.error('Error fetching resume:', err);
        setError(err.response?.data?.message || 'Failed to load resume. Please try again.');
        toast.error('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="m-3 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Resume not found
      </div>
    );
  }

  const handleDelete = async () => {
    if (!id) return;
    try {
      await resumeAPI.deleteResume(id);
      toast.success('Resume deleted successfully');
      navigate('/resumes');
    } catch (err: any) {
      console.error('Error deleting resume:', err);
      toast.error(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{resume.fileName}</h1>
          <button
            className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Uploaded on: {new Date(resume.createdAt).toLocaleDateString()}
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Resume Content</h2>
          <pre className="whitespace-pre-wrap text-gray-800">{resume.fileContent}</pre>
        </div>

        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Experience</h2>
            <div>
              {resume.experience.map((exp, index) => (
                <p key={index} className="mb-2 text-gray-800">
                  {exp}
                </p>
              ))}
            </div>
          </div>
        )}

        {resume.education && resume.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Education</h2>
            <div>
              {resume.education.map((edu, index) => (
                <p key={index} className="mb-2 text-gray-800">
                  {edu}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDetail;
