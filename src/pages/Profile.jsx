import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/profile');
        const data = res.data;
        setFormData({
          name: data.name || '',
          skills: data.skills ? data.skills.join(', ') : '',
          bio: data.bio || ''
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        bio: formData.bio
      };
      await API.put('/auth/profile', data);
      toast.success('Profile updated! 🎉');
      setEditing(false);
      // Refresh user context
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👤 My Profile</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-500 text-sm">Name</p>
            <p className="text-lg font-medium">{formData.name || 'Not set'}</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-medium">{user?.email || 'Not set'}</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-500 text-sm">Role</p>
            <p className="text-lg font-medium capitalize">{user?.role || 'Not set'}</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-500 text-sm">Skills</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills ? (
                formData.skills.split(',').map((skill, index) => (
                  <span key={index} className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills added</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Bio</p>
            <p className="text-gray-700 mt-1">{formData.bio || 'No bio yet'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;