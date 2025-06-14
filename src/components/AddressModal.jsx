import React, { useState, useEffect } from 'react';

const AddressModal = ({ isOpen, onClose, onSave, address, isSaving }) => {
  const [formData, setFormData] = useState({});

  // This effect synchronizes the form state with the props.
  // It runs when the modal is opened or the address to edit changes.
  useEffect(() => {
    if (isOpen) {
      setFormData({
        addressLine: address?.addressLine || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || '',
        isDefault: address?.isDefault || false,
      });
    }
  }, [isOpen, address]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{address ? 'Edit Address' : 'Add New Address'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700">Address Line</label>
            <input type="text" name="addressLine" id="addressLine" value={formData.addressLine} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="flex-1">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
          </div>
          <div className="flex items-center mb-6">
            <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">Set as default address</label>
          </div>
          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className={`px-4 py-2 text-white rounded-md ${isSaving ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal; 