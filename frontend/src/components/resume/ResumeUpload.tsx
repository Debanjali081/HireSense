import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { resumeAPI } from '../../services/api';
import { toast } from 'react-toastify';

const ResumeUpload: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only accept PDF files
    const pdfFiles = acceptedFiles.filter(
      file => file.type === 'application/pdf'
    );
    
    if (pdfFiles.length !== acceptedFiles.length) {
      setError('Only PDF files are accepted');
      return;
    }
    
    setFiles(pdfFiles);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('resume', files[0]);

      await resumeAPI.uploadResume(formData);
      
      setSuccess(true);
      toast.success('Resume uploaded successfully!');
      
      // Redirect to resumes list after a short delay
      setTimeout(() => {
        navigate('/resumes');
      }, 2000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Upload Your Resume</h1>
      <p className="text-center text-gray-600 mb-6">
        Upload your resume in PDF format. We'll analyze it to create personalized interview questions.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Resume uploaded successfully! Redirecting...
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-6 mb-6 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto mb-3 h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-3a4 4 0 00-4-4H7a4 4 0 00-4 4v3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M12 6v8" />
        </svg>
        {isDragActive ? (
          <p className="text-blue-600 font-semibold">Drop the file here...</p>
        ) : (
          <p className="text-gray-600">Drag & drop your resume here, or click to select file</p>
        )}
        <p className="text-sm text-gray-500 mt-2">Only PDF files are accepted</p>
      </div>

      {files.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Selected File:</h2>
          <ul className="mb-6">
            {files.map((file) => (
              <li key={file.name} className="flex items-center justify-between border border-gray-200 rounded p-3 mb-2">
                <span>{file.name}</span>
                <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex justify-center">
        <button
          className={`px-6 py-3 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50`}
          onClick={handleUpload}
          disabled={files.length === 0 || uploading || success}
        >
          {uploading ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            'Upload Resume'
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
