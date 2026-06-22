import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await API.get('/saved/saved');
        setSavedJobs(res.data);
      } catch (error) {
        toast.error('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await API.delete(`/saved/unsave/${jobId}`);
      setSavedJobs(savedJobs.filter(s => s.jobId._id !== jobId));
      toast.success('Job unsaved!');
    } catch (error) {
      toast.error('Failed to unsave');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">⭐ Saved Jobs</h1>
      {savedJobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No saved jobs yet.</p>
          <Link to="/" className="text-blue-600 hover:underline">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedJobs.map((saved) => (
            <div key={saved._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{saved.jobId.title}</h2>
              <p className="text-gray-600">{saved.jobId.description}</p>
              <p className="text-blue-600 font-bold mt-2">💰 ${saved.jobId.budget}</p>
              <button
                onClick={() => handleUnsave(saved.jobId._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Remove Save
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;