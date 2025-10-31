import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';
import { interviewAPI } from '../../services/api';
import AnswerForm from './AnswerForm';
import MarkdownRenderer from './MarkdownRenderer';
import { toast } from 'react-toastify';

interface Question {
  _id: string;
  question: string;
  answer?: string;
  score?: number;
  feedback?: string | null;
  modelAnswer?: string | null;
}

interface Interview {
  _id: string;
  jobTitle: string;
  status: string;
  createdAt: string;
  questions: Question[];
  overallScore?: number;
  overallFeedback?: string;
}

const InterviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchInterview(id);
    }
  }, [id]);

  const fetchInterview = async (interviewId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewAPI.getInterview(interviewId);
      setInterview(response.data);
    } catch (err: any) {
      console.error('Error fetching interview:', err);
      setError(err.response?.data?.message || 'Failed to load interview details. Please try again.');
      toast.error('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await interviewAPI.deleteInterview(id);
      toast.success('Interview deleted successfully');
      navigate('/interviews');
    } catch (err: any) {
      console.error('Error deleting interview:', err);
      toast.error(err.response?.data?.message || 'Failed to delete interview');
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-8 mb-8">
        <button
          className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center"
          onClick={() => navigate('/interviews')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Interviews
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Interview not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center transition-colors"
          onClick={() => navigate('/interviews')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Interviews
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center transition-colors"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
              handleDelete();
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Interview
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {interview.jobTitle}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            interview.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
            interview.status.toLowerCase() === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {formatStatus(interview.status)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Date: {new Date(interview.createdAt).toLocaleDateString()}
        </p>

        {interview.status.toLowerCase() === 'completed' && (
          <div className="mt-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Overall Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Score</h3>
                </div>
                <p className={`text-4xl font-bold ${getScoreColor(interview.overallScore || 0)}`}>
                  {interview.overallScore !== undefined ? `${interview.overallScore}/100` : 'N/A'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-900">Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {interview.overallFeedback || 'No feedback available'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Questions & Answers
      </h2>

      {interview.questions.length > 0 ? (
        interview.questions.map((question, index) => (
          <div key={question._id} className="bg-white p-6 rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full mr-3">
                    Q{index + 1}
                  </span>
                  {question.score !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(question.score)} border`}>
                      <span className={getScoreColor(question.score)}>{question.score}/100</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                  {question.question}
                </h3>
              </div>
            </div>

            {/* THIS IS THE CORRECTED LINE: changed && to ? */}
            {question.answer ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h4 className="text-base font-semibold text-gray-900">
                      Your Answer
                    </h4>
                  </div>
                  <div className="pl-4 border-l-2 border-gray-200">
                    {question.answer && <MarkdownRenderer content={question.answer} />}
                  </div>
                </div>

                {question.feedback && (
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="w-1 h-6 bg-green-600 rounded-full mr-3"></div>
                      <h4 className="text-base font-semibold text-gray-900">
                        Feedback & Analysis
                      </h4>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-r-lg shadow-sm">
                      <MarkdownRenderer content={question.feedback} />
                    </div>
                  </div>
                )}

                {question.modelAnswer && (
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      <h4 className="text-base font-semibold text-gray-900">
                        Model Answer
                      </h4>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm">
                      <MarkdownRenderer content={question.modelAnswer} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  No answer provided yet.
                </p>
                <AnswerForm questionIndex={index} interviewId={interview?._id} onAnswerSubmitted={() => fetchInterview(id!)} />
              </>
            )}
          </div>
        ))
      ) : (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No questions available for this interview.
        </div>
      )}

      {interview.status.toLowerCase() === 'in_progress' && (
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium"
            onClick={() => navigate(`/interviews/${id}/session`)}
          >
            Continue Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewDetail;