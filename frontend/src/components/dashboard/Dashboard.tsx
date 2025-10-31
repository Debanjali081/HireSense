import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resumeAPI, interviewAPI } from '../../services/api';

interface Resume {
  _id: string;
  fileName: string;
  createdAt: string;
}

interface Interview {
  _id: string;
  jobTitle: string;
  status: string;
  createdAt: string;
  overallScore?: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resumesRes, interviewsRes] = await Promise.all([
          resumeAPI.getResumes(),
          interviewAPI.getInterviews(),
        ]);
        setResumes(resumesRes.data);
        setInterviews(interviewsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteResume = async (id: string) => {
    try {
      await resumeAPI.deleteResume(id);
      setResumes(resumes.filter((resume) => resume._id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleDeleteInterview = async (id: string) => {
    try {
      await interviewAPI.deleteInterview(id);
      setInterviews(interviews.filter((interview) => interview._id !== id));
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const averageScore = interviews.length > 0 
    ? Math.round(interviews.reduce((acc, interview) => acc + (interview.overallScore || 0), 0) / interviews.length)
    : 0;

  // HireSense Color Scheme
  const colors = {
    primary: {
      bg: 'bg-blue-900',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-900',
      border: 'border-blue-200',
      lightBg: 'bg-blue-50',
      lightText: 'text-blue-700'
    },
    resumes: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      border: 'border-blue-200',
      lightBg: 'bg-blue-50',
      lightText: 'text-blue-700'
    },
    interviews: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      text: 'text-green-600',
      border: 'border-green-200',
      lightBg: 'bg-green-50',
      lightText: 'text-green-700'
    },
    accent: {
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      text: 'text-purple-600',
      border: 'border-purple-200',
      lightBg: 'bg-purple-50',
      lightText: 'text-purple-700'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, <span className="text-blue-900">{user?.name}</span>
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Ready to ace your next interview? Practice with AI-powered mock interviews 
                  tailored to your resume and career goals.
                </p>
              </div>
              <button
                className={`${colors.primary.bg} ${colors.primary.hover} text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors duration-200`}
                onClick={() => navigate('/resumes/upload')}
              >
                Upload Resume
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Resume Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resumes</h3>
              <span className="text-2xl font-bold text-blue-600">{resumes.length}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Uploaded resumes</p>
            <button
              onClick={() => navigate('/resumes')}
              className={`${colors.resumes.text} hover:${colors.resumes.text}/80 font-medium text-sm transition-colors`}
            >
              View all resumes →
            </button>
          </div>

          {/* Interview Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Interviews</h3>
              <span className="text-2xl font-bold text-green-600">{interviews.length}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Practice sessions completed</p>
            <button
              onClick={() => navigate('/interviews')}
              className={`${colors.interviews.text} hover:${colors.interviews.text}/80 font-medium text-sm transition-colors`}
            >
              View all interviews →
            </button>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Average Score</h3>
              <span className="text-2xl font-bold text-purple-600">
                {interviews.length > 0 ? averageScore : '-'}%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Across all interviews</p>
            <button
              onClick={() => navigate('/interviews/new')}
              className={`${colors.accent.text} hover:${colors.accent.text}/80 font-medium text-sm transition-colors`}
            >
              Start new interview →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Resumes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Resumes</h2>
              <span className={`${colors.resumes.lightText} ${colors.resumes.lightBg} px-3 py-1 rounded-full text-sm font-medium`}>
                {resumes.length} total
              </span>
            </div>
            
            {resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.slice(0, 5).map((resume) => (
                  <div
                    key={resume._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate(`/resumes/${resume._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${colors.resumes.lightBg} rounded-lg flex items-center justify-center`}>
                        <span className="font-semibold text-blue-600">DOC</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resume.fileName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(resume.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResume(resume._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className={`w-16 h-16 ${colors.resumes.lightBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="font-semibold text-blue-600">DOC</span>
                </div>
                <p className="text-gray-600 mb-4">No resumes uploaded yet</p>
                <button
                  onClick={() => navigate('/resumes/upload')}
                  className={`${colors.resumes.bg} ${colors.resumes.hover} text-white px-6 py-2 rounded-lg transition-colors`}
                >
                  Upload Your First Resume
                </button>
              </div>
            )}
          </div>

          {/* Recent Interviews */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Interviews</h2>
              <span className={`${colors.interviews.lightText} ${colors.interviews.lightBg} px-3 py-1 rounded-full text-sm font-medium`}>
                {interviews.length} total
              </span>
            </div>
            
            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.slice(0, 5).map((interview) => (
                  <div
                    key={interview._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate(`/interviews/${interview._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${colors.interviews.lightBg} rounded-lg flex items-center justify-center`}>
                        <span className="font-semibold text-green-600">INT</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          {interview.jobTitle}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="capitalize">{interview.status.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>
                            {new Date(interview.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          {interview.overallScore && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-green-600">
                                {interview.overallScore}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInterview(interview._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className={`w-16 h-16 ${colors.interviews.lightBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="font-semibold text-green-600">INT</span>
                </div>
                <p className="text-gray-600 mb-4">No interviews conducted yet</p>
                <button
                  onClick={() => navigate('/interviews/new')}
                  className={`${colors.interviews.bg} ${colors.interviews.hover} text-white px-6 py-2 rounded-lg transition-colors`}
                >
                  Start Your First Interview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: 'Upload Resume', 
                description: 'Add a new resume', 
                action: () => navigate('/resumes/upload'),
                color: colors.resumes
              },
              { 
                title: 'Start Interview', 
                description: 'Practice with AI', 
                action: () => navigate('/interviews/new'),
                color: colors.interviews
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:shadow-md transition-all duration-200 group hover:border-gray-300"
              >
                <div className={`w-10 h-10 ${item.color.lightBg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <span className={`font-semibold ${item.color.text}`}>
                    {item.title.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;