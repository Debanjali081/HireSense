import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OAuthSuccess from './components/auth/OAuthSuccess';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Resume Pages
import ResumeList from './components/resume/ResumeList';
import ResumeUpload from './components/resume/ResumeUpload';
import ResumeDetail from './components/resume/ResumeDetail';

// Interview Pages
import InterviewList from './components/interview/InterviewList';
import NewInterview from './components/interview/NewInterview';
import InterviewDetail from './components/interview/InterviewDetail';
import InterviewSession from './components/interview/InterviewSession';
import Home from './pages/Home';

const Layout = () => (
  <>
    <Navbar />
    <div className="pt-16 overflow-auto h-[calc(100vh-4rem)]">
      <Outlet />
    </div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path='/' element={<Home/>}/>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Resume Routes */}
              <Route path="/resumes" element={<ResumeList />} />
              <Route path="/resumes/upload" element={<ResumeUpload />} />
              <Route path="/resumes/:id" element={<ResumeDetail />} />

              {/* Interview Routes */}
              <Route path="/interviews" element={<InterviewList />} />
              <Route path="/interviews/new" element={<NewInterview />} />
              <Route path="/interviews/:id" element={<InterviewDetail />} />
              <Route path="/interviews/:id/session" element={<InterviewSession />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
