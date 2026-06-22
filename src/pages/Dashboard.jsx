import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard');
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Chart data for jobs/applications over time
  const chartData = {
    labels: stats.jobsOverTime?.map(item => item._id) || stats.applicationsOverTime?.map(item => item._id) || [],
    datasets: [
      {
        label: user?.role === 'client' ? 'Jobs Posted' : 'Applications',
        data: stats.jobsOverTime?.map(item => item.count) || stats.applicationsOverTime?.map(item => item.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: user?.role === 'client' ? 'Jobs Posted Over Time' : 'Applications Over Time',
      },
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {user?.role === 'client' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalJobs || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalApplications || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.acceptedApplications || 0}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalApplications || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.acceptedApplications || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Saved Jobs</p>
              <p className="text-2xl font-bold text-purple-600">{stats.savedJobs || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Application Status</h2>
          <Doughnut
            data={{
              labels: ['Pending', 'Accepted', 'Rejected'],
              datasets: [
                {
                  data: [
                    stats.pendingApplications || 0,
                    stats.acceptedApplications || 0,
                    stats.rejectedApplications || 0
                  ],
                  backgroundColor: ['#FBBF24', '#34D399', '#F87171'],
                  borderWidth: 0,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;