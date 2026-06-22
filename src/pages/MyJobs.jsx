import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await API.get('/jobs/myjobs');
        setJobs(res.data);
      } catch (error) {
        toast.error('Failed to fetch your jobs');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  if (loading) {
    return <div className="text-center text-2xl">Loading your jobs...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Jobs</h1>
      {jobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn btn-primary">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-600 mt-2">{job.description}</p>
                  <p className="text-blue-600 font-bold mt-2">💰 ${job.budget}</p>
                  <p className="text-gray-500 text-sm">
                    Status: <span className={`font-semibold ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                      {job.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs; // ← THIS LINE IS IMPORTANT!