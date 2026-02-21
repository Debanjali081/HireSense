import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hiresense-1.onrender.com';

// Configure axios
axios.defaults.baseURL = API_URL;

// Add a request interceptor to add the token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Handle 401 Unauthorized errors - but don't redirect if we're on login/register pages
    // Let the components handle authentication errors themselves
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        const currentPath = window.location.pathname;
        // Only redirect if not on auth pages (login, register, etc.)
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    return axios.post('/auth/login', { email, password });
  },
  register: (name: string, email: string, password: string) => {
    return axios.post('/auth/register', { name, email, password });
  },
  getProfile: () => {
    return axios.get('/auth/profile');
  },
};

// User API
export const userAPI = {
  updateProfile: (userData: unknown) => {
    return axios.put('/users/profile', userData);
  },
};

// Resume API
export const resumeAPI = {
  uploadResume: (formData: FormData) => {
    return axios.post('/api/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getResumes: () => {
    return axios.get('/api/resumes');
  },
  getResume: (id: string) => {
    return axios.get(`/api/resumes/${id}`);
  },
  deleteResume: (id: string) => {
    return axios.delete(`/api/resumes/${id}`);
  },
};

// Interview API
export const interviewAPI = {
  createInterview: (resumeId: string, jobTitle: string) => {
    return axios.post('/api/interviews', { resumeId, jobTitle });
  },
  getInterviews: () => {
    return axios.get('/api/interviews');
  },
  getInterview: (id: string) => {
    return axios.get(`/api/interviews/${id}`);
  },
  generateQuestions: (id: string) => {
    return axios.post(`/api/interviews/${id}/generate-questions`);
  },
  submitAnswer: (id: string, questionIndex: number, answer: string) => {
    return axios.post(`/api/interviews/${id}/answer`, { questionIndex, answer });
  },
  getFeedback: (id: string) => {
    return axios.get(`/api/interviews/${id}/feedback`);
  },
  deleteInterview: (id: string) => {
    return axios.delete(`/api/interviews/${id}`);
  },
};
