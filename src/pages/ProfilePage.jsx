import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import AddressModal from '../components/AddressModal';
import OrderHistory from '../components/OrderHistory';

const ProfilePage = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [currentView, setCurrentView] = useState('profile'); // 'profile' or 'orders'

  useEffect(() => {
    if (location.state?.view === 'orders') {
      setCurrentView('orders');
    }
  }, [location.state]);

  // New states for addresses
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);

  // New states for address modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // Track the address being edited

  const fetchProfileAndAddresses = useCallback(async () => {
    setLoading(true);
    setAddressesLoading(true);
    setError(null);
    try {
      // Fetch user profile
      const profileResponse = await api.get('/api/users/profile');
      const { addresses, ...profileData } = profileResponse.data.data.user;
      setUser(profileData);
      setForm({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phone: profileData.phone || ''
      });
      setLoading(false);

      // Fetch user addresses
      const addressesResponse = await api.get('/api/users/addresses');
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
      const response = await api.put(
        '/api/users/profile',
        {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone
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

  const handleOpenEditModal = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleSaveAddress = (addressData) => {
    if (editingAddress) {
      // Update existing address
      handleUpdateAddress(addressData);
    } else {
      // Add new address
      handleAddNewAddress(addressData);
    }
  };

  const handleAddNewAddress = async (addressData) => {
    setIsAddressSaving(true);
    setError(null);
    try {
      const response = await api.post('/api/users/addresses', addressData);
      // Add new address to the start of the list
      setAddresses(prev => [response.data.data.address, ...prev]);
      setIsModalOpen(false); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address.');
      setIsModalOpen(false);
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleUpdateAddress = async (addressData) => {
    setIsAddressSaving(true);
    setError(null);
    try {
      const response = await api.put(`/api/users/addresses/${editingAddress._id}`, addressData);
      // Update the address in the list
      setAddresses(prev => prev.map(addr => 
        addr._id === editingAddress._id ? response.data.data.address : addr
      ));
      setIsModalOpen(false); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update address.');
      setIsModalOpen(false);
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(
        `/api/users/addresses/${addressId}`
      );
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
      setSuccess('Address deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete address.');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await api.patch(
        `/api/users/addresses/${addressId}/default`,
        {}
      );
      setAddresses(response.data.data.addresses);
      setSuccess('Default address updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update default address.');
      setIsModalOpen(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading profile...</div>;
  if (error && !user) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!user) return null;

  const TabButton = ({ view, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`px-6 py-2 font-medium text-sm rounded-md transition-colors ${
        currentView === view
          ? 'bg-gray-800 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Account</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b pb-4">
        <TabButton view="profile" label="Profile & Addresses" />
        <TabButton view="orders" label="Order History" />
      </div>
      
      {currentView === 'profile' && (
        <>
          {/* Profile Section */}
          <div className="p-6 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
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
              <button 
                onClick={handleOpenAddModal}
                className="bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors hover:bg-black text-sm"
              >
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
                      <button onClick={() => handleOpenEditModal(address)} className="text-sm text-blue-600 hover:underline">Edit</button>
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address._id)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You have no saved addresses.</p>
            )}
          </div>
        </>
      )}

      {currentView === 'orders' && (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <OrderHistory />
        </div>
      )}
      
      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        isSaving={isAddressSaving}
        address={editingAddress}
      />
    </div>
  );
};

export default ProfilePage; 