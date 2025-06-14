import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // New states for addresses
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);

  const fetchProfileAndAddresses = useCallback(async () => {
    setLoading(true);
    setAddressesLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user profile
      const profileResponse = await axios.get('/api/users/profile', { headers });
      setUser(profileResponse.data.data.user);
      setForm({
        firstName: profileResponse.data.data.user.firstName || '',
        lastName: profileResponse.data.data.user.lastName || '',
        phone: profileResponse.data.data.user.phone || ''
      });
      setLoading(false);

      // Fetch user addresses
      const addressesResponse = await axios.get('/api/users/addresses', { headers });
      setAddresses(addressesResponse.data.data.addresses);
      setAddressesLoading(false);

    } catch (err) {
      setError('Failed to load data. Please login again.');
      setLoading(false);
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndAddresses();
  }, [fetchProfileAndAddresses]);

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
  if (error && !user) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto">
      {/* Profile Section */}
      <div className="p-6 bg-white rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
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

      {/* Address Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
          <button className="bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors hover:bg-black text-sm">
            Add New Address
          </button>
        </div>
        {addressesLoading ? (
          <div>Loading addresses...</div>
        ) : addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address._id} className="border p-4 rounded-lg">
                <p className="font-semibold">{address.addressLine}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                {address.isDefault && (
                  <span className="text-xs font-bold bg-gray-200 text-gray-800 rounded-full px-2 py-1 mt-2 inline-block">Default</span>
                )}
                <div className="mt-3 flex gap-2">
                  <button className="text-sm text-blue-600 hover:underline">Edit</button>
                  <button className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no saved addresses.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 