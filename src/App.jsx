import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Import all pages
import Register from './pages/Register';
import Login from './pages/Login';
import JobBoard from './pages/JobBoard';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import ApplyToJob from './pages/ApplyToJob';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs'; 
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<JobBoard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/apply/:jobId" element={<ApplyToJob />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedJobs />} /> {/* ✅ ADDED */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;