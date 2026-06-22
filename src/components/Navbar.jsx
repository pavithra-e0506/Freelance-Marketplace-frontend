import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex flex-wrap justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        FreelanceHub 🚀
      </Link>

      {/* Right side - Links */}
      <div className="flex flex-wrap gap-3 items-center">
        {user ? (
          <>
            {/* Show user name */}
            <span className="text-gray-700 font-medium">👋 {user.name}</span>

            {/* Profile Link */}
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
              👤 Profile
            </Link>

            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
              📊 Dashboard
            </Link>
            
            {/* Client Links */}
            {user.role === 'client' && (
              <>
                <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  + Post Job
                </Link>
                <Link to="/my-jobs" className="text-gray-700 hover:text-blue-600 transition">
                  My Jobs
                </Link>
              </>
            )}

            {/* Freelancer Links */}
            {user.role === 'freelancer' && (
              <>
                <Link to="/my-applications" className="text-gray-700 hover:text-blue-600 transition">
                  My Applications
                </Link>
                <Link to="/saved" className="text-gray-700 hover:text-blue-600 transition"> {/* ✅ ADDED */}
                  ⭐ Saved Jobs
                </Link>
              </>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Show Login/Register when NOT logged in */}
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;