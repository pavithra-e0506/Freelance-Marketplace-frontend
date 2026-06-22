import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ApplyToJob = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedBudget: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${jobId}`);
        setJob(res.data);
      } catch (error) {
        toast.error('Job not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (user.role !== 'freelancer') {
      toast.error('Only freelancers can apply');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/applications/apply', {
        jobId,
        coverLetter: formData.coverLetter,
        proposedBudget: Number(formData.proposedBudget)
      });
      toast.success('Application submitted! 🎉');
      navigate('/my-applications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-2xl">Loading job details...</div>;
  }

  if (!job) {
    return <div className="text-center text-red-500">Job not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Apply to: {job.title}</h1>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-gray-600">{job.description}</p>
        <p className="text-blue-600 font-bold mt-2">💰 Budget: ${job.budget}</p>
        <p className="text-gray-500 text-sm">Posted by: {job.clientId?.name || 'Unknown'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Why are you perfect for this job?"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Your Proposed Budget ($)</label>
          <input
            type="number"
            name="proposedBudget"
            value={formData.proposedBudget}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your rate"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyToJob;