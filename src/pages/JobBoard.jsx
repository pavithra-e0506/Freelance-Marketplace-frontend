import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]); // ✅ ADDED

  // Filter states
  const [search, setSearch] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.minBudget) params.append('minBudget', filters.minBudget);
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
      if (filters.skills) params.append('skills', filters.skills);

      const url = `/jobs${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await API.get(url);
      setJobs(res.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADDED: Handle Save Job
  const handleSave = async (jobId) => {
    try {
      await API.post('/saved/save', { jobId });
      toast.success('Job saved! ⭐');
      setSavedJobs([...savedJobs, jobId]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = { search, minBudget, maxBudget, skills };
    setAppliedFilters(filters);
    fetchJobs(filters);
  };

  const clearFilters = () => {
    setSearch('');
    setMinBudget('');
    setMaxBudget('');
    setSkills('');
    setAppliedFilters({});
    fetchJobs({});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📋 Available Jobs</h1>

      {/* Search & Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="🔍 Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Min Budget ($)"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max Budget ($)"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="md:col-span-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        {Object.keys(appliedFilters).length > 0 && ' (filtered)'}
      </p>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
              <p className="text-gray-600 mt-2 flex-grow">
                {job.description.length > 100
                  ? job.description.slice(0, 100) + '...'
                  : job.description}
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-blue-600 font-bold">💰 ${job.budget}</p>
                <p className="text-gray-500 text-sm">
                  Posted by: {job.clientId?.name || 'Unknown'}
                </p>

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-gray-500 text-xs">+{job.skills.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* ✅ UPDATED: Freelancer Buttons */}
              {user?.role === 'freelancer' && (
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/apply/${job._id}`}
                    className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Apply Now
                  </Link>
                  <button
                    onClick={() => handleSave(job._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    ⭐ Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;