import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { interviewAPI } from "../../services/api";
import { toast } from "react-toastify";

interface Question {
  question: string;
  answer?: string;
  feedback?: string;
  modelAnswer?: string;
  confidenceScore?: number;
  clarityScore?: number;
  relevanceScore?: number;
}

interface Interview {
  _id: string;
  jobTitle: string;
  status: string;
  questions: Question[];
}

const InterviewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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

      if (response.data.status === "completed") {
        navigate(`/interviews/${interviewId}`);
        toast.info("This interview is already completed.");
        return;
      }

      setInterview(response.data);

      const firstUnansweredIndex = response.data.questions.findIndex(
        (q: Question) => !q.answer
      );
      if (firstUnansweredIndex !== -1) {
        setActiveStep(firstUnansweredIndex);
        setCurrentAnswer(
          response.data.questions[firstUnansweredIndex]?.answer || ""
        );
      } else {
        // All questions answered, navigate to the last question to show complete option
        setActiveStep(response.data.questions.length - 1);
        setCurrentAnswer(
          response.data.questions[response.data.questions.length - 1]?.answer ||
            ""
        );
      }
    } catch (err: unknown) {
      console.error("Error fetching interview:", err);
      const errorMessage =
        err instanceof Error && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to load interview. Please try again."
          : "Failed to load interview. Please try again.";
      setError(errorMessage);
      toast.error("Failed to load interview");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnswer = async () => {
    if (!interview || !id) return;

    try {
      setSaving(true);
      // Submit answer to backend for analysis
      const response = await interviewAPI.submitAnswer(
        id,
        activeStep,
        currentAnswer
      );

      // Update local state with the returned question data (includes feedback)
      const updatedQuestions = [...interview.questions];
      updatedQuestions[activeStep] = {
        ...updatedQuestions[activeStep],
        ...response.data,
      };
      setInterview({ ...interview, questions: updatedQuestions });

      toast.success("Answer saved successfully");
    } catch (err: unknown) {
      console.error("Error saving answer:", err);
      toast.error("Failed to save your answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSaveAnswer();

    if (activeStep < interview!.questions.length - 1) {
      setActiveStep(activeStep + 1);
      setCurrentAnswer(interview!.questions[activeStep + 1]?.answer || "");
    } else {
      // Check if all questions are answered before showing complete dialog
      const allAnswered = interview!.questions.every(
        (q) => q.answer && q.answer.trim() !== ""
      );
      if (allAnswered) {
        setCompleteDialogOpen(true);
      } else {
        toast.warning(
          "Please answer all questions before completing the interview."
        );
      }
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setCurrentAnswer(interview!.questions[activeStep - 1]?.answer || "");
    }
  };

  const handleCompleteInterview = async () => {
    if (!id) return;

    try {
      setSaving(true);
      // Save the current answer if it exists and hasn't been saved yet
      if (
        currentAnswer.trim() &&
        currentAnswer !== interview!.questions[activeStep]?.answer
      ) {
        await handleSaveAnswer();
      }

      // Call API to get feedback, which will mark interview as completed
      await interviewAPI.getFeedback(id);
      toast.success("Interview completed successfully!");

      // 🛑 REMOVE THIS LINE:
      // await fetchInterview(id);
      // This is redundant because fetchInterview() would just navigate, and you navigate on the next line anyway.

      setCompleteDialogOpen(false);
      // Navigate to interview detail page to see results
      navigate(`/interviews/${id}`); // This is all you need
    } catch (err: unknown) {
      console.error("Error completing interview:", err);
      toast.error("Failed to complete interview. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            className="group bg-white/80 backdrop-blur-lg text-gray-700 px-6 py-3 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl border border-white/60 flex items-center mb-6"
            onClick={() => navigate("/interviews")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Interviews
          </button>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">
              Error Loading Interview
            </h3>
            <p className="text-red-600">{error || "Interview not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((activeStep + 1) / interview.questions.length) * 100;
  const answeredQuestions = interview.questions.filter((q) => q.answer).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/60 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {interview.jobTitle}
              </h1>
              <p className="text-gray-600">
                Practice makes perfect! Answer each question to complete your
                interview.
              </p>
            </div>
            <button
              className="group bg-red-50 text-red-600 hover:bg-red-100 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center"
              onClick={() => setExitDialogOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Exit Interview
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {answeredQuestions} of {interview.questions.length}{" "}
                questions answered
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Questions Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/60 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-sm">📋</span>
                </span>
                Questions
              </h3>
              <div className="space-y-2">
                {interview.questions.map((question, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      index === activeStep
                        ? "bg-blue-500 text-white shadow-lg transform scale-105"
                        : question.answer
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveStep(index);
                      setCurrentAnswer(question.answer || "");
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          index === activeStep
                            ? "bg-white/20"
                            : question.answer
                            ? "bg-green-100"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            index === activeStep
                              ? "text-white"
                              : question.answer
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-medium truncate">
                        Question {index + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question & Answer Section */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/60 p-8">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Question {activeStep + 1} of {interview.questions.length}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {interview.questions[activeStep]?.question ||
                      "No question available"}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  {interview.questions[activeStep]?.answer && (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Answered
                    </span>
                  )}
                </div>
              </div>

              {/* Answer Textarea */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600">✏️</span>
                  </span>
                  Your Answer
                </label>
                <textarea
                  rows={8}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here. Be specific and provide examples from your experience..."
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    Minimum 50 characters recommended for detailed answers
                  </span>
                  <span
                    className={`text-sm ${
                      currentAnswer.length < 50
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {currentAnswer.length} characters
                  </span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  className="flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={handlePrevious}
                  disabled={activeStep === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-200 bg-blue-100 text-blue-600 hover:bg-blue-200"
                    onClick={handleSaveAnswer}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Answer"}
                  </button>

                  <button
                    className={`flex items-center px-8 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                      !currentAnswer.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : activeStep === interview.questions.length - 1
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                  >
                    {activeStep < interview.questions.length - 1 ? (
                      <>
                        Next Question
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Complete Interview
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Dialog */}
      {exitDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚪</span>
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">
              Exit Interview?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Your progress will be saved automatically. You can resume this
              interview anytime from your dashboard.
            </p>
            <div className="flex space-x-4">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                onClick={() => setExitDialogOpen(false)}
              >
                Continue Interview
              </button>
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
                onClick={() => {
                  setExitDialogOpen(false);
                  navigate(`/interviews/${id}`);
                }}
              >
                Exit Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Dialog */}
      {completeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">
              Complete Interview?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              You've answered all questions! Once completed, your answers will
              be analyzed and you'll receive detailed feedback.
            </p>
            <div className="flex space-x-4">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                onClick={() => setCompleteDialogOpen(false)}
              >
                Review Answers
              </button>
              <button
                className={`flex-1 px-6 py-3 rounded-xl text-white hover:shadow-lg transition-all font-medium ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-blue-500"
                }`}
                onClick={handleCompleteInterview}
                disabled={saving}
              >
                {saving ? "Completing..." : "Complete & Analyze"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
