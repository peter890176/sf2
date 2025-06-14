import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data.user);
        setForm({
          firstName: response.data.data.user.firstName || '',
          lastName: response.data.data.user.lastName || '',
          phone: response.data.data.user.phone || ''
        });
      } catch (err) {
        setError('Failed to load profile. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || ''
    });
    setSuccess('');
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/users/profile',
        {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUser({ ...user, ...response.data.data.user });
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading profile...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
      {editMode ? (
        <form onSubmit={handleSave} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={`w-full bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors ${
              saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'
            }`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors hover:bg-gray-300"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="mb-4"><strong>Username:</strong> {user.username}</div>
          <div className="mb-4"><strong>Email:</strong> {user.email}</div>
          <div className="mb-4"><strong>Name:</strong> {user.firstName} {user.lastName}</div>
          <div className="mb-4"><strong>Phone:</strong> {user.phone}</div>
          <div className="mb-4"><strong>Registered:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</div>
          <div className="mb-4"><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</div>
          <button
            onClick={handleEdit}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors hover:bg-black"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePage; 