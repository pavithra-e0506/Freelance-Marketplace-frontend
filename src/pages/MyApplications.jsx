import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications/my-applications');
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-sm ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  if (loading) {
    return <div className="text-center text-2xl">Loading your applications...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{app.jobId?.title || 'Unknown Job'}</h2>
                  <p className="text-gray-600 mt-2">{app.coverLetter}</p>
                  <p className="text-blue-600 font-bold mt-2">💰 Proposed: ${app.proposedBudget}</p>
                  <p className="text-gray-500 text-sm">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={getStatusBadge(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;