import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate('/profile', { state: { view: 'orders' } });
  };

  return (
    <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md">
      <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-3xl font-bold text-gray-800 mt-4">Thank you for your purchase!</h1>
      <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
      <p className="text-sm text-gray-500 mt-4">
        Order ID: <span className="font-mono bg-gray-100 p-1 rounded">{id}</span>
      </p>
      <div className="mt-8">
        <button
          onClick={handleViewOrders}
          className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg transition-colors hover:bg-black"
        >
          View Order History
        </button>
        <Link to="/" className="mt-4 inline-block text-gray-600 hover:text-gray-800">
          &larr; Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 