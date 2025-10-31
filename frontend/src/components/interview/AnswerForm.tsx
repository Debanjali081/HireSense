import React, { useState, useRef, useEffect } from 'react';
import { interviewAPI } from '../../services/api';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface AnswerFormProps {
  questionIndex: number;
  interviewId?: string;
  onAnswerSubmitted: () => void;
}

const AnswerForm = ({ questionIndex, interviewId, onAnswerSubmitted }: AnswerFormProps) => {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech Recognition API not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setAnswer(prev => prev + transcript + ' ');
        }
      }
    };

    recognitionRef.current.onerror = (event: Event) => {
      console.error('Speech recognition error', event);
      toast.error('Speech recognition error occurred.');
      setListening(false);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      // UPDATED: The following line was removed to prevent clearing the textarea
      // setAnswer(''); 
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewId) {
      toast.error('Interview ID is missing');
      return;
    }
    if (!answer.trim()) {
      toast.error('Answer cannot be empty');
      return;
    }
    setSubmitting(true);
    try {
      await interviewAPI.submitAnswer(interviewId, questionIndex, answer);
      toast.success('Answer submitted successfully');
      setAnswer('');
      onAnswerSubmitted();
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
        rows={3}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitting || listening}
        placeholder="Your Answer"
      />
      <div className="flex items-center mt-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-full ${listening ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-gray-300`}
        >
          {listening ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
        <button
          type="submit"
          className="ml-4 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 disabled:bg-gray-400"
          disabled={submitting || listening}
        >
          Submit Answer
        </button>
      </div>
      {listening && (
        <p className="text-sm text-gray-600 mt-2">
          Listening...
        </p>
      )}
    </form>
  );
};

export default AnswerForm;