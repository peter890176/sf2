import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-md mx-auto text-center mt-10 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Thank you for your purchase!</h1>
      <p className="mb-6">Order ID: <span className="font-mono select-all">{id}</span></p>
      <Link
        to="/orders"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
      >
        View Order History
      </Link>
    </div>
  );
};

export default OrderSuccessPage; 