import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, BookOpen, CheckCircle2, TrendingUp, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-slate-400 animate-ping"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">Loading interview details...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-8 mb-8">
        <button
          className="mb-6 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 flex items-center transition-colors shadow-sm"
          onClick={() => navigate('/interviews')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Interviews
        </button>
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-sm">
          <p className="text-base font-medium">{error || 'Interview not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 mb-8">
      <div className="flex justify-between items-center mb-8">
        <button
          className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 flex items-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => navigate('/interviews')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Interviews
        </button>
        <button
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 flex items-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
              handleDelete();
            }
          }}
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Interview
        </button>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {interview.jobTitle}
            </h1>
            <p className="text-gray-600 text-lg flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(interview.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
            interview.status.toLowerCase() === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
            interview.status.toLowerCase() === 'in_progress' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
            'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
          }`}>
            {formatStatus(interview.status)}
          </span>
        </div>

        {interview.status.toLowerCase() === 'completed' && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-3 text-blue-600" />
              Overall Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 mr-3 text-blue-600" />
                  <h3 className="text-base font-medium text-gray-900">Score</h3>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(interview.overallScore || 0)}`}>
                  {interview.overallScore !== undefined ? `${interview.overallScore}/100` : 'N/A'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
                  <h3 className="text-base font-medium text-gray-900">Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
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
          <div key={question._id} className="bg-white p-8 rounded-2xl shadow-lg mb-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md">
                    Question {index + 1}
                  </span>
                  {question.score !== undefined && (
                    <div className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-sm border-2 ${getScoreBgColor(question.score)}`}>
                      <span className={`${getScoreColor(question.score)} font-bold`}>{question.score}</span>
                      <span className="text-gray-600 font-normal">/100</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-relaxed tracking-tight">
                  {question.question}
                </h3>
              </div>
            </div>

            {question.answer ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-md">
                  <div className="bg-gradient-to-r from-slate-100 to-gray-100 px-6 py-4 border-b-2 border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-slate-600 rounded-lg shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                        Your Answer
                      </h4>
                    </div>
                  </div>
                  <div className="px-6 py-6">
                    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                      {question.answer && <MarkdownRenderer content={question.answer} />}
                    </div>
                  </div>
                </div>

                {question.feedback && (
                  <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl border-2 border-emerald-200 overflow-hidden transition-all duration-300 hover:border-emerald-300 hover:shadow-md">
                    <div className="bg-gradient-to-r from-emerald-100 to-green-100 px-6 py-4 border-b-2 border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-lg shadow-sm">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                          AI Feedback & Analysis
                        </h4>
                      </div>
                    </div>
                    <div className="px-6 py-6">
                      <div className="prose prose-emerald max-w-none prose-headings:font-bold prose-headings:text-emerald-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-li:text-gray-800 prose-strong:text-emerald-900 prose-strong:font-bold prose-code:text-emerald-900 prose-code:bg-emerald-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-a:text-emerald-700 prose-a:font-semibold">
                        <MarkdownRenderer content={question.feedback} />
                      </div>
                    </div>
                  </div>
                )}

                {question.modelAnswer && (
                  <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 rounded-xl border-2 border-blue-200 overflow-hidden transition-all duration-300 hover:border-blue-300 hover:shadow-md">
                    <div className="bg-gradient-to-r from-blue-100 to-sky-100 px-6 py-4 border-b-2 border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg shadow-sm">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                          Model Answer
                        </h4>
                        <span className="ml-auto text-xs font-semibold text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                          Reference
                        </span>
                      </div>
                    </div>
                    <div className="px-6 py-6">
                      <div className="prose prose-blue max-w-none prose-headings:font-bold prose-headings:text-blue-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-li:text-gray-800 prose-strong:text-blue-900 prose-strong:font-bold prose-code:text-blue-900 prose-code:bg-blue-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-a:text-blue-700 prose-a:font-semibold">
                        <MarkdownRenderer content={question.modelAnswer} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl mb-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-900 font-medium">
                      No answer provided yet. Submit your response below.
                    </p>
                  </div>
                </div>
                <AnswerForm questionIndex={index} interviewId={interview?._id} onAnswerSubmitted={() => fetchInterview(id!)} />
              </div>
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